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

const getQuizAttempts = async (
  req,
  res
) => {

  try {

    const attempts =
      await attemptService.getQuizAttempts(
        req.params.quizId,
        req.user.userId
      );

    return res.status(200).json({
      success: true,
      data: attempts
    });

  } catch (error) {

    return res.status(400).json({
      success: false,
      message: error.message
    });

  }

};


const getAttemptQuestions = async (
  req,
  res
) => {

  try {

    const questions =
      await attemptService.getAttemptQuestions(
        req.params.attemptId
      );

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

const exportQuizResults = async (
  req,
  res
) => {

  try {

    const workbook =
      await attemptService.exportQuizResults(
        req.params.quizId,
        req.user.userId
      );

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=quiz-results.xlsx"
    );

    await workbook.xlsx.write(
      res
    );

    res.end();

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
  getResult,
  getQuizAttempts,
  getAttemptQuestions,
  exportQuizResults
};