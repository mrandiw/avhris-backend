const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewShift,
  getShift,
  changeStatusShift,
  editShift,
  deleteShift,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewShift);
router.get("/", authenticationToken, getShift);
router.put("/status/:id", authenticationToken, changeStatusShift);
router.put("/:id", authenticationToken, editShift);
router.delete("/:id", authenticationToken, deleteShift);
module.exports = router;
