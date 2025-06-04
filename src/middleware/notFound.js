function notFound(err, req, res, next) {
    console.error('Error capturado', err);

    if (err.status === 404) {
      return res.status(404).json({ msg: 'Not found' });
    }

    if (err.status === 401 && err.type === 'invalid-token') {
      return res.status(401).json({ msg: 'Token is not valid' });
    }

    if (err.status === 401 && err.type === 'missing-token') {
      return res.status(401).json({ msg: 'No token , authorization denied ' });
    }

    return res.status(500).json({ msg: ' internal server error' });
  }

module.exports = notFound;
