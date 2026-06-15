
const classRepository = require("../repositories/class.repository");
const quizRepository = require("../repositories/quiz.repository");

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

module.exports = {
    createQuiz
};