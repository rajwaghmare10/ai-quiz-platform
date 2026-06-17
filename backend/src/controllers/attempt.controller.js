const attemptService =
  require("../services/attempt.service");

const startQuiz = async (
  req,
  res
) => {

  try {

    const attempt =
      await attemptService.startQuiz(
        req.params.quizId,
        req.user.userId
      );

    return res.status(201).json({
      success: true,
      data: attempt
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  startQuiz
};