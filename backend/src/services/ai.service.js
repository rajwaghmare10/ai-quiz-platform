const aiGenerationLogRepository = require("../repositories/aiGenerationLog.repository");

const questionRepository = require("../repositories/question.repository");

const quizRepository = require("../repositories/quiz.repository");

const classRepository = require("../repositories/class.repository");

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateQuestions = async ({
    topic,
    difficulty,
    questionCount,
    quizId,
    teacherId
}) => {

    if (!topic || !topic.trim()) {
        throw new Error("Topic is required");
    }

    if (!["easy", "medium", "hard"].includes(difficulty)) {
        throw new Error("Difficulty must be easy, medium, or hard");
    }

    if (!questionCount || questionCount < 1) {
        throw new Error("Question count must be at least 1");
    }

    const sourceContent = JSON.stringify({
        topic,
        difficulty,
        questionCount
    });

    const prompt = `
Generate exactly ${questionCount} multiple-choice questions on the topic "${topic}" at ${difficulty} difficulty level, suitable for a college-level MCA/BCA exam.

Return ONLY a JSON array, no other text, matching this exact structure:
[
  {
    "question_text": "string",
    "options": { "1": "string", "2": "string", "3": "string", "4": "string" },
    "correct_option": 1,
    "marks": 1
  }
]

Rules:
- correct_option must be an integer from 1 to 4, matching the correct entry in "options".
- Each question must have exactly 4 distinct, plausible options.
- marks should be 1 for easy, 1 for medium, 1 for hard difficulty.
- Do not repeat questions.
`;

    let rawText;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        rawText = response.text;

    } catch (error) {

        await aiGenerationLogRepository.createLog({
            quizId,
            teacherId,
            sourceType: "topic",
            sourceContent,
            status: "failed"
        });

        throw new Error("Failed to generate questions from AI. Please try again.");
    }

    let parsedQuestions;

    try {
        parsedQuestions = JSON.parse(rawText);
    } catch (error) {

        await aiGenerationLogRepository.createLog({
            quizId,
            teacherId,
            sourceType: "topic",
            sourceContent,
            status: "failed"
        });

        throw new Error("AI returned an invalid response. Please try again.");
    }

    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {

        await aiGenerationLogRepository.createLog({
            quizId,
            teacherId,
            sourceType: "topic",
            sourceContent,
            status: "failed"
        });

        throw new Error("AI did not return any questions. Please try again.");
    }

    const validQuestions = parsedQuestions.filter((q) => {
        return (
            q.question_text &&
            q.options &&
            Object.keys(q.options).length === 4 &&
            [1, 2, 3, 4].includes(Number(q.correct_option)) &&
            Number(q.marks) > 0
        );
    });

    if (validQuestions.length === 0) {

        await aiGenerationLogRepository.createLog({
            quizId,
            teacherId,
            sourceType: "topic",
            sourceContent,
            status: "failed"
        });

        throw new Error("AI-generated questions were not in a valid format. Please try again.");
    }

    await aiGenerationLogRepository.createLog({
        quizId,
        teacherId,
        sourceType: "topic",
        sourceContent,
        status: "success"
    });

    return validQuestions;
};

const saveGeneratedQuestions = async ({
    quizId,
    questions,
    teacherId
}) => {

    if (!quizId) {
        throw new Error(
            "Quiz ID is required"
        );
    }

    if (
        !questions ||
        questions.length === 0
    ) {
        throw new Error(
            "Questions are required"
        );
    }
    
    const quiz = await quizRepository.getQuizById(quizId);

    if (!quiz) {
        throw new Error("Quiz not found");
    }

    const foundClass = await classRepository.findClassById(quiz.class_id);

    if (foundClass.teacher_id !== teacherId) {
        throw new Error("You do not own this quiz");
    }
    
    for (
        const question
        of questions
    ) {

        if (
            !question.question_text
        ) {
            throw new Error(
                "Question text is required"
            );
        }

        if (
            !question.options ||
            Object.keys(
                question.options
            ).length !== 4
        ) {
            throw new Error(
                "Exactly 4 options are required"
            );
        }

        if (
            ![1, 2, 3, 4].includes(
                Number(
                    question.correct_option
                )
            )
        ) {
            throw new Error(
                "Correct option must be between 1 and 4"
            );
        }

        if (
            Number(
                question.marks
            ) <= 0
        ) {
            throw new Error(
                "Marks must be greater than 0"
            );
        }

        if (
            !question.question_source
        ) {
            throw new Error(
                "Question source is required"
            );
        }

    }

    const uniqueQuestions = [];

    for (
        const question
        of questions
    ) {

        const existingQuestion =
            await questionRepository.findQuestionByText(
                quizId,
                question.question_text
            );

        if (
            !existingQuestion
        ) {
            uniqueQuestions.push(
                question
            );
        }

    }

    if (
        uniqueQuestions.length === 0
    ) {
        throw new Error(
            "All questions already exist in this quiz"
        );
    }

    const savedQuestions =
        await questionRepository.createQuestions(
            quizId,
            uniqueQuestions
        );

    await quizRepository.updateTotalQuestions(
        quizId,
        uniqueQuestions.length
    );

    return savedQuestions;
};

module.exports = {
    generateQuestions,
    saveGeneratedQuestions
};