const express = require("express");
const { registerAdmin, loginAdmin } = require("./controller");
const router = express.Router();

router.post("/registrasi", registerAdmin);
router.post("/login", loginAdmin);
module.exports = router;
