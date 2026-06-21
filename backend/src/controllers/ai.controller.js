const aiService =
    require("../services/ai.service");

const generateQuestions = async (
    req,
    res
) => {

    try {

        const questions =
            await aiService.generateQuestions({
                ...req.body,
                teacherId: req.user.userId
            });

        return res.status(200).json({
            success: true,
            data: questions
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

const saveGeneratedQuestions = async (
    req,
    res
) => {

    try {

        const questions =
            await aiService.saveGeneratedQuestions(
                req.body
            );

        return res.status(201).json({
            success: true,
            data: questions
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    generateQuestions,
    saveGeneratedQuestions
};