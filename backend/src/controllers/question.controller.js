const questionService =
require("../services/question.service");

const uploadExcelQuestions = async (
  req,
  res
) => {

  try {

    const questions =
      await questionService.processExcelQuestions(
        req.params.quizId,
        req.file.path
      );

    return res.status(201).json({
      success: true,
      totalQuestions: questions.length
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  uploadExcelQuestions
};