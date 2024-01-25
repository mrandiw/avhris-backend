const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { getPayrunProcess, createPayrunProcess } = require("./controller");
const router = express.Router();

router.get("/", authenticationToken, getPayrunProcess);
router.post("/", authenticationToken, createPayrunProcess);
module.exports = router;
