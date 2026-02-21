require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Connected to DB');
        const hods = await User.find({ role: 'HOD' }, 'name email role');
        console.log('HODs in DB:', hods);

        const students = await User.find({ role: 'Student' }, 'name email role').limit(2);
        console.log('Sample Students in DB:', students);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
