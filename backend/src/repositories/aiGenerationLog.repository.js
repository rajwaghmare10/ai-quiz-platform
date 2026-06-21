const pool = require("../config/db");

const createLog = async ({
    quizId,
    teacherId,
    sourceType,
    sourceContent,
    status
}) => {

    const query = `
        INSERT INTO ai_generation_logs
        (
            quiz_id,
            teacher_id,
            source_type,
            source_content,
            status
        )
        VALUES
        (
            $1,
            $2,
            $3,
            $4,
            $5
        )
        RETURNING *
    `;

    const result = await pool.query(
        query,
        [
            quizId,
            teacherId,
            sourceType,
            sourceContent,
            status
        ]
    );

    return result.rows[0];
};

const getLogsByTeacherId = async (
    teacherId
) => {

    const query = `
        SELECT *
        FROM ai_generation_logs
        WHERE teacher_id = $1
        ORDER BY generated_at DESC
    `;

    const result = await pool.query(
        query,
        [teacherId]
    );

    return result.rows;
};

module.exports = {
    createLog,
    getLogsByTeacherId
};