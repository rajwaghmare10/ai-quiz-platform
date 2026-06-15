const pool = require("../config/db");

const createClass = async ({
    teacherId,
    className,
    classCode,
    description
}) => {

    const query = `
    INSERT INTO classes
    (
      teacher_id,
      class_name,
      class_code,
      description
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `;

    const result = await pool.query(
        query,
        [
            teacherId,
            className,
            classCode,
            description
        ]
    );

    return result.rows[0];
};


const getClassesByTeacherId =
    async (teacherId) => {

        const query = `
        SELECT *
        FROM classes
        WHERE teacher_id = $1
        ORDER BY created_at DESC
    `;

        const result =
            await pool.query(
                query,
                [teacherId]
            );

        return result.rows;
    };

const findClassByCode =
    async (classCode) => {

        const query = `
        SELECT *
        FROM classes
        WHERE class_code = $1
    `;

        const result =
            await pool.query(
                query,
                [classCode]
            );

        return result.rows[0];
    };


const isStudentAlreadyJoined =
    async (
        classId,
        studentId
    ) => {

        const query = `
        SELECT *
        FROM class_members
        WHERE class_id = $1
        AND student_id = $2
    `;

        const result =
            await pool.query(
                query,
                [classId, studentId]
            );

        return result.rows[0];
    };

const joinClass = async (classId, studentId) => {
    const query = `
        INSERT INTO class_members
        (
            class_id,
            student_id
        )
        VALUES ($1,$2)
        RETURNING *
    `;

    const result =
        await pool.query(
            query,
            [classId, studentId]
        );

    return result.rows[0];
};

const getJoinedClasses = async (studentId) => {

    const query = `
        SELECT
            c.*
        FROM class_members cm
        JOIN classes c
        ON cm.class_id = c.class_id
        WHERE cm.student_id = $1
        ORDER BY c.created_at DESC
    `;

    const result = await pool.query(
        query,
        [studentId]
    );

    return result.rows;
};

const getClassDetails = async (
    classId
) => {

    const query = `
        SELECT
            c.*,
            u.name AS teacher_name,
            COUNT(cm.student_id)::INT
                AS total_students
        FROM classes c
        JOIN users u
            ON c.teacher_id = u.user_id
        LEFT JOIN class_members cm
            ON c.class_id = cm.class_id
        WHERE c.class_id = $1
        GROUP BY
            c.class_id,
            u.name
    `;

    const result = await pool.query(
        query,
        [classId]
    );

    return result.rows[0];
};


const findClassById = async (
    classId
) => {

    const query = `
        SELECT *
        FROM classes
        WHERE class_id = $1
    `;

    const result = await pool.query(
        query,
        [classId]
    );

    return result.rows[0];
};

module.exports = {
    createClass,
    getClassesByTeacherId,
    findClassByCode,
    isStudentAlreadyJoined,
    joinClass,
    getJoinedClasses,
    getClassDetails,
    findClassById
};