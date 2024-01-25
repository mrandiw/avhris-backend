const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addWarning,
  getWarning,
  editWarning,
  deleteWarning,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addWarning);
router.put("/:id", authenticationToken, editWarning);
router.delete("/:id", authenticationToken, deleteWarning);
router.get("/", authenticationToken, getWarning);
module.exports = router;
