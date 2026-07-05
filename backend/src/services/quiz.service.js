
const classRepository = require("../repositories/class.repository");
const quizRepository = require("../repositories/quiz.repository");
const questionRepository = require("../repositories/question.repository");

const createQuiz = async ({
    classId,
    title,
    durationMinutes,
    startTime,
    endTime,
    questionsPerAttempt,
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
    if (new Date(endTime) <= new Date(startTime)) {
        throw new Error(
            "End time must be after start time"
        );
    }
    return await quizRepository.createQuiz({
        classId,
        title,
        durationMinutes,
        startTime,
        endTime,
        questionsPerAttempt
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

const getQuizzesByClassId = async (classId, userId, role) => {

    const foundClass = await classRepository.findClassById(classId);

    if (!foundClass) {
        throw new Error("Class not found");
    }

    if (role === "teacher") {
        if (foundClass.teacher_id !== userId) {
            throw new Error("You do not own this class");
        }
    } else if (role === "student") {
        const isMember = await classRepository.isStudentInClass(classId, userId);
        if (!isMember) {
            throw new Error("You are not enrolled in this class");
        }
    }

    return await quizRepository.getQuizzesByClassId(classId);
};

const deleteQuiz = async (quizId, teacherId) => {
  const quiz = await quizRepository.getQuizById(quizId);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const foundClass = await classRepository.findClassById(quiz.class_id);

  if (foundClass.teacher_id !== teacherId) {
    throw new Error("You do not own this quiz");
  }

  return await quizRepository.deleteQuiz(quizId);
};


const updateQuiz = async (
  quizId,
  teacherId,
  { title, durationMinutes, startTime, endTime, questionsPerAttempt }
) => {

  const quiz = await quizRepository.getQuizById(quizId);

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  const foundClass = await classRepository.findClassById(quiz.class_id);

  if (foundClass.teacher_id !== teacherId) {
    throw new Error("You do not own this quiz");
  }

  if (new Date(endTime) <= new Date(startTime)) {
    throw new Error("End time must be after start time");
  }

  return await quizRepository.updateQuiz(quizId, {
    title,
    durationMinutes,
    startTime,
    endTime,
    questionsPerAttempt
  });
};

module.exports = {
    createQuiz,
    getQuizDetails,
    getQuizzesByClassId,
    deleteQuiz,
    updateQuiz
};