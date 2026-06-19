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

  const questions =
    await questionRepository.getQuestionsByQuizId(
      attempt.quiz_id
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

module.exports = {
  startQuiz,
  submitQuiz,
  getResult
};