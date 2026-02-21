const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  uploadFile,
  getApprovedFiles,
  getPendingFiles,
  getUserFiles,
  getFileById,
  approveFile,
  rejectFile,
  updateVersion,
  rateFile,
  downloadFile,
} = require("../controllers/fileController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|pptx|xlsx|jpg|jpeg|png/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only PDF, DOC, DOCX, PPTX, XLSX, JPG, JPEG, PNG are allowed"));
  },
});

const router = express.Router();

// Allow Students, Faculty and HOD to upload. Student uploads require HOD/Admin/Faculty approval.
router.post("/upload", protect, authorize("Student", "Faculty", "HOD"), upload.single("file"), uploadFile);
router.get("/pending", protect, authorize("Admin","HOD","Faculty"), getPendingFiles);
router.get("/my-uploads", protect, getUserFiles);
router.get("/approved", protect, getApprovedFiles);
router.get("/:id", protect, getFileById);
router.put("/:id/approve", protect, authorize("Admin","HOD","Faculty"), approveFile);
router.put("/:id/reject", protect, authorize("Admin","HOD","Faculty"), rejectFile);
router.put("/:id/update-version", protect, authorize("Faculty"), upload.single("file"), updateVersion);
router.post("/:id/rate", protect, authorize("Student"), rateFile);
router.post("/:id/download", protect, authorize("Student"), downloadFile);

module.exports = router;
