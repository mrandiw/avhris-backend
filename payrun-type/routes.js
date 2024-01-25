const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  getPayrunType,
  createPayrunType,
  updatePayrunType,
  deletePayrunType,
  setDefaultPayrunType,
} = require("./controller");
const router = express.Router();

router.get("/", authenticationToken, getPayrunType);
router.post("/", authenticationToken, createPayrunType);
router.put("/:id", authenticationToken, updatePayrunType);
router.put("/default/:id", authenticationToken, setDefaultPayrunType);
router.delete("/:id", authenticationToken, deletePayrunType);
module.exports = router;
