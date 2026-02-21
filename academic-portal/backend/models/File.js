const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    subjectIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
      }
    ],
    uploadedBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
    },
    fileType: {
      type: String,
      enum: ["Notes", "Assignment", "PYQ", "Circular"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    versions: [
      {
        versionNumber: {
          type: Number,
          default: 1,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    currentVersion: {
      type: Number,
      default: 1,
    },
    ratings: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        feedback: {
          type: String,
          trim: true,
        },
        ratedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    downloadsCount: {
      type: Number,
      default: 0,
    },
    semester: {
      type: Number,
      min: 1,
      max: 8,
    },
    department: {
      type: String,
      trim: true,
    },
    tags: [String],
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for better search performance
fileSchema.index({ status: 1, fileType: 1, semester: 1 });
fileSchema.index({ subjectIds: 1, status: 1 });
fileSchema.index({ "uploadedBy.userId": 1 });

module.exports = mongoose.model("File", fileSchema);
