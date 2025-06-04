const express = require('express');
const app = express();
const authRoutes = require('./routes/auth/auth');
const notFound = require('./middleware/notFound');
const authMiddleware = require('./middleware/auth');
const userRoutes = require('./routes/user/user');
const todoRoutes = require('./routes/todos/todos');
require('dotenv').config();

app.use(express.json());

console.log('Loading auth routes...');
app.use('/', authRoutes);
console.log('Loading user routes...');
app.use('/user', userRoutes);
console.log('Loading todo routes...');
app.use('/todo', todoRoutes);

app.use(notFound);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});