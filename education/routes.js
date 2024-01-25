const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewEducation,
  getEducation,
  deleteEducation,
  editEducation,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewEducation);
router.put("/:id", authenticationToken, editEducation);
router.delete("/:id", authenticationToken, deleteEducation);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getEducation);
// router.post("/login", loginCompany);
module.exports = router;
