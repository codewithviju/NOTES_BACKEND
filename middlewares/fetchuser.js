const jwt = require("jsonwebtoken");
const JWT_SECRET = "Vijayisagood$oy";
const fetchuser = (req, res, next) => {
  // Get the user from jwt token and add it to request

  const getToken = req.header("auth-token");

  if (!getToken) {
    res.status(401).send({ error: "Please Authenticate with Valid Token" });
  }

  try {
    const data = jwt.verify(getToken, JWT_SECRET);

    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please Authenticate with Valid Token" });
  }
};

module.exports = fetchuser;
