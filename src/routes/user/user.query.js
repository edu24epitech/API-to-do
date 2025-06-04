const db = require('../../config/db');

const getUserById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, email, name, firstname, created_at FROM user WHERE id = ?',
    [id]
  );
  return rows[0];
};

const getUserTodos = async (userId) => {
  const [rows] = await db.query('SELECT * FROM todo WHERE user_id = ?', [userId]);
  return rows;
};

const updateUser = async (id, { email, password, name, firstname }) => {
  await db.query(
    'UPDATE user SET email = ?, password = ?, name = ?, firstname = ? WHERE id = ?',
    [email, password, name, firstname, id]
  );
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT id, email, name, firstname, created_at FROM user WHERE email = ?',
    [email]
  );
  return rows[0];
};


const deleteUser = async (id) => {
  await db.query('DELETE FROM user WHERE id = ?', [id]);
};

module.exports = {
  getUserById,
  getUserTodos,
  updateUser,
  deleteUser,
  getUserByEmail,
};
