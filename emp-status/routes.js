const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addStatus, getStatus, editStatus, deleteStatus } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addStatus);
router.put("/:id", authenticationToken, editStatus);
router.delete("/:id", authenticationToken, deleteStatus);
router.get("/", authenticationToken, getStatus);
module.exports = router;
