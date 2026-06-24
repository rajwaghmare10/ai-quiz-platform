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

const updateQuestion = async (
  req,
  res
) => {

  try {

    const question =
      await questionService.updateQuestion(
        req.params.questionId,
        req.user.userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

const deleteQuestion = async (
  req,
  res
) => {

  try {

    const question =
      await questionService.deleteQuestion(
        req.params.questionId,
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      data: question
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  uploadExcelQuestions,
  updateQuestion,
  deleteQuestion
};