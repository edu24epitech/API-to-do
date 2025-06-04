const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const {
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  getAllTodos,
} = require('./todos.query');

router.get('/:id', auth, async (req, res, next) => {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) return next({ status: 404 });
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
});

router.get('/', auth, async (req, res, next) => {
  try {
    const todos = await getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});


router.post('/', auth, async (req, res, next) => {
  const { title, description, due_time, status } = req.body;
  const userId = req.user.userId;

  if (!title || !description || !due_time) {
    return res.status(400).json({ msg: 'Missing parameters' });
  }

  try {
    const newId = await createTodo({ title, description, due_time, status, userId });
    const newTodo = await getTodoById(newId);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const todoId = req.params.id;
  const { title, description, due_time, status, user_id } = req.body;

  if (!title || !description || !due_time || !status || !user_id) {
    return res.status(400).json({ msg: 'Missing parameters' });
  }

  try {
    const existing = await getTodoById(todoId);
    if (!existing) return next({ status: 404 });

    await updateTodo(todoId, { title, description, due_time, status, user_id });
    const updatedTodo = await getTodoById(todoId);
    res.status(200).json(updatedTodo);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const todo = await getTodoById(req.params.id);
    if (!todo) return next({ status: 404 });

    await deleteTodo(req.params.id);
    res.status(200).json({ msg: ` succesfully deleted record number : ${req.params.id}` });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
