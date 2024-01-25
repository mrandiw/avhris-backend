const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { addNewBank, editBank, deleteBank, getBank } = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewBank);
router.put("/:id", authenticationToken, editBank);
router.delete("/:id", authenticationToken, deleteBank);
router.get("/", authenticationToken, getBank);
module.exports = router;
