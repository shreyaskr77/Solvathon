const express = require("express");
const {
  getAllSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} = require("../controllers/subjectController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllSubjects);
router.post("/", protect, authorize("Admin"), createSubject);
router.put("/:id", protect, authorize("Admin"), updateSubject);
router.delete("/:id", protect, authorize("Admin"), deleteSubject);

module.exports = router;
