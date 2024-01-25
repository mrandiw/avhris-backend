const jwt = require("jsonwebtoken");
module.exports = {
  authenticationToken: (req, res, next) => {
    const header = req.headers["authorization"];
    if (header === undefined)
      return res
        .status(401)
        .json({ message: "Please Login to get Access!", auth: false });
    const token = header.split(" ")[1];
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.status(401).json({
          message: "Invalid Authentication, Please Login to get aAccess!",
          auth: false,
        });
      }
      req.admin = decoded;
      next();
    });
  },
};
