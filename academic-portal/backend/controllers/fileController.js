const File = require("../models/File");
const DownloadLog = require("../models/DownloadLog");
const Notification = require("../models/Notification");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const emailService = require("../utils/emailService");

// @desc Upload a file (Faculty)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { title, description, subjectIds, fileType, semester, department, tags } = req.body;
    let parsedSubjectIds = [];
    if (subjectIds) {
      try {
        parsedSubjectIds = JSON.parse(subjectIds);
      } catch (e) {
        parsedSubjectIds = Array.isArray(subjectIds) ? subjectIds : [subjectIds];
      }
    }
    const user = await User.findById(req.userId);

    // determine initial status: student uploads require approval by HOD/Admin; Faculty/HOD uploads are auto-approved
    let initialStatus = 'Pending';
    let approvedAt = null;
    let approvedBy = null;
    if (user.role === 'Faculty' || user.role === 'HOD' || user.role === 'Admin') {
      initialStatus = 'Approved';
      approvedAt = new Date();
      approvedBy = req.userId;
    }

    const newFile = new File({
      title,
      description,
      subjectIds: parsedSubjectIds,
      uploadedBy: {
        userId: req.userId,
        userName: user.name,
      },
      fileType,
      semester,
      department,
      tags: tags ? tags.split(",") : [],
      versions: [
        {
          versionNumber: 1,
          filePath: req.file.path,
          fileSize: req.file.size,
          uploadedAt: new Date(),
          updatedBy: req.userId,
        },
      ],
      currentVersion: 1,
      status: initialStatus,
      approvedAt,
      approvedBy,
    });

    await newFile.save();

    // Notify reviewers about new file: Admins, HODs and Faculty
    const reviewers = await User.find({ role: { $in: ['Admin', 'HOD', 'Faculty'] } });
    const notifications = reviewers.map((r) => ({
      userId: r._id,
      title: 'New File for Review',
      message: `${user.name} uploaded a new ${fileType}: ${title}`,
      type: 'file_pending',
      relatedFileId: newFile._id,
    }));

    if (notifications.length) await Notification.insertMany(notifications);

    // --- EMAIL LOGIC ---
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    if (user.role === 'Student') {
      const targets = await User.find({ role: { $in: ['HOD', 'Faculty'] } }).select('email role');
      targets.forEach(person => {
        if (person.email) {
          const dashboardPath = person.role === 'HOD' ? '/hod' : '/faculty';
          emailService({
            email: person.email,
            subject: 'New File Upload Requires Approval',
            message: `A new notes has been uploaded,Please check it!!\n\nReview it here: ${frontendUrl}${dashboardPath}`,
          });
        }
      });
    } else if (user.role === 'HOD' || user.role === 'Faculty') {
      const students = await User.find({ role: 'Student' }).select('email');
      students.forEach(student => {
        if (student.email) {
          emailService({
            email: student.email,
            subject: `New ${fileType} Uploaded by ${user.name}`,
            message: `${user.name} has uploaded a new ${fileType} titled "${title}".\n\nYou can view it in the repository here:\n${frontendUrl}/student/files`,
          });
        }
      });
    }

    res.status(201).json({
      message: "File uploaded successfully. Waiting for approval.",
      file: newFile,
    });
  } catch (error) {
    // Delete file if upload fails
    if (req.file) {
      fs.unlink(req.file.path, (err) => console.log(err));
    }
    res.status(500).json({ error: error.message });
  }
};

// @desc Get all approved files (Students)
exports.getApprovedFiles = async (req, res) => {
  try {
    const { fileType, semester, department, search } = req.query;
    let filter = { status: "Approved" };

    if (fileType) filter.fileType = fileType;
    if (semester) filter.semester = semester;
    if (department) filter.department = department;

    let query = File.find(filter)
      .populate("subjectIds", "subjectName subjectCode")
      .populate("uploadedBy.userId", "name")
      .sort({ createdAt: -1 });

    if (search) {
      query = query.where("title").regex(new RegExp(search, "i"));
    }

    const files = await query;

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get pending files (Admin)
exports.getPendingFiles = async (req, res) => {
  try {
    const files = await File.find({ status: "Pending" })
      .populate("subjectIds", "subjectName")
      .populate("uploadedBy.userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get user's uploaded files (Faculty)
exports.getUserFiles = async (req, res) => {
  try {
    const files = await File.find({ "uploadedBy.userId": req.userId })
      .populate("subjectIds", "subjectName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: files.length,
      files,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Get file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id)
      .populate("subjectIds")
      .populate("uploadedBy.userId", "name email")
      .populate("ratings.studentId", "name");

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    res.status(200).json({ file });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Approve file (Admin, HOD, Faculty)
exports.approveFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate('uploadedBy.userId');

    if (!file) return res.status(404).json({ error: 'File not found' });

    // If approver is HOD or Faculty, only allow approving student uploads
    const approver = await User.findById(req.userId);
    if ((approver.role === 'HOD' || approver.role === 'Faculty') && file.uploadedBy.userId.role !== 'Student') {
      return res.status(403).json({ error: `${approver.role} can only approve student uploads` });
    }

    file.status = 'Approved';
    file.approvedAt = new Date();
    file.approvedBy = req.userId;
    await file.save();

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Notify file uploader
    await Notification.create({
      userId: file.uploadedBy.userId,
      title: "File Approved",
      message: `Your file "${file.title}" has been approved!`,
      type: "file_approved",
      relatedFileId: file._id,
    });

    // --- EMAIL LOGIC ---
    if (file.uploadedBy.userId.email) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      emailService({
        email: file.uploadedBy.userId.email,
        subject: 'File Approved',
        message: `Your file "${file.title}" has been approved and is now visible in the repository.\n\nView it here: ${frontendUrl}/student/files`,
      });
    }

    res.status(200).json({
      message: "File approved successfully",
      file,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Reject file (Admin, HOD, Faculty)
exports.rejectFile = async (req, res) => {
  try {
    const { reason } = req.body;

    const file = await File.findById(req.params.id).populate('uploadedBy.userId');
    if (!file) return res.status(404).json({ error: 'File not found' });

    // If rejector is HOD or Faculty, only allow rejecting student uploads
    const rejector = await User.findById(req.userId);
    if ((rejector.role === 'HOD' || rejector.role === 'Faculty') && file.uploadedBy.userId.role !== 'Student') {
      return res.status(403).json({ error: `${rejector.role} can only reject student uploads` });
    }

    file.status = 'Rejected';
    file.rejectionReason = reason;
    await file.save();

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Notify file uploader
    await Notification.create({
      userId: file.uploadedBy.userId,
      title: "File Rejected",
      message: `Your file "${file.title}" was rejected. Reason: ${reason}`,
      type: "file_rejected",
      relatedFileId: file._id,
    });

    // --- EMAIL LOGIC ---
    if (file.uploadedBy.userId.email) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      emailService({
        email: file.uploadedBy.userId.email,
        subject: 'File Rejected',
        message: `Your file "${file.title}" was rejected.\nReason: ${reason}\n\nPlease review your uploads on the dashboard: ${frontendUrl}/student/upload`,
      });
    }

    res.status(200).json({
      message: "File rejected",
      file,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update file version (Faculty)
exports.updateVersion = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (file.uploadedBy.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const newVersion = {
      versionNumber: file.currentVersion + 1,
      filePath: req.file.path,
      fileSize: req.file.size,
      uploadedAt: new Date(),
      updatedBy: req.userId,
    };

    file.versions.push(newVersion);
    file.currentVersion = newVersion.versionNumber;
    file.status = "Pending"; // Reset status for re-approval

    await file.save();

    res.status(200).json({
      message: "File version updated",
      file,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => console.log(err));
    }
    res.status(500).json({ error: error.message });
  }
};

// @desc Rate a file (Student)
exports.rateFile = async (req, res) => {
  try {
    const { rating, feedback } = req.body;

    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    // Check if student already rated
    const existingRating = file.ratings.find(
      (r) => r.studentId.toString() === req.userId.toString()
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.feedback = feedback;
      existingRating.ratedAt = new Date();
    } else {
      file.ratings.push({
        studentId: req.userId,
        rating,
        feedback,
        ratedAt: new Date(),
      });
    }

    // Calculate average rating
    const totalRating = file.ratings.reduce((sum, r) => sum + r.rating, 0);
    file.averageRating = (totalRating / file.ratings.length).toFixed(1);

    await file.save();

    res.status(200).json({
      message: "Rating submitted",
      file,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Download file (Student)
exports.downloadFile = async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || file.status !== "Approved") {
      return res.status(404).json({ error: "File not found or not approved" });
    }

    const currentVersionFile = file.versions[file.currentVersion - 1];
    const filePath = currentVersionFile.filePath;

    // Log download
    await DownloadLog.create({
      fileId: file._id,
      userId: req.userId,
      downloadedAt: new Date(),
    });

    // Increment download count
    file.downloadsCount += 1;
    await file.save();

    // Send file
    res.download(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
