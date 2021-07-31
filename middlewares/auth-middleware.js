const jwt = require('jsonwebtoken');
const mySecret = process.env['secret']

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, mySecret);
    return next();
  }
  catch (err) {
    console.log({ err });
    res.status(401).json({ message: "Unauthorised access, please add the token"})
  }
}

module.exports = { requireAuth }