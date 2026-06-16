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

module.exports = {
  createQuestions,
  getQuestionsByQuizId
};