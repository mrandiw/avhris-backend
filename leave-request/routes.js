const express = require("express");
const { authenticationToken } = require("../middleware/authentication");
const {
  addLeaveRequest,
  getLeaveRequest,
  editStatusLeaveRequest,
  deleteLeaveRequest,
  editDataLeaveRequest,
} = require("./controller");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    // You could rename the file name
    cb(
      null,
      file.originalname.split(".")[0] +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});
const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype;
  if (
    typeFile === "image/png" ||
    typeFile === "image/jpg" ||
    typeFile === "image/jpeg" ||
    typeFile ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    typeFile ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    typeFile === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    new Error("Cannot Uploded file!");
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4000000 },
});

router.post(
  "/",
  authenticationToken,
  upload.array("files", 5),
  addLeaveRequest
);
router.put("/status/:id", authenticationToken, editStatusLeaveRequest);
router.put("/data/:id", authenticationToken, editDataLeaveRequest);
// router.get("/:id", detailDepartement);
router.get("/", authenticationToken, getLeaveRequest);
router.delete("/:id", authenticationToken, deleteLeaveRequest);
// router.post("/login", loginCompany);
module.exports = router;
