# Academic Portal - Backend Server

Express.js server for the Department Academic Portal MERN application.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/academic-portal
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Running Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run start
```

Server will run on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── models/
│   ├── User.js              # User schema with authentication
│   ├── Subject.js           # Subject/Course schema
│   ├── File.js              # File with versions and ratings
│   ├── Notification.js      # Notifications for users
│   └── DownloadLog.js       # Download history tracking
│
├── controllers/
│   ├── authController.js    # Registration and login logic
│   ├── subjectController.js # Subject CRUD operations
│   ├── fileController.js    # File upload approval workflow
│   ├── userController.js    # User actions (bookmark, notifications)
│   └── adminController.js   # Analytics and dashboard
│
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── subjectRoutes.js     # Subject endpoints
│   ├── fileRoutes.js        # File endpoints
│   ├── notificationRoutes.js # Notification endpoints
│   └── adminRoutes.js       # Admin endpoints
│
├── middleware/
│   └── authMiddleware.js    # JWT verification & role authorization
│
├── utils/
│   └── jwt.js              # JWT helper functions
│
├── uploads/                 # Local file storage directory
├── server.js               # Express app setup
├── .env                    # Environment variables
├── .gitignore
└── package.json
```

## 📚 API Routes

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new student
- `POST /login` - Login user
- `GET /me` - Get current authenticated user
- `PUT /profile` - Update user profile

### Subject Routes (`/api/subjects`)
- `GET /` - Get all subjects (with filters)
- `POST /` - Create subject (Admin only)
- `PUT /:id` - Update subject (Admin only)
- `DELETE /:id` - Delete subject (Admin only)

### File Routes (`/api/files`)
- `POST /upload` - Upload file (Faculty only)
- `GET /approved` - Get approved files (Student only)
- `GET /pending` - Get pending files (Admin only)
- `GET /my-uploads` - Get user's uploaded files (Faculty only)
- `GET /:id` - Get file details
- `PUT /:id/approve` - Approve file (Admin only)
- `PUT /:id/reject` - Reject file (Admin only)
- `PUT /:id/update-version` - Update file version (Faculty)
- `POST /:id/rate` - Rate file (Student only)
- `POST /:id/download` - Download file (Student only)

### Notification Routes (`/api/notifications`)
- `POST /bookmark` - Bookmark file (Student only)
- `DELETE /bookmark/:fileId` - Remove bookmark (Student only)
- `GET /bookmarks` - Get bookmarks (Student only)
- `GET /` - Get user notifications
- `PUT /:id/read` - Mark notification as read
- `PUT /mark-all-read` - Mark all notifications as read

### Admin Routes (`/api/admin`)
- `GET /dashboard` - Dashboard analytics (Admin only)
- `GET /user-statistics` - User statistics

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

### Handling JWT Tokens

1. **Login/Register** - Server returns token in response
2. **Store Token** - Client saves token to localStorage
3. **Include in Requests** - Client includes token in Authorization header:
   ```
   Authorization: Bearer <token>
   ```
4. **Server Verification** - Middleware verifies token and extracts user info
5. **Expired Token** - Client should refresh or redirect to login

### Protected Routes

Routes are protected using middleware:
```javascript
router.get('/protected-endpoint', protect, authorize('Admin'), controller);
```

- `protect` - Verifies JWT token
- `authorize('Role')` - Checks user role

## 📦 Dependencies

### Production
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `dotenv` - Environment variables
- `cors` - Cross-origin requests

### Development
- `nodemon` - Auto-restart on file changes

## 🗄️ MongoDB Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  passwordHash: String,
  role: 'Admin' | 'Faculty' | 'Student',
  department: String,
  semester: Number,
  bookmarks: [{fileId, bookmarkedAt}],
  profileImage: String,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### File Schema
```javascript
{
  title: String,
  description: String,
  subjectId: ObjectId (ref: Subject),
  uploadedBy: {userId, userName},
  fileType: 'Notes' | 'Assignment' | 'PYQ' | 'Circular',
  status: 'Pending' | 'Approved' | 'Rejected',
  versions: [{
    versionNumber: Number,
    filePath: String,
    uploadedAt: Date,
    updatedBy: ObjectId
  }],
  ratings: [{
    studentId: ObjectId,
    rating: Number,
    feedback: String,
    ratedAt: Date
  }],
  downloadsCount: Number,
  averageRating: Number,
  approvedAt: Date,
  approvedBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing:** bcryptjs with 10 salt rounds
- **JWT Tokens:** Expires in 7 days
- **Role-Based Access:** Middleware checks user roles
- **File Validation:** Multer validates file types and size
- **CORS:** Enabled with origin restrictions
- **Input Validation:** express-validator on all inputs
- **Error Handling:** Centralized error middleware

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/academic-portal
JWT_SECRET=your_long_random_secret_key_here
JWT_EXPIRE=7d
```

### Hosting Options
- Heroku
- Railway
- Render
- AWS EC2
- DigitalOcean
- Azure

## 📊 Database Setup

### Local MongoDB
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### MongoDB Atlas (Cloud)
1. Create account at [mongodb.com](https://mongodb.com)
2. Create cluster
3. Add IP address to whitelist
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in `.env`

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=8000 npm run dev
```

### MongoDB Connection Fails
- Check if MongoDB is running
- Verify connection string
- Check network access (Atlas firewall)
- Verify credentials

### File Upload Issues
- Check uploads/ directory exists
- Verify file size limits
- Check allowed file types
- Ensure disk space available

## 📝 API Response Format

### Success Response
```json
{
  "message": "Success message",
  "data": {...},
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "status": 400
}
```

## 🔄 Workflow Examples

### File Upload and Approval Workflow
1. Faculty uploads file → status = "Pending"
2. Admin reviews file
3. Admin approves → status = "Approved", notification sent to faculty
4. File becomes visible to students
5. Students can download, rate, and bookmark

### Rating System
1. Student rates approved file (1-5 stars)
2. Optional feedback text
3. Average rating calculated (first rating only? or cumulative?)
4. Faculty notified of new rating
5. Stats updated in analytics

## 📚 Additional Documentation

- [Express.js Docs](https://expressjs.com)
- [Mongoose Docs](https://mongoosejs.com)
- [JWT.io](https://jwt.io)
- [Multer Docs](https://github.com/expressjs/multer)

---

**Happy Coding! 🚀**
