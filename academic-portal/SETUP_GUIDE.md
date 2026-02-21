# 🎓 Department Academic Portal - MERN Stack

A comprehensive academic file management system with role-based access control (Admin, Faculty, Student). Built with React.js, Node.js/Express, MongoDB, and modern web technologies.

## 📋 Overview

The Department Academic Portal is a full-stack MERN application that enables:
- **Students** to browse, download, and rate academic materials
- **Faculty** to upload and manage course materials with versioning
- **Admins** to approve files, manage subjects, and view analytics

## 🎯 Key Features

✨ **Authentication**
- JWT-based authentication
- Role-based access control (Admin, Faculty, Student)
- Secure password hashing with bcryptjs
- Auto-login on page refresh

📚 **File Management**
- Upload files with metadata (title, description, subject, tags)
- File versioning system for updates
- Approval workflow (Pending → Approved/Rejected)
- Download tracking and analytics
- 50MB file size limit with type validation (PDF, DOC, DOCX, PPTX, XLSX, JPG, PNG)

⭐ **Student Features**
- Browse approved files with search and filtering
- Download files and track statistics
- Rate files with 1-5 star ratings
- Add personal feedback/reviews
- Bookmark favorite files
- View download history

👨‍🏫 **Faculty Features**
- Upload academic materials (notes, assignments, practice questions, etc.)
- Organize files by subject and semester
- Track upload status and approvals
- Update file versions
- View download statistics
- Add tags for categorization

🔧 **Admin Features**
- Review and approve/reject pending files
- Manage subjects and courses (create, edit, delete)
- Dashboard with comprehensive analytics
- View user statistics by role
- Track system activity and trends
- Monitor file distribution and ratings

📊 **Analytics & Reporting**
- Dashboard charts (weekly uploads, downloads)
- User statistics by role
- File distribution analysis
- Top downloaded files ranking
- System metrics (total users, files, downloads, avg rating)

## 🛠️ Tech Stack

### Frontend
- **React 18.x** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **Heroicons** - Icon library (24 outline icons)
- **Recharts** - Data visualization and charts
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.x** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing (10 salt rounds)
- **Multer** - File upload middleware
- **express-validator** - Input validation
- **dotenv** - Environment variables
- **cors** - Cross-origin resource sharing

## 📊 Database Schema

### Collections (5 total)

#### User
Stores user information and authentication data
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String (hashed),
  role: Enum ['Admin', 'Faculty', 'Student'],
  department: String,
  semester: Number (1-8),
  bookmarks: [ObjectId] (references to Files),
  profileImage: String (optional),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Subject
Academic subjects/courses
```javascript
{
  subjectName: String,
  subjectCode: String (unique),
  semester: Number (1-8),
  department: String,
  description: String,
  faculty: ObjectId (reference to User),
  credits: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### File
File management with versioning and ratings
```javascript
{
  title: String,
  description: String,
  subjectId: ObjectId (reference to Subject),
  uploadedBy: { userId, userName },
  fileType: Enum ['Notes', 'Assignment', 'PYQ', 'Circular', 'Other'],
  status: Enum ['Pending', 'Approved', 'Rejected'],
  currentVersion: Number,
  rejectionReason: String (if rejected),
  department: String,
  semester: Number,
  tags: [String],
  versions: [{
    versionNumber: Number,
    filePath: String,
    fileSize: Number,
    uploadedAt: Date,
    updatedBy: ObjectId
  }],
  ratings: [{
    studentId: ObjectId,
    rating: Number (1-5),
    feedback: String,
    ratedAt: Date
  }],
  averageRating: Number (calculated),
  downloadsCount: Number,
  approvedAt: Date,
  approvedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

#### Notification
System notifications
```javascript
{
  userId: ObjectId (reference to User),
  title: String,
  message: String,
  type: Enum ['file_approved', 'file_rejected', 'file_rated', 'new_subject', 'announcement'],
  relatedFileId: ObjectId (if applicable),
  isRead: Boolean,
  createdAt: Date
}
```

#### DownloadLog
Download tracking for analytics
```javascript
{
  fileId: ObjectId (reference to File),
  userId: ObjectId (reference to User),
  downloadedAt: Date
}
```

## 🚀 Installation Guide

### Prerequisites
- **Node.js** ≥ 14.0.0
- **npm** ≥ 6.0.0
- **MongoDB** 4.4+ (local or MongoDB Atlas cloud)
- **Git** (optional, for version control)

### Step 1: Clone/Extract Project

```bash
# Navigate to project directory
cd academic-portal
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file with configuration
# Copy the template from .env.example or create new:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/academic-portal
# JWT_SECRET=your_secret_key_here
# JWT_EXPIRE=7d
# NODE_ENV=development

# Start backend server
npm run dev
# Or for production: npm start

# Server should start on http://localhost:5000
# Check console for: "🚀 Server running on port 5000"
```

#### MongoDB Setup

**Option 1: Local MongoDB**
```bash
# Install MongoDB Community Edition (if not installed)
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: Follow MongoDB docs

# Start MongoDB service
# Windows: Start MongoDB from Services or: mongod
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Verify connection
# Connection string: mongodb://localhost:27017/academic-portal
```

**Option 2: MongoDB Atlas (Cloud)**
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Set in .env: `MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/academic-portal`

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder (in new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Server should start on http://localhost:5173 or http://localhost:3000
# Check console for: "Local: http://localhost:XXXX"
```

### Step 4: Access Application

Open browser and navigate to:
```
http://localhost:5173
or
http://localhost:3000
```

You'll be redirected to login page.

## 🔐 Demo Credentials

Use these credentials to test the application:

### Student Account
- **Email:** `student@gmail.com`
- **Password:** `password123`

### Faculty Account (Create via Admin)
- **Email:** `faculty@gmail.com`
- **Password:** `password123`

### Admin Account (Create via MongoDB)
```javascript
db.users.insertOne({
  name: "Admin User",
  email: "admin@gmail.com",
  passwordHash: "$2a$10...", // hashed 'password123'
  role: "Admin",
  department: "Administration",
  isActive: true
})
```

To create admin, use bcryptjs to hash password:
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash('password123', 10);
console.log(hashedPassword);
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST   /register          - Register new student account
POST   /login             - Login user (returns JWT token)
GET    /me                - Get current user profile
PUT    /profile           - Update user profile
```

### File Management (`/api/files`)
```
POST   /upload            - Upload new file (Faculty only)
GET    /approved          - Get approved files (all users)
GET    /pending           - Get pending files (Admin only)
GET    /my-uploads        - Get user's uploads (Faculty only)
GET    /:id               - Get file details
PUT    /:id/approve       - Approve file (Admin)
PUT    /:id/reject        - Reject file (Admin)
PUT    /:id/update-version - Update file version (Faculty)
POST   /:id/rate          - Rate file (Student)
POST   /:id/download      - Download file
```

### Subject Management (`/api/subjects`)
```
GET    /                  - Get all subjects (public)
POST   /                  - Create subject (Admin)
PUT    /:id               - Update subject (Admin)
DELETE /:id               - Delete subject (Admin)
```

### User Operations (`/api/users`)
```
POST   /bookmark          - Bookmark file (Student)
DELETE /bookmark/:fileId  - Remove bookmark (Student)
GET    /bookmarks         - Get bookmarked files (Student)
GET    /notifications     - Get user notifications
PUT    /notifications/:id/read - Mark notification as read
PUT    /notifications/mark-all-read - Mark all as read
```

### Admin Routes (`/api/admin`)
```
GET    /dashboard         - Get dashboard analytics (Admin)
GET    /user-statistics   - Get user statistics
```

## 🎨 Frontend Pages & Routes

### Public Routes
- `/login` - Login page
- `/register` - Registration page

### Protected Routes

**Student Routes**
- `/dashboard` - Main dashboard
- `/student/files` - Browse and search files
- `/student/bookmarks` - View bookmarks

**Faculty Routes**
- `/faculty/upload` - Upload form
- `/faculty/my-uploads` - Track uploads

**Admin Routes**
- `/admin/approvals` - Approve/reject files
- `/admin/subjects` - Manage subjects
- `/admin/analytics` - View analytics

## 🧪 Testing the Application

### Test Student Flow
1. Go to login page
2. Enter: `student@gmail.com` / `password123`
3. Navigate to "Browse Files"
4. Search and filter files
5. Download or bookmark a file
6. Go to "Bookmarks" to see saved files

### Test Faculty Flow
1. Register as faculty (create account)
2. Go to "Upload" page
3. Fill form and drag-drop file
4. Check "My Uploads" to see pending status
5. Wait for admin approval

### Test Admin Flow
1. Create admin account in MongoDB
2. Login with admin credentials
3. Go to "Pending Approvals"
4. Review and approve/reject files
5. Manage subjects and view analytics

## 📁 Project Structure

```
academic-portal/
├── backend/
│   ├── models/           # Mongoose schemas
│   │   ├── User.js
│   │   ├── Subject.js
│   │   ├── File.js
│   │   ├── Notification.js
│   │   └── DownloadLog.js
│   │
│   ├── controllers/      # Business logic handlers
│   │   ├── authController.js
│   │   ├── fileController.js
│   │   ├── subjectController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   │
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js
│   │   ├── fileRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── notificationRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── middleware/      # Custom middleware
│   │   └── authMiddleware.js
│   │
│   ├── utils/           # Utility functions
│   │   └── jwt.js
│   │
│   ├── uploads/         # File storage directory
│   ├── server.js        # Express app entry point
│   ├── package.json
│   ├── .env.example     # Environment template
│   └── README.md        # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Student/
│   │   │   ├── Faculty/
│   │   │   └── Admin/
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── index.css
│   │
│   ├── public/
│   ├── tailwind.config.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── README.md            # This file
└── .gitignore
```

## 🔧 Configuration Files

### Backend .env
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/academic-portal

# JWT Configuration
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=52428800  # 50MB in bytes
ALLOWED_FILE_TYPES=pdf,doc,docx,pptx,xlsx,jpg,png
```

### Frontend .env
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment Guide

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod
```

### Frontend Deployment (Netlify)
```bash
# Build production files
npm run build

# Drag and drop dist/ folder to Netlify
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## 📚 Additional Scripts

### Backend
```bash
# Development with hot reload
npm run dev

# Production mode
npm start

# Run tests (if configured)
npm test
```

### Frontend
```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run tests (if configured)
npm test
```

## 🐛 Troubleshooting

### Backend Connection Issues
**Error:** `MongoDB connection failed`
- Verify MongoDB is running (`mongod` or MongoDB service)
- Check `MONGODB_URI` in .env
- For Atlas, ensure IP is whitelisted

**Error:** `PORT already in use`
- Change PORT in .env
- Or kill process: `lsof -ti:5000 | xargs kill -9`

### Frontend Build Issues
**Error:** `Module not found`
- Run `npm install` again
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`

**Error:** `API connection failed`
- Verify backend is running on http://localhost:5000
- Check `VITE_API_URL` environment variable
- Check browser console for CORS errors

### Authentication Issues
**Error:** `Invalid token`
- Clear localStorage and login again
- Check JWT_SECRET matches between login and token verification
- Verify token hasn't expired (check JWT_EXPIRE setting)

### File Upload Issues
**Error:** `File size exceeds limit`
- Max file size is 50MB
- Check `MAX_FILE_SIZE` in backend .env

**Error:** `File type not allowed`
- Only PDF, DOC, DOCX, PPTX, XLSX, JPG, PNG allowed
- Check `ALLOWED_FILE_TYPES` in backend .env

## 📞 Support & Issues

### Getting Help
1. Check troubleshooting section above
2. Review console errors (browser DevTools & terminal)
3. Check API responses in Network tab
4. Verify .env configuration

### Common Issues Checklist
- [ ] Both servers running (backend:5000, frontend:5173)
- [ ] MongoDB running locally or connected to Atlas
- [ ] .env files properly configured
- [ ] npm dependencies installed (`npm install`)
- [ ] Node.js version 14+ installed
- [ ] No port conflicts

## 📚 Learning Resources

- [MERN Stack Documentation](https://www.mongodb.com/languages/javascript/mern-stack)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Mongoose Guide](https://mongoosejs.com/)
- [Tailwind CSS](https://tailwindcss.com)
- [JWT Explanation](https://jwt.io/introduction)

## 📝 Features Roadmap

### Completed ✅
- User authentication with JWT
- File upload and versioning
- Approval workflow
- Role-based access control
- Student bookmarks
- File ratings
- Admin analytics

### Future Enhancements 🚀
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Advanced search with filters
- [ ] Batch file operations
- [ ] Integration with external storage (AWS S3, Google Drive)
- [ ] Real-time notifications with WebSocket
- [ ] File preview (PDF, Office docs)
- [ ] Student groups/classes
- [ ] Assignment submission tracking
- [ ] Plagiarism detection
- [ ] Mobile app (React Native/Flutter)

## 📄 License

This project is provided as-is for educational purposes.

## 👥 Team

Developed as a comprehensive MERN stack application for Department Academic Portal.

---

## 🎉 Get Started

Ready to run the application?

1. **Install dependencies**: `npm install` in both `backend/` and `frontend/`
2. **Configure .env**: Set up MongoDB and JWT settings
3. **Start servers**: 
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`
4. **Login**: Use demo credentials
5. **Explore**: Test different roles and features

**Happy Coding! 🚀**
