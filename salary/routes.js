const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewSalary,
  editSalary,
  deleteSalary,
  getSalary,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewSalary);
router.put("/:id", authenticationToken, editSalary);
router.delete("/:id", authenticationToken, deleteSalary);
router.get("/", authenticationToken, getSalary);
module.exports = router;
