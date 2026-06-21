const pool = require("../config/db");

const saveAttemptQuestions = async (attemptId, questionIds) => {
    
    for (const questionId of questionIds) {
        
        await pool.query(
            `
            INSERT INTO attempt_questions (
                attempt_id,
                question_id
            )
            VALUES ($1, $2)
            `,
            [attemptId, questionId]
        );
    }
};


const getQuestionIdsByAttemptId = async (attemptId) => {

    const result = await pool.query(
        `
        SELECT question_id
        FROM attempt_questions
        WHERE attempt_id = $1
        `,
        [attemptId]
    );

    return result.rows;
};

module.exports = {
    saveAttemptQuestions,
    getQuestionIdsByAttemptId
};