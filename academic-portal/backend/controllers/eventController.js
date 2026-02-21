const Event = require('../models/Event');
const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('../utils/emailService');

// Create an event (HOD only)
exports.createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, targetCourses } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      targetCourses: targetCourses || [],
      createdBy: req.user._id,
    });

    // Notify all Faculty and Students (filtered by course if provided)
    const userQuery = { role: { $in: ['Faculty', 'Student'] } };
    if (event.targetCourses && event.targetCourses.length) {
      userQuery.course = { $in: event.targetCourses };
    }
    const recipients = await User.find(userQuery).select('_id email');

    const notifications = recipients.map((r) => ({
      userId: r._id,
      title: `New Event: ${event.title}`,
      message: event.description || `Event scheduled on ${new Date(event.date).toLocaleString()}`,
      type: 'announcement',
    }));

    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    // --- EMAIL LOGIC ---
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    recipients.forEach((r) => {
      if (r.email) {
        emailService({
          email: r.email,
          subject: `New Event: ${event.title}`,
          message: `A new event has been scheduled:\n\nTitle: ${event.title}\nDate: ${new Date(event.date).toLocaleString()}\nLocation: ${event.location || 'N/A'}\nDescription: ${event.description || ''}\n\nView all events here:\n${frontendUrl}/events`,
        });
      }
    });

    res.status(201).json({ message: 'Event created', event });
  } catch (err) {
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: -1 }).populate('createdBy', 'name role');
    res.json({ events });
  } catch (err) {
    next(err);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ev = await Event.findByIdAndDelete(id);
    if (!ev) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    next(err);
  }
};
