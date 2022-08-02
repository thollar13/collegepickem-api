const jwt = require("jsonwebtoken");

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const bearer = token.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;

    const decoded = jwt.verify(req.token, config.JWT_KEY);
    req.user = decoded;
    
  } catch (err) {
    return res.status(401).send("invalid token");
  }

  return next();
};

module.exports = verifyToken;