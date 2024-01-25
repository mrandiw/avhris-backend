const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewLeaveHoliday,
  getLeaveHoliday,
  editLeaveHoliday,
  deleteLeaveHoliday,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewLeaveHoliday);
router.get("/", authenticationToken, getLeaveHoliday);
router.put("/:id", authenticationToken, editLeaveHoliday);
router.delete("/:id", authenticationToken, deleteLeaveHoliday);
// router.get("/", authenticationToken, getExperience);
module.exports = router;
