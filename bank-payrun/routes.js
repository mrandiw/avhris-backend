const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  createBankPayrun,
  getBankPayrun,
  updateBankPayrun,
  deleteBankPayrun,
} = require("./cotroller");

const router = express.Router();
router.get("/", authenticationToken, getBankPayrun);
router.post("/", authenticationToken, createBankPayrun);
router.put("/:id", authenticationToken, updateBankPayrun);
router.delete("/:id", authenticationToken, deleteBankPayrun);
module.exports = router;
