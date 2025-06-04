const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

router.post('/register', async (req, res) => {
  const { email, password, name, firstname } = req.body;
  console.log("Intentando registro con:", email);

  if (!email || !password || !name || !firstname) {
    return res.status(400).json({ msg: "Missing parameters" });
  }
  try {
    const [resultSelect] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    if (resultSelect.length > 0) {
      console.log("Usuario ya existe");
      return res.status(409).json({ msg: 'account already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [resultInsert] = await db.query(
      'INSERT INTO user (email, password, name, firstname) VALUES (?, ?, ?, ?)',
      [email, hashedPassword, name, firstname]
    );
    console.log("Resultado de la inserción:", resultInsert);
    const token = jwt.sign({ userId: resultInsert.insertId }, process.env.SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  }
  catch (err) {
    console.log("Error SQL:", err);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("Intentando login con:", email);

  if (!email || !password)
    return res.status(400).json({ msg: 'Missing parameters' });

  try {
    const [rows] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    console.log("Resultado de query:", rows);
    const user = rows[0];
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ msg: 'Invalid Credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.SECRET, { expiresIn: '1h' });
    console.log("Token generado:", token);
    res.status(201).json({ token });
  } catch (err) {
    console.log("Error SQL:", err);
    return res.status(500).json({ msg: 'internal server error' });
  }
});

module.exports = router;
