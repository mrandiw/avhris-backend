const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const router = express.Router();
const leaveController = require("./controller");

router.post("/", authenticationToken, leaveController.addLeave);
router.get("/", authenticationToken, leaveController.getLeaves);
router.delete("/:id", leaveController.deleteLeave);
router.put("/:id", leaveController.updateLeave);
router.put("/:id/status", leaveController.updateLeaveStatus);

module.exports = router;
