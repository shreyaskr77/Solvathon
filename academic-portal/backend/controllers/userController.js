const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc Bookmark a file (Student)
exports.bookmarkFile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { fileId } = req.body;

    // Check if already bookmarked
    const exists = user.bookmarks.some(
      (b) => b.fileId.toString() === fileId.toString()
    );

    if (exists) {
      return res.status(400).json({ error: "File already bookmarked" });
    }

    user.bookmarks.push({
      fileId,
      bookmarkedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: "File bookmarked",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Remove bookmark (Student)
exports.removeBookmark = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.bookmarks = user.bookmarks.filter(
      (b) => b.fileId.toString() !== req.params.fileId.toString()
    );

    await user.save();

    res.status(200).json({
      message: "Bookmark removed",
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get user bookmarks (Student)
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: "bookmarks.fileId",
      populate: [
        { path: "subjectId", select: "subjectName" },
        { path: "uploadedBy.userId", select: "name" },
      ],
    });

    res.status(200).json({
      count: user.bookmarks.length,
      bookmarks: user.bookmarks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get notifications (All users)
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      userId: req.userId,
      isRead: false,
    });

    res.status(200).json({
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Mark all notifications as read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.userId, isRead: false },
      { isRead: true }
    );

    res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
