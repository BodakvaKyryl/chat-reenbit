const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ msg: 'Unauthorized - no token' });
  }

  if (req.headers.authorization.startsWith('Bearer ')) {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(403).json({ msg: 'Wrong or expired token' });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({ msg: 'Unauthorized - invalid token format' });
  }
};

module.exports = verifyToken;
