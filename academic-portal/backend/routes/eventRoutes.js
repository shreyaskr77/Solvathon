const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const eventController = require('../controllers/eventController');

// HOD creates events
router.post('/', protect, authorize('HOD'), eventController.createEvent);

// Public: list events (logged-in users)
router.get('/', protect, eventController.getEvents);

// HOD delete
router.delete('/:id', protect, authorize('HOD'), eventController.deleteEvent);

module.exports = router;
