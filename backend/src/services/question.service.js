const XLSX = require("xlsx");
const fs = require("fs");

const questionRepository = require("../repositories/question.repository");
const quizRepository = require("../repositories/quiz.repository");

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

module.exports = {
  processExcelQuestions
};