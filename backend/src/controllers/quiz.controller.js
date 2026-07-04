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

const getQuizDetails = async (
  req,
  res
) => {

  try {

    const data =
      await quizService.getQuizDetails(
        req.params.quizId
      );

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message
    });

  }

};

const getQuizzesByClass = async (req, res) => {
  try {
    const quizzes = await quizService.getQuizzesByClassId(
      req.params.classId,
      req.user.userId,
      req.user.role
    );
    return res.status(200).json({ success: true, data: quizzes });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    await quizService.deleteQuiz(req.params.quizId, req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createQuiz,
  getQuizDetails,
  getQuizzesByClass,
  deleteQuiz
};