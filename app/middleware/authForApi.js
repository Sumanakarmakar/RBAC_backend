const jwt = require("jsonwebtoken");

module.exports = AuthCheck = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      status: false,
      message: "A token is required for authentication",
    });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
      req.user = data;
    });
  } catch (err) {
    return res
      .status(401)
      .send({ status: false, message: "invalid Token Access" });
  }
  return next();
};
