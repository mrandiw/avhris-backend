const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addLocation,
  getLocation,
  editLocation,
  deleteLocation,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addLocation);
router.put("/:id", authenticationToken, editLocation);
router.delete("/:id", authenticationToken, deleteLocation);
router.get("/", authenticationToken, getLocation);
module.exports = router;
