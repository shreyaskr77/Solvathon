const Notice = require('../models/Notice');
const User = require('../models/User');
const fs = require('fs');
const emailService = require('../utils/emailService');

// Create a new notice (Admin or Faculty)
exports.createNotice = async (req, res) => {
  try {
    const { title, content, targetCourses } = req.body;
    const attachments = [];

    if (req.files && req.files.length) {
      req.files.forEach(f => attachments.push(f.path));
    }

    const notice = new Notice({
      title,
      content,
      targetCourses: targetCourses ? targetCourses.split(',') : [],
      attachments,
      author: req.userId,
    });

    await notice.save();

    // If created by HOD, notify all faculty and students
    const author = await User.findById(req.userId);
    if (author && author.role === 'HOD') {
      const targets = await User.find({ role: { $in: ['Faculty', 'Student'] } }).select('_id email');
      const notifications = targets.map((t) => ({
        userId: t._id,
        title: `New Notice: ${title}`,
        message: content.substring(0, 200),
        type: 'announcement',
        relatedFileId: null,
      }));
      const Notification = require('../models/Notification');
      if (notifications.length) await Notification.insertMany(notifications);

      // --- EMAIL LOGIC ---
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      targets.forEach(t => {
        if (t.email) {
          emailService({
            email: t.email,
            subject: `New Notice: ${title}`,
            message: `A new notice has been broadcasted:\n\nTitle: ${title}\n\n${content}\n\nView all notices here:\n${frontendUrl}/notices`,
          });
        }
      });
    }

    res.status(201).json({ message: 'Notice created', notice });
  } catch (err) {
    // cleanup uploaded files on error
    if (req.files && req.files.length) {
      req.files.forEach(f => fs.unlink(f.path, () => { }));
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all active notices (optionally filter by course)
exports.getNotices = async (req, res) => {
  try {
    const { course } = req.query;
    let filter = { isActive: true };
    if (course) filter.targetCourses = course;

    const notices = await Notice.find(filter).populate('author', 'name role').sort({ createdAt: -1 });
    res.status(200).json({ count: notices.length, notices });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete (deactivate) a notice (Admin only)
exports.deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ error: 'Notice not found' });

    notice.isActive = false;
    await notice.save();

    res.status(200).json({ message: 'Notice deactivated', notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single notice
exports.getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id).populate('author', 'name role');
    if (!notice) return res.status(404).json({ error: 'Notice not found' });
    res.status(200).json({ notice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
