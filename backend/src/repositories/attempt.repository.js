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

const getAttemptById = async (
  attemptId
) => {

  const query = `
    SELECT *
    FROM quiz_attempts
    WHERE attempt_id = $1
  `;

  const result = await pool.query(
    query,
    [attemptId]
  );

  return result.rows[0];
};

const updateAttempt = async (
  attemptId,
  score
) => {

  const query = `
    UPDATE quiz_attempts
    SET
      score = $1,
      status = 'submitted',
      submitted_at = NOW()
    WHERE attempt_id = $2
    RETURNING *
  `;

  const result = await pool.query(
    query,
    [score, attemptId]
  );

  return result.rows[0];
};

const getResultByAttemptId = async (
  attemptId
) => {

  const query = `
    SELECT *
    FROM quiz_attempts
    WHERE attempt_id = $1
  `;

  const result = await pool.query(
    query,
    [attemptId]
  );

  return result.rows[0];
};

const getAttemptsByQuizId = async (
  quizId
) => {

  const query = `
    SELECT
      qa.attempt_id,
      qa.score,
      qa.status,
      qa.started_at,
      qa.submitted_at,
      u.user_id,
      u.name,
      u.email
    FROM quiz_attempts qa
    JOIN users u
      ON qa.student_id = u.user_id
    WHERE qa.quiz_id = $1
    ORDER BY qa.submitted_at DESC
  `;

  const result = await pool.query(
    query,
    [quizId]
  );

  return result.rows;
};

module.exports = {
  findAttemptByQuizAndStudent,
  createAttempt,
  getAttemptById,
  updateAttempt,
  getResultByAttemptId,
  getAttemptsByQuizId
};