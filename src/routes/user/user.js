const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');

const {
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
  getUserTodos,
} = require('./user.query');

router.get('/', auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.user.userId);
    if (!user) return next({ status: 404 });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/todos', auth, async (req, res) => {
  const userId = req.user.userId;

  try {
    const todos = await getUserTodos(userId);
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error al recuperar los todos:", err);
    res.status(500).json({ msg: 'internal server error' });
  }
});

router.get('/email/:email', auth, async (req, res, next) => {
  try {
    const user = await getUserByEmail(req.params.email);
    if (!user) return next({ status: 404 });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user)return next({ status: 404 });
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', auth, async (req, res, next) => {
  const { email, password, name, firstname } = req.body;
  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: 'Missing parameters' });
  }

  try {
    const user = await getUserById(req.params.id);
    if (!user) return next({ status: 404 });

    const hashed = await bcrypt.hash(password, 10);
    await updateUser(req.params.id, { email, password: hashed, name, firstname });

    const updated = await getUserById(req.params.id);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return next({ status: 404 });

    await deleteUser(req.params.id);
    res.status(200).json({ msg: ` succesfully deleted record number : ${req.params.id}` });
  } catch (err) {
    next(err);
  }
});


module.exports = router;
