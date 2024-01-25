const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addOvertimeRequest,
  getOvertimeRequest,
  editOvertimeRequest,
  editDataOvertimeRequest,
  deleteOvertimeRequest,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addOvertimeRequest);
router.put("/:id", authenticationToken, editOvertimeRequest);
router.put("/data/:id", authenticationToken, editDataOvertimeRequest);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getOvertimeRequest);
router.delete("/:id", authenticationToken, deleteOvertimeRequest);
// router.post("/login", loginCompany);
module.exports = router;
