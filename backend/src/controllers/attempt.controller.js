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

const submitQuiz = async (
  req,
  res
) => {

  try {

    const result =
      await attemptService.submitQuiz(
        req.params.attemptId,
        req.body.answers
      );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

const getResult = async (
  req,
  res
) => {

  try {

    const result =
      await attemptService.getResult(
        req.params.attemptId
      );

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  startQuiz,
  submitQuiz,
  getResult
};