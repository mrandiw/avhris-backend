const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const { createTask, getTask, updateTask, deleteTask } = require("./controller");
const router = express.Router();

router.get("/", authenticationToken, getTask);
router.post("/", authenticationToken, createTask);
router.put("/:id", authenticationToken, updateTask);
router.delete("/:id", authenticationToken, deleteTask);
module.exports = router;
