const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewPeriodic,
  getPeriodic,
  editStatus,
  getPeriodicActive,
  editPeriodic,
  deletePeriodic,
  getPeriodicAttendace,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewPeriodic);
router.put("/status/:id", authenticationToken, editStatus);
router.put("/:id", authenticationToken, editPeriodic);
router.delete("/:id", authenticationToken, deletePeriodic);
router.get("/", authenticationToken, getPeriodic);
router.get("/status", authenticationToken, getPeriodicActive);
router.get("/attendance", authenticationToken, getPeriodicAttendace);
module.exports = router;
