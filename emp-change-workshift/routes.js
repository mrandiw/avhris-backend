const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addChangeWorkshift,
  getChangeShiftRequest,
  editChangeRequest,
  deleteChangeRequest,
  editDataChangeRequest,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addChangeWorkshift);
router.put("/:id", authenticationToken, editChangeRequest);
router.put("/data/:id", authenticationToken, editDataChangeRequest);
router.delete("/:id", authenticationToken, deleteChangeRequest);
router.get("/", authenticationToken, getChangeShiftRequest);
// router.get("/:id", authenticationToken, getEmploymentOffday);
module.exports = router;
