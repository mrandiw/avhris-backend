const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  registerCompany,
  loginCompany,
  getAllCompany,
  dahsboard,
  editCompany,
  deleteCompany,
} = require("./controller");
const router = express.Router();

router.post("/registrasi", registerCompany);
router.put("/:id", editCompany);
router.delete("/:id", authenticationToken, deleteCompany);
router.post("/login", loginCompany);
router.get("/all", authenticationToken, getAllCompany);
router.get("/dashboard", authenticationToken, dahsboard);
module.exports = router;
