const quizService =
    require("../services/quiz.service");

const createQuiz = async (
    req,
    res
) => {

    try {

        const quiz =
            await quizService.createQuiz({
                ...req.body,
                teacherId:
                    req.user.userId
            });

        return res.status(201).json({
            success: true,
            data: quiz
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createQuiz
};