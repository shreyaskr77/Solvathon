const express = require('express');
const multer = require('multer');
const path = require('path');
const { createNotice, getNotices, deleteNotice, getNoticeById } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer for attachments
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Allow HOD to create notices/events as well
router.post('/', protect, authorize('Admin', 'Faculty', 'HOD'), upload.array('attachments', 5), createNotice);
router.get('/', getNotices);
router.get('/:id', getNoticeById);
router.delete('/:id', protect, authorize('Admin'), deleteNotice);

module.exports = router;
