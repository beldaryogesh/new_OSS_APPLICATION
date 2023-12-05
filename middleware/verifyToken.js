const jwt = require('jsonwebtoken');

const  authenticateUser =  function (req, res, next) {
  const token = req.headers['x-api-key'];
  if (!token) {
    return res.status(200).json({error_code : 400, message : 'please provide token..!' });
  }
  try {
    const decoded = jwt.verify(token, 'ONE-STOP-SERVICE');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = {
  authenticateUser
}