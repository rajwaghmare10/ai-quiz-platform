const pool = require("../config/db");

const findUserByEmail = async (email) => {
  const query = `
    SELECT *
    FROM users
    WHERE email = $1
  `;

  const result = await pool.query(query, [email]);

  return result.rows[0];
};

const createUser = async ({
  name,
  email,
  passwordHash,
  role
}) => {
  const query = `
    INSERT INTO users
    (
      name,
      email,
      password_hash,
      role
    )
    VALUES ($1,$2,$3,$4)
    RETURNING user_id,name,email,role,created_at
  `;

  const result = await pool.query(query, [
    name,
    email,
    passwordHash,
    role
  ]);

  return result.rows[0];
};

module.exports = {
  findUserByEmail,
  createUser
};