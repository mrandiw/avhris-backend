const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { getNeedApproval } = require("./controller");
const router = express.Router();

router.get("/", authenticationToken, getNeedApproval);
module.exports = router;
