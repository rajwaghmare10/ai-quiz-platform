const pool = require("../config/db");

const createStudentAnswers = async (answers) => {
  if (!answers || answers.length === 0) {
    return [];
  }
  
  const values = [];
  const placeholders = [];

  answers.forEach((answer, index) => {

    const baseIndex = index * 4;

    placeholders.push(
      `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
    );

    values.push(
      answer.attemptId,
      answer.questionId,
      answer.selectedOption,
      answer.isCorrect
    );

  });

  const query = `
    INSERT INTO student_answers
    (
      attempt_id,
      question_id,
      selected_option,
      is_correct
    )
    VALUES ${placeholders.join(",")}
    RETURNING *
  `;

  const result = await pool.query(
    query,
    values
  );

  return result.rows;
};


const getCorrectAnswerCount = async (
  attemptId
) => {

  const query = `
    SELECT COUNT(*)::INT AS count
    FROM student_answers
    WHERE attempt_id = $1
    AND is_correct = true
  `;

  const result = await pool.query(
    query,
    [attemptId]
  );

  return result.rows[0].count;
};

module.exports = {
  createStudentAnswers,
  getCorrectAnswerCount
};