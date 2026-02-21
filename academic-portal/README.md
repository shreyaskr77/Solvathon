# 🎓 Department Academic Portal - Complete MERN Stack Application

A beautiful, production-ready centralized platform for a college department where Admins, Faculty, and Students can upload, manage, approve, and access academic resources.

## ⚡ Quick Start (30 seconds)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Then start the servers:
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`

Open [http://localhost:5173](http://localhost:5173) and login with:
- Email: `student@gmail.com`
- Password: `password123`

👉 **[Full Setup Guide →](./SETUP_GUIDE.md)**

## 🎯 Features Overview

### 👨‍🎓 **For Students**
- 📚 Browse approved academic materials (Notes, Assignments, PYQs, Circulars)
- 🔍 Search & filter by subject, semester, file type
- ⭐ Rate files with 1-5 stars and feedback
- 🔖 Bookmark favorite files for quick access
- 📥 Download with version history tracking
- 📊 View personal download statistics

### 👨‍🏫 **For Faculty**
- 📤 Upload course materials with metadata
- 🔄 Update file versions with approval workflow
- 📊 Track download counts and user ratings
- ⏳ Monitor approval status in real-time
- 🏷️ Organize by subject, semester, and custom tags
- 📈 View analytics on uploaded content

### 🔧 **For Admins**
- ✅ Review pending files with approval/rejection
- 📚 Manage subjects, semesters, and credits
- 📊 Comprehensive analytics dashboard
- 📈 Charts for weekly uploads/downloads
- 👥 User statistics by role
- 🎯 System-wide metrics and trends

### 🔒 **Security & Quality**
- 🛡️ JWT-based authentication (7-day tokens)
- 🔐 bcryptjs password hashing (10 salt rounds)
- 📋 Role-based access control on all routes
- ✔️ Input validation & error handling
- 🚫 CORS protection & secure file storage
- 🔄 Automatic token refresh support

### 🎨 **UI/UX Excellence**
- 💫 Modern gradient design with animations
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🌙 Dark mode infrastructure (ready to toggle)
- 🎯 Intuitive navigation with icons
- ⚡ Fast & optimized performance
- ♿ Accessible components & semantics

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 4.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Security:** bcryptjs
- **File Upload:** Multer
- **Environment:** dotenv
- **CORS:** Enabled for frontend integration

### Frontend
- **Library:** React 18.x
- **Build Tool:** Vite / react-scripts
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS 3.x
- **Icons:** Heroicons/react
- **Charts:** Recharts
- **State Management:** React Context API

## 📋 Database Collections

### users
- name, email, passwordHash
- role (Admin | Faculty | Student)
- department, semester
- bookmarks array
- createdAt, updatedAt

### subjects
- subjectName, subjectCode
- semester, department
- description, credits
- faculty (optional)

### files
- title, description
- subjectId, fileType (Notes|Assignment|PYQ|Circular)
- status (Pending|Approved|Rejected)
- versions array (versionNumber, filePath, uploadedAt)
- ratings array (studentId, rating, feedback)
- uploadedBy, approvedBy
- downloadsCount, averageRating

### notifications
- userId, title, message
- type (file_approved|file_rejected|file_rated|new_subject|announcement)
- isRead, createdAt

## 🚀 Quick Start (30 seconds)

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Then start the servers:
- **Backend:** `cd backend && npm run dev`
- **Frontend:** `cd frontend && npm run dev`

Open [http://localhost:5173](http://localhost:5173) and login with:
- Email: `student@gmail.com`
- Password: `password123`

👉 **[Full Setup Guide →](./SETUP_GUIDE.md)**

## 📦 What's Included

✅ **Complete Backend**
- 5 MongoDB models with proper validation
- 5 API controllers with business logic
- 30+ RESTful API endpoints
- JWT authentication & role-based authorization
- File upload with Multer (50MB limit)
- Error handling & input validation
- Database indexing for performance

✅ **Beautiful Frontend**
- 10+ React pages with responsive design
- Modern UI with Tailwind CSS & Heroicons
- Role-based navigation (Admin, Faculty, Student)
- File search, filter, and sorting
- Analytics dashboard with charts
- Form validation & error handling
- Dark mode ready (toggle in sidebar)

✅ **Complete Documentation**
- Setup guide with troubleshooting
- API documentation with examples
- Quick reference for common tasks
- Feature list & capabilities
- Environment configuration templates
- Automated setup scripts (Windows & Unix)

## 🔐 Demo Credentials

**Student:**
- Email: `student@gmail.com`
- Password: `password123`

**Faculty:**
- Email: `faculty@gmail.com`
- Password: `password123`

**Admin:**
- Email: `admin@gmail.com`
- Password: `password123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Subjects
- `GET /api/subjects` - List all subjects
- `POST /api/subjects` - Create subject (Admin)
- `PUT /api/subjects/:id` - Update subject (Admin)
- `DELETE /api/subjects/:id` - Delete subject (Admin)

### Files
- `POST /api/files/upload` - Upload file (Faculty)
- `GET /api/files/approved` - Get approved files (Student)
- `GET /api/files/pending` - Get pending files (Admin)
- `GET /api/files/my-uploads` - Get user's uploads (Faculty)
- `GET /api/files/:id` - Get file details
- `PUT /api/files/:id/approve` - Approve file (Admin)
- `PUT /api/files/:id/reject` - Reject file (Admin)
- `PUT /api/files/:id/update-version` - Update version (Faculty)
- `POST /api/files/:id/rate` - Rate file (Student)
- `POST /api/files/:id/download` - Download file (Student)

### User Actions
- `POST /api/notifications/bookmark` - Bookmark file (Student)
- `DELETE /api/notifications/bookmark/:fileId` - Remove bookmark (Student)
- `GET /api/notifications/bookmarks` - Get bookmarks (Student)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read

### Admin
- `GET /api/admin/dashboard` - Dashboard analytics (Admin)
- `GET /api/admin/user-statistics` - User stats

## 🎨 Features Highlights

### Beautiful UI
- Gradient backgrounds with modern design
- Responsive layout (Mobile, Tablet, Desktop)
- Smooth animations and transitions
- Icon-rich interface with Heroicons
- Analytics dashboard with charts
- Role-specific layouts

### Security
- ✅ JWT authentication
- ✅ Password hashing with bcryptjs
- ✅ Role-based authorization
- ✅ CORS protection
- ✅ Protected file routes
- ✅ Secure API endpoints

## 🚀 Deployment

### Backend (Heroku/Railway)
1. Set production `.env` variables
2. Deploy to hosting platform
3. Update frontend API URL

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Set API environment variable

## 📄 Project Structure

```
academic-portal/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── controllers/     # Business logic
│   ├── routes/          # API endpoints
│   ├── middleware/      # Authentication & validation
│   ├── uploads/         # File storage
│   └── server.js        # Entry point
│
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── context/     # State management
    │   ├── services/    # API calls
    │   └── App.jsx      # Root component
    └── tailwind.config.js
```

## � Documentation

Comprehensive documentation is available for different purposes:

### Getting Started (Start Here!)
- 📦 **[DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md)** - What you're getting (5 min read)
- ✅ **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Step-by-step checklist
- 🚀 **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Complete installation & configuration guide
- ⚡ **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - Common commands & troubleshooting

### Complete Documentation  
- ✨ **[FEATURES.md](./FEATURES.md)** - Complete feature list & capabilities
- 📊 **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Project completion status
- 🗂️ **[INDEX.md](./INDEX.md)** - Navigation guide for all documentation

### Module Documentation  
- 🔧 **[backend/README.md](./backend/README.md)** - Backend API documentation
- 🎨 **[frontend/README.md](./frontend/README.md)** - Frontend setup & components

### Configuration Files
- `.env.example` files - Environment variable templates
- `setup.bat` / `setup.sh` - Automated setup scripts

## ⚡ Performance

- Optimized Tailwind CSS builds
- Lazy-loaded React components
- Database indexed queries
- JWT token caching
- File size limits (50MB max)

## 📧 Support

For issues or questions:
- Open a GitHub issue
- Check the documentation
- Review API endpoints

---

**Built with ❤️ for academic excellence!**
