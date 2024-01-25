const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  // addNewSalary,
  // editSalary,
  // deleteSalary,
  getUsers,
  switchUserStatus,
  getRoles,
} = require("./controller");
const router = express.Router();

// router.post("/users", authenticationToken, addNewSalary);
// router.put("/users/:id", authenticationToken, editSalary);
// router.delete("/users/:id", authenticationToken, deleteSalary);
router.get("/users", authenticationToken, getUsers);
router.get("/sUS", authenticationToken, switchUserStatus);
router.get("/roles", authenticationToken, getRoles);
module.exports = router;
