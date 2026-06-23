const pool = require("../config/db");

const createQuestions = async (
  quizId,
  questions
) => {

  const values = [];
  const placeholders = [];

  questions.forEach((question, index) => {
    const baseIndex = index * 6;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6})`
    );

    values.push(
      quizId,
      question.question_text,
      JSON.stringify(question.options),
      question.correct_option,
      question.marks,
      question.question_source
    );
  });

  const query = `
    INSERT INTO questions (
      quiz_id,
      question_text,
      options,
      correct_option,
      marks,
      question_source
    )
    VALUES ${placeholders.join(",")}
    RETURNING *
  `;

  const result = await pool.query(query, values);

  return result.rows;
};

const getQuestionsByQuizId = async (
  quizId
) => {

  const query = `
    SELECT *
    FROM questions
    WHERE quiz_id = $1
    ORDER BY question_id
  `;

  const result = await pool.query(
    query,
    [quizId]
  );

  return result.rows;
};

const getQuestionsByIds = async (questionIds) => {

    const result = await pool.query(
        `
        SELECT *
        FROM questions
        WHERE question_id = ANY($1)
        `,
        [questionIds]
    );

    return result.rows;
};

const findQuestionByText = async (
  quizId,
  questionText
) => {

  const query = `
    SELECT *
    FROM questions
    WHERE quiz_id = $1
    AND LOWER(question_text) = LOWER($2)
  `;

  const result = await pool.query(
    query,
    [
      quizId,
      questionText
    ]
  );

  return result.rows[0];
};

const updateQuestion = async (
  questionId,
  {
    questionText,
    options,
    correctOption,
    marks
  }
) => {

  const query = `
    UPDATE questions
    SET
      question_text = $1,
      options = $2,
      correct_option = $3,
      marks = $4
    WHERE question_id = $5
    RETURNING *
  `;

  const result = await pool.query(
    query,
    [
      questionText,
      JSON.stringify(options),
      correctOption,
      marks,
      questionId
    ]
  );

  return result.rows[0];
};

const getQuestionById = async (
  questionId
) => {

  const query = `
    SELECT *
    FROM questions
    WHERE question_id = $1
  `;

  const result = await pool.query(
    query,
    [questionId]
  );

  return result.rows[0];
};

const deleteQuestion = async (
  questionId
) => {

  const query = `
    DELETE FROM questions
    WHERE question_id = $1
    RETURNING *
  `;

  const result = await pool.query(
    query,
    [questionId]
  );

  return result.rows[0];
};

module.exports = {
  createQuestions,
  getQuestionsByQuizId,
  getQuestionsByIds,
  findQuestionByText,
  updateQuestion,
  getQuestionById,
  deleteQuestion
};