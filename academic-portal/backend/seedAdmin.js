const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Subject = require('./models/Subject');
require('dotenv').config();

const seedDemo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/academic_portal');

    // Admin
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'System Admin',
        email: 'admin@portal.com',
        password: hashedPassword,
        role: 'Admin',
        department: 'Administration'
      });
      console.log('✅ Admin Created: admin@portal.com / admin123');
    } else {
      console.log('Admin already exists');
    }

    // Faculty
    const facultyExists = await User.findOne({ email: 'faculty@portal.com' });
    if (!facultyExists) {
      const hashedPassword = await bcrypt.hash('faculty123', 10);
      await User.create({
        name: 'Demo Faculty',
        email: 'faculty@portal.com',
        password: hashedPassword,
        role: 'Faculty',
        department: 'Computer Science'
      });
      console.log('✅ Faculty Created: faculty@portal.com / faculty123');
    } else {
      console.log('Faculty account already exists');
    }

    // Student
    const studentExists = await User.findOne({ email: 'student@portal.com' });
    if (!studentExists) {
      const hashedPassword = await bcrypt.hash('student123', 10);
      await User.create({
        name: 'Demo Student',
        email: 'student@portal.com',
        password: hashedPassword,
        role: 'Student',
        department: 'Computer Science',
        semester: 4
      });
      console.log('✅ Student Created: student@portal.com / student123');
    } else {
      console.log('Student account already exists');
    }

    // HOD
    const hodExists = await User.findOne({ email: 'hod@portal.com' });
    if (!hodExists) {
      const hashedPassword = await bcrypt.hash('hod123', 10);
      await User.create({
        name: 'Demo HOD',
        email: 'hod@portal.com',
        password: hashedPassword,
        role: 'HOD',
        department: 'Computer Science'
      });
      console.log('✅ HOD Created: hod@portal.com / hod123');
    } else {
      console.log('HOD account already exists');
    }

    // Seed Subjects
    const subjectsToCreate = [
      { subjectName: 'Data Structures', subjectCode: 'CS101', semester: '3', department: 'Computer Science', description: 'Learn fundamental data structures and algorithms', credits: 4 },
      { subjectName: 'Database Management System', subjectCode: 'CS102', semester: '3', department: 'Computer Science', description: 'Introduction to DBMS and SQL', credits: 4 },
      { subjectName: 'Web Development', subjectCode: 'CS103', semester: '4', department: 'Computer Science', description: 'Frontend and backend web development', credits: 3 },
      { subjectName: 'Operating Systems', subjectCode: 'CS104', semester: '4', department: 'Computer Science', description: 'OS concepts and process management', credits: 4 },
      { subjectName: 'Computer Networks', subjectCode: 'CS105', semester: '5', department: 'Computer Science', description: 'Networking protocols and architecture', credits: 4 },
      { subjectName: 'Machine Learning', subjectCode: 'CS106', semester: '5', department: 'Computer Science', description: 'ML algorithms and applications', credits: 3 },
    ];

    for (const subj of subjectsToCreate) {
      const exists = await Subject.findOne({ subjectCode: subj.subjectCode });
      if (!exists) {
        await Subject.create(subj);
        console.log(`✅ Subject Created: ${subj.subjectName}`);
      }
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDemo();