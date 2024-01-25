const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addNewExperienc,
  editExperience,
  deleteExperience,
  getExperience,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addNewExperienc);
router.put("/:id", authenticationToken, editExperience);
router.delete("/:id", authenticationToken, deleteExperience);
router.get("/", authenticationToken, getExperience);
module.exports = router;
