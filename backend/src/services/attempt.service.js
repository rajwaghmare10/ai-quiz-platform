const ExcelJS = require("exceljs");

const attemptRepository =
  require("../repositories/attempt.repository");

const quizRepository =
  require("../repositories/quiz.repository");

const classRepository =
  require("../repositories/class.repository");

const questionRepository =
  require("../repositories/question.repository");

const studentAnswerRepository =
  require("../repositories/studentAnswer.repository");

const attemptQuestionRepository = require("../repositories/attemptQuestion.repository");

const startQuiz = async (
  quizId,
  studentId
) => {

  const quiz =
    await quizRepository.getQuizById(
      quizId
    );

  if (!quiz) {
    throw new Error(
      "Quiz not found"
    );
  }

  const member =
    await classRepository.isStudentInClass(
      quiz.class_id,
      studentId
    );

  if (!member) {
    throw new Error(
      "You are not enrolled in this class"
    );
  }

  const existingAttempt =
    await attemptRepository.findAttemptByQuizAndStudent(
      quizId,
      studentId
    );

  if (existingAttempt) {
    throw new Error(
      "Quiz already started"
    );
  }

  const attempt = await attemptRepository.createAttempt(
    quizId,
    studentId
  );

  const questions = await questionRepository.getQuestionsByQuizId(
    quizId
  );

  const shuffledQuestions = questions.sort(
    () => Math.random() - 0.5
  );

  const selectedQuestions = shuffledQuestions.slice(
    0,
    quiz.questions_per_attempt
  );

  await attemptQuestionRepository.saveAttemptQuestions(
    attempt.attempt_id,
    selectedQuestions.map(
      question => question.question_id
    )
  );

  return attempt;
};

const submitQuiz = async (
  attemptId,
  answers
) => {

  const attempt =
    await attemptRepository.getAttemptById(
      attemptId
    );

  if (!attempt) {
    throw new Error(
      "Attempt not found"
    );
  }

  if (attempt.status === "submitted") {
    throw new Error(
      "Quiz already submitted"
    );
  }

  const assignedQuestions =
    await attemptQuestionRepository.getQuestionIdsByAttemptId(
      attemptId
    );

  const questionIds =
    assignedQuestions.map(
      item => item.question_id
    );

  const questions =
    await questionRepository.getQuestionsByIds(
      questionIds
    );

  let score = 0;

  const answersToSave = [];

  for (const answer of answers) {

    const question =
      questions.find(
        q => q.question_id === answer.questionId
      );

    if (!question) {
      continue;
    }

    const isCorrect =
      Number(answer.selectedOption) ===
      question.correct_option;

    if (isCorrect) {
      score += question.marks;
    }

    answersToSave.push({
      attemptId,
      questionId: answer.questionId,
      selectedOption: answer.selectedOption,
      isCorrect
    });

  }

  await studentAnswerRepository.createStudentAnswers(
    answersToSave
  );

  const updatedAttempt =
    await attemptRepository.updateAttempt(
      attemptId,
      score
    );

  return updatedAttempt;
};


const getResult = async (
  attemptId
) => {

  const attempt =
    await attemptRepository.getResultByAttemptId(
      attemptId
    );

  if (!attempt) {
    throw new Error(
      "Attempt not found"
    );
  }

  const correctAnswers =
    await studentAnswerRepository.getCorrectAnswerCount(
      attemptId
    );

  return {
    score: attempt.score,
    status: attempt.status,
    correctAnswers
  };
};

const getQuizAttempts = async (
  quizId,
  teacherId
) => {

  const quiz =
    await quizRepository.getQuizById(
      quizId
    );

  if (!quiz) {
    throw new Error(
      "Quiz not found"
    );
  }

  const classData =
    await classRepository.findClassById(
      quiz.class_id
    );

  if (
    classData.teacher_id !== teacherId
  ) {
    throw new Error(
      "Access denied"
    );
  }

  return await attemptRepository.getAttemptsByQuizId(
    quizId
  );
};

const getAttemptQuestions = async (
  attemptId
) => {

  const assignedQuestions =
    await attemptQuestionRepository.getQuestionIdsByAttemptId(
      attemptId
    );

  const questionIds =
    assignedQuestions.map(
      item => item.question_id
    );

  const questions =
    await questionRepository.getQuestionsByIds(
      questionIds
    );

  return questions.map(
    ({
      correct_option,
      ...question
    }) => question
  );

};

const exportQuizResults = async (
  quizId,
  teacherId
) => {

  const quiz =
    await quizRepository.getQuizById(
      quizId
    );

  if (!quiz) {
    throw new Error(
      "Quiz not found"
    );
  }

  const classData =
    await classRepository.findClassById(
      quiz.class_id
    );

  if (
    classData.teacher_id !== teacherId
  ) {
    throw new Error(
      "Access denied"
    );
  }

  const attempts =
    await attemptRepository.getAttemptsByQuizId(
      quizId
    );

  const workbook =
    new ExcelJS.Workbook();

  const worksheet =
    workbook.addWorksheet(
      "Results"
    );

  worksheet.columns = [
    {
      header: "Student Name",
      key: "name",
      width: 25
    },
    {
      header: "Email",
      key: "email",
      width: 30
    },
    {
      header: "Score",
      key: "score",
      width: 15
    },
    {
      header: "Status",
      key: "status",
      width: 15
    },
    {
      header: "Submitted At",
      key: "submitted_at",
      width: 30
    }
  ];

  attempts.forEach(
    (attempt) => {
      worksheet.addRow(attempt);
    }
  );

  return workbook;
};

module.exports = {
  startQuiz,
  submitQuiz,
  getResult,
  getQuizAttempts,
  getAttemptQuestions,
  exportQuizResults
};