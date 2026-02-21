const express = require("express");
const {
  bookmarkFile,
  removeBookmark,
  getBookmarks,
  getNotifications,
  markNotificationRead,
  markAllRead,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/bookmark", protect, authorize("Student"), bookmarkFile);
router.delete("/bookmark/:fileId", protect, authorize("Student"), removeBookmark);
router.get("/bookmarks", protect, authorize("Student"), getBookmarks);
router.get("/", protect, getNotifications);
router.put("/:id/read", protect, markNotificationRead);
router.put("/mark-all-read", protect, markAllRead);

module.exports = router;
