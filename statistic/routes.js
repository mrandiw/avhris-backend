const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { getAttendanceAndLeaveStatistic } = require("./controller");
const router = express.Router();

router.get(
  "/attendance-and-leave",
  authenticationToken,
  getAttendanceAndLeaveStatistic
);
module.exports = router;
