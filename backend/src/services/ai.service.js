const aiGenerationLogRepository = require("../repositories/aiGenerationLog.repository");

const questionRepository = require("../repositories/question.repository");

const quizRepository = require("../repositories/quiz.repository");

const generateQuestions = async ({
    topic,
    difficulty,
    questionCount,
    quizId,
    teacherId
}) => {

    await aiGenerationLogRepository.createLog({
        quizId,
        teacherId,
        sourceType: "topic",
        sourceContent: JSON.stringify({
            topic,
            difficulty,
            questionCount
        }),
        status: "success"
    });

    const questions = [];

    for (
        let i = 1;
        i <= questionCount;
        i++
    ) {

        questions.push({
            question_text:
                `${topic} Question ${i} (${difficulty})`,
            options: {
                1: "Option A",
                2: "Option B",
                3: "Option C",
                4: "Option D"
            },
            correct_option: 1,
            marks: 1
        });

    }

    return questions;
};

const saveGeneratedQuestions = async ({
    quizId,
    questions
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