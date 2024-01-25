const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addLately, getLately } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addLately);
router.get("/", authenticationToken, getLately);
module.exports = router;
