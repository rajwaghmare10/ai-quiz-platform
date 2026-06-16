
const classRepository = require("../repositories/class.repository");
const quizRepository = require("../repositories/quiz.repository");
const questionRepository = require("../repositories/question.repository");

const createQuiz = async ({
    classId,
    title,
    durationMinutes,
    startTime,
    endTime,
    teacherId
}) => {

    const foundClass =
        await classRepository
            .findClassById(
                classId
            );

    if (!foundClass) {
        throw new Error(
            "Class not found"
        );
    }

    if (
        foundClass.teacher_id
        !== teacherId
    ) {
        throw new Error(
            "You do not own this class"
        );
    }

    return await quizRepository
        .createQuiz({
            classId,
            title,
            durationMinutes,
            startTime,
            endTime
        });
};

const getQuizDetails = async (quizId) => {

  const quiz =
    await quizRepository.getQuizById(
      quizId
    );

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const questions =
    await questionRepository.getQuestionsByQuizId(
      quizId
    );


  return {
    ...quiz,
    questions
  };
};
module.exports = {
    createQuiz,
    getQuizDetails
};