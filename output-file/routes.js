const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addOutputFile,
  getOutputFile,
  updateOutputFile,
  deleteOutputFile,
} = require("./controller");
const router = express.Router();

router.get("/", authenticationToken, getOutputFile);
router.post("/", authenticationToken, addOutputFile);
router.put("/:id", authenticationToken, updateOutputFile);
router.delete("/:id", authenticationToken, deleteOutputFile);
module.exports = router;
