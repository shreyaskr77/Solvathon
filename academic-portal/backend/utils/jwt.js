const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'secret';

exports.sign = (payload, opts = {}) => jwt.sign(payload, SECRET, { expiresIn: '7d', ...opts });
exports.verify = (token) => jwt.verify(token, SECRET);
