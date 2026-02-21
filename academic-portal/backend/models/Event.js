const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetCourses: [{ type: String }],
  attachments: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
