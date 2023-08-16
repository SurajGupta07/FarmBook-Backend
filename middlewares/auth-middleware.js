const jwt = require("jsonwebtoken");
const mySecret =
  "FDn15Q6Zqs3vcpznfJwJkDFPKz4J1bIPmwHhDDIHpwivpYT1UL7323tlyznywBRupPvj8h28feSWHSCbuCq3inwKH0sRUUSOXZOTvGiWqX3MiOzeGGEneNXlAWUtPjooIg556kw3RkVYXPvMIHHSACLqQSI6E4NEdSxOh9aP7o7AShGrth9+KDA7iJYC/77vCbtKM+21vV7jxwFJmEisLpemV6sNlVkdTLBJBcc2aGT+SuJaHfNA8JHtvf0KiC/zn8UgW6prR79UA6cKl8DbAwsIJMOaNYJYnMIBRUc4YnsW7nyu8WiHd5U31OY2K+/Mlr4tDw0I4j0nB+Jx+rPyxA==";

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    const decoded = jwt.verify(token, mySecret);
    req.userId = decoded.id;
    return next();
  } catch (err) {
    console.log({
      err,
    });
    res.status(401).json({
      message: "Unauthorised access, please add the token",
    });
  }
};

module.exports = {
  requireAuth,
};
