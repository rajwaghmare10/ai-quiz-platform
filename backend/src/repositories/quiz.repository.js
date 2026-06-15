const pool = require("../config/db");

const createQuiz = async ({
    classId,
    title,
    durationMinutes,
    startTime,
    endTime
}) => {

    const query = `
        INSERT INTO quizzes
        (
            class_id,
            title,
            duration_minutes,
            start_time,
            end_time,
            total_questions
        )
        VALUES ($1,$2,$3,$4,$5,0)
        RETURNING *
    `;

    const result = await pool.query(
        query,
        [
            classId,
            title,
            durationMinutes,
            startTime,
            endTime
        ]
    );

    return result.rows[0];
};

module.exports = {
    createQuiz
};