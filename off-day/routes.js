const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  getEmploymentOffday,
  addOffDayRequest,
  getOffDayRequest,
  editOffdayRequest,
  editDataOffdayRequest,
  deletedOffdayRequest,
} = require("./controller");
const router = express.Router();

router.post("/", authenticationToken, addOffDayRequest);
router.put("/:id", authenticationToken, editOffdayRequest);
router.put("/data/:id", authenticationToken, editDataOffdayRequest);
router.delete("/:id", authenticationToken, deletedOffdayRequest);
router.get("/", authenticationToken, getOffDayRequest);
router.get("/:id", authenticationToken, getEmploymentOffday);
module.exports = router;
