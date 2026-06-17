const pool = require("../config/db");

const findAttemptByQuizAndStudent = async (
  quizId,
  studentId
) => {

  const query = `
    SELECT *
    FROM quiz_attempts
    WHERE quiz_id = $1
    AND student_id = $2
  `;

  const result = await pool.query(
    query,
    [quizId, studentId]
  );

  return result.rows[0];
};

const createAttempt = async (
  quizId,
  studentId
) => {

  const query = `
    INSERT INTO quiz_attempts
    (
      quiz_id,
      student_id,
      score,
      status,
      started_at
    )
    VALUES
    (
      $1,
      $2,
      0,
      'in_progress',
      NOW()
    )
    RETURNING *
  `;

  const result = await pool.query(
    query,
    [quizId, studentId]
  );

  return result.rows[0];
};

module.exports = {
  findAttemptByQuizAndStudent,
  createAttempt
};