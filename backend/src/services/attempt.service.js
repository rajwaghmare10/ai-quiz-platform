const attemptRepository =
  require("../repositories/attempt.repository");

  const quizRepository =
  require("../repositories/quiz.repository");

const classRepository =
  require("../repositories/class.repository");

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

  return await attemptRepository.createAttempt(
    quizId,
    studentId
  );
};

module.exports = {
  startQuiz
};