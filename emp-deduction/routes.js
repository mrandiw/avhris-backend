const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  getDeductOptionsEmp,
  addDeduction,
  editDeduction,
  getDeduction,
  deleteDeduction,
  changeStatusDeduction,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addDeduction);
router.put("/:id", authenticationToken, editDeduction);
router.get("/status/:id", authenticationToken, changeStatusDeduction);
router.get("/options/:id", authenticationToken, getDeductOptionsEmp);
router.get("/:id", authenticationToken, getDeduction);
router.delete("/:id", authenticationToken, deleteDeduction);
// router.post("/login", loginCompany);
module.exports = router;
