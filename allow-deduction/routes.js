const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addAllowDeduct,
  getAllowDeduct,
  editAllowDeduct,
  changeStatusAllowDeduct,
  deleteAllowDeduct,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addAllowDeduct);
router.put("/:id", authenticationToken, editAllowDeduct);
router.delete("/:id", authenticationToken, deleteAllowDeduct);
router.get("/:id", authenticationToken, changeStatusAllowDeduct);
router.get("/", authenticationToken, getAllowDeduct);
// router.post("/login", loginCompany);
module.exports = router;
