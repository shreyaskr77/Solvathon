const Subject = require("../models/Subject");

// @desc Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { semester, department } = req.query;
    let filter = {};

    if (semester) filter.semester = semester;
    if (department) filter.department = department;

    const subjects = await Subject.find(filter).populate("faculty", "name");

    res.status(200).json({
      count: subjects.length,
      subjects,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Create a new subject (Admin only)
exports.createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode, semester, department, description, credits } = req.body;

    const subject = new Subject({
      subjectName,
      subjectCode,
      semester,
      department,
      description,
      credits,
    });

    await subject.save();

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Update a subject (Admin only)
exports.updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({
      message: "Subject updated",
      subject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc Delete a subject (Admin only)
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);

    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    res.status(200).json({ message: "Subject deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
