const db = require('../../config/db');

const getTodosByUserId = async (userId) => {
  const [rows] = await db.query('SELECT * FROM todo WHERE user_id = ?', [userId]);
  return rows;
};

const createTodo = async ({ title, description, due_time, status, userId }) => {
  const [result] = await db.query(
    'INSERT INTO todo (title, description, created_at, due_time, status, user_id) VALUES (?, ?, NOW(), ?, ?, ?)',
    [title, description, due_time, status || 'not started', userId]
  );
  return result.insertId;
};

const getTodoById = async (id) => {
  const [rows] = await db.query('SELECT * FROM todo WHERE id = ?', [id]);
  return rows[0];
};

const updateTodo = async (id, { title, description, due_time, status, user_id }) => {
  await db.query(
    'UPDATE todo SET title = ?, description = ?, due_time = ?, status = ?, user_id = ? WHERE id = ?',
    [title, description, due_time, status, user_id, id]
  );
};

const deleteTodo = async (id) => {
  await db.query('DELETE FROM todo WHERE id = ?', [id]);
};

const getAllTodos = async () => {
  const [rows] = await db.query('SELECT * FROM todo');
  return rows;
};



module.exports = {
  getTodosByUserId,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  getAllTodos,

};
