const XLSX = require("xlsx");
const fs = require("fs");

const questionRepository = require("../repositories/question.repository");
const quizRepository = require("../repositories/quiz.repository");
const classRepository = require("../repositories/class.repository");

const processExcelQuestions = async (
  quizId,
  filePath
) => {

  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet);

  const questions = rows.map((row) => ({
    question_text: row["Question"],
    options: {
      1: row["Option A"],
      2: row["Option B"],
      3: row["Option C"],
      4: row["Option D"]
    },
    correct_option: row["Correct Option"],
    marks: row["Marks"],
    question_source: "EXCEL"
  }));

  const savedQuestions =
    await questionRepository.createQuestions(
      quizId,
      questions
    );

  await quizRepository.updateTotalQuestions(
    quizId,
    questions.length
  );

  fs.unlinkSync(filePath);

  return savedQuestions;
};

const updateQuestion = async (
  questionId,
  teacherId,
  {
    questionText,
    options,
    correctOption,
    marks
  }
) => {

  const existingQuestion =
    await questionRepository.getQuestionById(
      questionId
    );

  if (!existingQuestion) {
    throw new Error(
      "Question not found"
    );
  }

  const quiz =
    await quizRepository.getQuizById(
      existingQuestion.quiz_id
    );

  const classData =
    await classRepository.findClassById(
      quiz.class_id
    );

  if (
    classData.teacher_id !==
    teacherId
  ) {
    throw new Error(
      "Access denied"
    );
  }

  if (!questionText) {
    throw new Error(
      "Question text is required"
    );
  }

  if (
    !options ||
    Object.keys(options).length !== 4
  ) {
    throw new Error(
      "Exactly 4 options are required"
    );
  }

  if (
    ![1, 2, 3, 4].includes(
      Number(correctOption)
    )
  ) {
    throw new Error(
      "Correct option must be between 1 and 4"
    );
  }

  if (
    Number(marks) <= 0
  ) {
    throw new Error(
      "Marks must be greater than 0"
    );
  }

  return await questionRepository.updateQuestion(
    questionId,
    {
      questionText,
      options,
      correctOption,
      marks
    }
  );
};

const deleteQuestion = async (
  questionId,
  teacherId
) => {

  const existingQuestion =
    await questionRepository.getQuestionById(
      questionId
    );

  if (!existingQuestion) {
    throw new Error(
      "Question not found"
    );
  }

  const quiz =
    await quizRepository.getQuizById(
      existingQuestion.quiz_id
    );

  const classData =
    await classRepository.findClassById(
      quiz.class_id
    );

  if (
    classData.teacher_id !==
    teacherId
  ) {
    throw new Error(
      "Access denied"
    );
  }

  const deletedQuestion =
    await questionRepository.deleteQuestion(
      questionId
    );

  await quizRepository.decreaseTotalQuestions(
    existingQuestion.quiz_id
  );

  return deletedQuestion;
};


module.exports = {
  processExcelQuestions,
  updateQuestion,
  deleteQuestion
};