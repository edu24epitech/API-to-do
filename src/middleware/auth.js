const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ msg: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error("Token inválido:", err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
