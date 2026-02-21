# Quick Reference - Common Commands

## 🚀 Start the Application

### Windows
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Or run setup.bat first for initial setup:
setup.bat
```

### macOS / Linux
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev

# Or run setup.sh first for initial setup:
bash setup.sh
```

## 📦 Installation

### One-Time Setup
```bash
# Windows
setup.bat

# macOS/Linux
bash setup.sh
```

### Manual Installation
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

## 🔧 Configuration

### Backend Configuration (.env)
```bash
cd backend

# Copy template (if not already done)
# Windows:
copy .env.example .env

# macOS/Linux:
cp .env.example .env

# Edit with your settings
# Important: Set MONGODB_URI, JWT_SECRET
```

### Frontend Configuration (.env.local)
```bash
cd frontend

# Create .env.local if needed
# Ensure VITE_API_URL matches backend URL
```

## 📡 Backend Commands

```bash
cd backend

# Start development server (with hot reload)
npm run dev

# Start production server
npm start

# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test
```

## 🎨 Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test
```

## 🗄️ Database

### MongoDB Local

#### Windows
```bash
# Start MongoDB (in separate terminal)
mongod

# Or manage as Windows service
```

#### macOS
```bash
# Start with Homebrew
brew services start mongodb-community

# Stop when done
brew services stop mongodb-community
```

#### Linux
```bash
# Start MongoDB service
sudo systemctl start mongod

# Stop when done
sudo systemctl stop mongod
```

### MongoDB Atlas (Cloud)

```bash
# Connection string format:
mongodb+srv://username:password@cluster0.mongodb.net/academic-portal

# Add to backend/.env:
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/academic-portal
```

## 🧪 Testing

### Create Test Data

#### Create Student Account
```bash
# Use registration page or API
POST http://localhost:5000/api/auth/register
{
  "name": "Test Student",
  "email": "student@gmail.com",
  "password": "password123",
  "department": "CS",
  "semester": 3
}
```

#### Create Admin Account in MongoDB
```bash
# Use MongoDB Client (mongosh or Compass)
db.users.insertOne({
  name: "Admin User",
  email: "admin@gmail.com",
  passwordHash: "$2a$10$...", // Use bcrypt to hash
  role: "Admin",
  department: "Administration",
  isActive: true,
  createdAt: new Date()
})
```

#### Login Test
```bash
# API
POST http://localhost:5000/api/auth/login
{
  "email": "student@gmail.com",
  "password": "password123"
}

# Response should include JWT token
```

## 🐛 Troubleshooting

### MongoDB Connection Failed
```bash
# Check the connection string in .env
# Verify MongoDB is running:

# Windows
tasklist | findstr mongod

# macOS
ps aux | grep mongod

# Linux
systemctl status mongod

# Start if not running
mongod  # Windows/macOS
sudo systemctl start mongod  # Linux
```

### Port Already in Use
```bash
# Find process using port 5000 (backend):

# Windows
netstat -ano | findstr :5000

# macOS/Linux
lsof -i :5000

# Kill the process:
# Windows: taskkill /PID <PID> /F
# macOS/Linux: kill -9 <PID>

# Or change port in backend/.env
```

### Clear npm Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Clear Frontend Build
```bash
cd frontend
rm -rf dist node_modules
npm install
npm run build
```

## 📊 API Testing

### Using cURL

#### Register Student
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Student",
    "email": "test@gmail.com",
    "password": "password123",
    "department": "CS",
    "semester": 3
  }'
```

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@gmail.com",
    "password": "password123"
  }'
```

#### Get User Profile (requires token)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

#### Get All Subjects
```bash
curl http://localhost:5000/api/subjects
```

### Using Postman
1. Download Postman from https://www.postman.com/
2. Create new requests for each endpoint
3. Set Authorization header: `Authorization: Bearer {{token}}`
4. Use environment variables for base URL and token

## 🔐 Security Notes

- Never commit .env files to git
- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS in production
- Whitelist MongoDB IP (if using Atlas)
- Set CORS_ORIGIN to your frontend URL in production

## 📈 Performance Tips

### Backend
- Use indexes on frequently queried fields
- Implement pagination for large datasets
- Cache file data when possible
- Monitor MongoDB performance

### Frontend
- Use lazy loading for routes
- Optimize images
- Minify CSS and JavaScript
- Use production build for deployment

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Change JWT_SECRET
- [ ] Configure MONGODB_URI (production)
- [ ] Set NODE_ENV to production
- [ ] Run production build
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Monitor logs
- [ ] Test all features

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [JWT Docs](https://jwt.io/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## ❓ FAQs

**Q: How do I change the port?**
A: Edit backend/.env and change PORT=5000 to desired port

**Q: Can I use MongoDB Atlas instead of local?**
A: Yes, set MONGODB_URI to your Atlas connection string in .env

**Q: How do I deploy to production?**
A: See SETUP_GUIDE.md Deployment section

**Q: What if I forget the JWT_SECRET?**
A: Current sessions will invalidate. Set new secret - users must login again

**Q: How do I backup the database?**
A: Use MongoDB backup tools or export from MongoDB Compass

---

For detailed information, refer to:
- **SETUP_GUIDE.md** - Complete setup guide
- **backend/README.md** - Backend documentation
- **frontend/README.md** - Frontend documentation
