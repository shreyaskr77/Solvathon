const express = require("express");
const {
  getDashboardAnalytics,
  getUserStatistics,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", protect, authorize("Admin"), getDashboardAnalytics);
router.get("/user-statistics", protect, getUserStatistics);

module.exports = router;
