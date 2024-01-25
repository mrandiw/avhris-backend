const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addAttendance,
  getAttendance,
  editAttendance,
  deleteAttendance,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addAttendance);
router.put("/:id", authenticationToken, editAttendance);
router.get("/", authenticationToken, getAttendance);
router.delete("/:id", authenticationToken, deleteAttendance);
// router.get("/", loginAdmin);
module.exports = router;
