const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  getAllowOptionsEmp,
  addAllowance,
  editAllowance,
  getAllowance,
  deleteAllowance,
  changeStatusAllowance,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addAllowance);
router.put("/:id", authenticationToken, editAllowance);
router.get("/status/:id", authenticationToken, changeStatusAllowance);
router.get("/options/:id", authenticationToken, getAllowOptionsEmp);
router.get("/:id", authenticationToken, getAllowance);
router.delete("/:id", authenticationToken, deleteAllowance);
// router.post("/login", loginCompany);
module.exports = router;
