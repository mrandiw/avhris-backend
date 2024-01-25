const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addAnnouncement,
  getAnnouncement,
  EditAnnouncement,
  deleteAnnouncement,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addAnnouncement);
router.put("/:id", authenticationToken, EditAnnouncement);
router.delete("/:id", authenticationToken, deleteAnnouncement);
router.get("/", authenticationToken, getAnnouncement);
module.exports = router;
