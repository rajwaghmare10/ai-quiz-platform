const pool = require("../config/db");

const createQuiz = async ({
  classId,
  title,
  durationMinutes,
  startTime,
  endTime,
  questionsPerAttempt
}) => {

  const query = `
        INSERT INTO quizzes
        (
            class_id,
            title,
            duration_minutes,
            start_time,
            end_time,
            total_questions,
            questions_per_attempt
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        )
        RETURNING *
    `;

  const result = await pool.query(
    query,
    [
      classId,
      title,
      durationMinutes,
      startTime,
      endTime,
      0,
      questionsPerAttempt
    ]
  );

  return result.rows[0];
};

const updateTotalQuestions = async (
  quizId,
  totalQuestions
) => {

  const query = `
    UPDATE quizzes
SET total_questions = total_questions + $1
WHERE quiz_id = $2
  `;

  await pool.query(query, [
    totalQuestions,
    quizId
  ]);
};

const getQuizById = async (quizId) => {

  const query = `
    SELECT *
    FROM quizzes
    WHERE quiz_id = $1
  `;

  const result = await pool.query(
    query,
    [quizId]
  );

  return result.rows[0];
};

const decreaseTotalQuestions = async (
  quizId
) => {

  const query = `
    UPDATE quizzes
    SET total_questions =
      total_questions - 1
    WHERE quiz_id = $1
  `;

  await pool.query(
    query,
    [quizId]
  );
};

module.exports = {
  createQuiz,
  updateTotalQuestions,
  getQuizById,
  decreaseTotalQuestions
};