const File = require("../models/File");
const DownloadLog = require("../models/DownloadLog");
const User = require("../models/User");

// @desc Get admin dashboard analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Most downloaded files
    const mostDownloadedFiles = await File.find({ status: "Approved" })
      .sort({ downloadsCount: -1 })
      .limit(10)
      .populate("subjectId", "subjectName");

    // Files pending approval
    const pendingFiles = await File.countDocuments({ status: "Pending" });

    // Total approved files
    const approvedFiles = await File.countDocuments({ status: "Approved" });

    // Total users by role
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: "Admin" });
    const facultyCount = await User.countDocuments({ role: "Faculty" });
    const studentCount = await User.countDocuments({ role: "Student" });

    // Upload statistics (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUploads = await File.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Most active users (their uploads)
    const activeUsers = await File.aggregate([
      {
        $group: {
          _id: "$uploadedBy.userId",
          userName: { $first: "$uploadedBy.userName" },
          uploadCount: { $sum: 1 },
        },
      },
      {
        $sort: { uploadCount: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    // File distribution by type
    const filesByType = await File.aggregate([
      {
        $group: {
          _id: "$fileType",
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      analytics: {
        totalUsers,
        usersByRole: {
          admin: adminCount,
          faculty: facultyCount,
          student: studentCount,
        },
        files: {
          pending: pendingFiles,
          approved: approvedFiles,
          total: pendingFiles + approvedFiles,
        },
        mostDownloadedFiles,
        activeUsers,
        filesByType,
        recentUploads,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get user statistics
exports.getUserStatistics = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let stats = {};

    if (user.role === "Faculty") {
      const uploadedFiles = await File.countDocuments({
        "uploadedBy.userId": req.userId,
      });

      const approvedFiles = await File.countDocuments({
        "uploadedBy.userId": req.userId,
        status: "Approved",
      });

      const pendingFiles = await File.countDocuments({
        "uploadedBy.userId": req.userId,
        status: "Pending",
      });

      const totalDownloads = await File.aggregate([
        {
          $match: { "uploadedBy.userId": req.userId },
        },
        {
          $group: {
            _id: null,
            totalDownloads: { $sum: "$downloadsCount" },
          },
        },
      ]);

      stats = {
        uploadedFiles,
        approvedFiles,
        pendingFiles,
        totalDownloads: totalDownloads[0]?.totalDownloads || 0,
      };
    } else if (user.role === "Student") {
      const downloadedFiles = await DownloadLog.countDocuments({
        userId: req.userId,
      });

      const bookmarkedFiles = user.bookmarks.length;

      const ratedFiles = await File.countDocuments({
        "ratings.studentId": req.userId,
      });

      stats = {
        downloadedFiles,
        bookmarkedFiles,
        ratedFiles,
      };
    }

    res.status(200).json({
      stats,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
