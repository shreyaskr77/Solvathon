# 🔍 Setup & Deployment Checklist

Use this checklist to ensure you've completed all necessary steps for setup and deployment.

## 📋 Pre-Setup Checklist

- [ ] Node.js 14+ installed? `node --version`
- [ ] npm 6+ installed? `npm --version`
- [ ] MongoDB installed or Atlas account created?
- [ ] Git installed (optional but recommended)?
- [ ] Enough disk space (500MB minimum)?
- [ ] Internet connection available?
- [ ] No port 5000/5173 conflicts?

## 🔧 Initial Setup

### Windows Users
- [ ] Run `setup.bat` from project root
- [ ] Wait for dependencies to install
- [ ] Check for any errors in console

### macOS/Linux Users
- [ ] Run `bash setup.sh` from project root
- [ ] Wait for dependencies to install
- [ ] Check for any errors in console

### Manual Setup (if scripts don't work)
- [ ] `cd backend && npm install`
- [ ] `cd frontend && npm install`

## ⚙️ Configuration

### Backend Configuration
- [ ] Created `backend/.env` file (copy from .env.example)
- [ ] Added MongoDB connection string
  - [ ] Local: `mongodb://localhost:27017/academic-portal`
  - [ ] Cloud: MongoDB Atlas connection string
- [ ] Set JWT_SECRET to a long random string
- [ ] Set JWT_EXPIRE (default: 7d)
- [ ] Set PORT (default: 5000)
- [ ] Set NODE_ENV (development or production)

### Frontend Configuration
- [ ] Created `frontend/.env.local` file (copy from .env.example)
- [ ] Set VITE_API_URL to backend URL
  - [ ] Local: `http://localhost:5000/api`
  - [ ] Production: your backend URL

## 🗄️ Database Setup

### If using Local MongoDB

**Windows**
- [ ] Downloaded MongoDB Community Edition
- [ ] Installed MongoDB
- [ ] Started MongoDB Service
  - [ ] Via Services: mongod running?
  - [ ] Via Command: opened separate terminal and ran `mongod`?

**macOS**
- [ ] Installed via Homebrew: `brew install mongodb-community`
- [ ] Started service: `brew services start mongodb-community`
- [ ] Verify running: `brew services list`

**Linux**
- [ ] Installed MongoDB Community Edition
- [ ] Started service: `sudo systemctl start mongod`
- [ ] Verify running: `sudo systemctl status mongod`

### If using MongoDB Atlas (Cloud)
- [ ] Created MongoDB Atlas account
- [ ] Created a cluster
- [ ] Whitelisted your IP
- [ ] Created database user
- [ ] Copied connection string
- [ ] Updated `backend/.env` with connection string

## 📦 Dependency Verification

### Backend Dependencies
Open `backend/package.json` and verify these exist:
- [ ] `express`
- [ ] `mongoose`
- [ ] `jsonwebtoken`
- [ ] `bcryptjs`
- [ ] `multer`
- [ ] `dotenv`
- [ ] `cors`

Run `cd backend && npm install` if any are missing

### Frontend Dependencies
Open `frontend/package.json` and verify these exist:
- [ ] `react`
- [ ] `react-router-dom`
- [ ] `axios`
- [ ] `tailwindcss`
- [ ] `@heroicons/react`
- [ ] `recharts`

Run `cd frontend && npm install` if any are missing

## 🚀 Server Startup

### Terminal 1 - MongoDB
- [ ] MongoDB service running (skip if using Atlas)

### Terminal 2 - Backend Server
```bash
cd backend
npm run dev
```
- [ ] ✅ Server running on http://localhost:5000?
- [ ] ✅ "🚀 Server running on port 5000" in console?
- [ ] ✅ No error messages?

### Terminal 3 - Frontend Server
```bash
cd frontend
npm run dev
```
- [ ] ✅ Server running on http://localhost:5173 or http://localhost:3000?
- [ ] ✅ "Local: http://localhost:XXXX" shown?
- [ ] ✅ No error messages?

## 🧪 Initial Testing

### Login Page Test
- [ ] Can access http://localhost:5173
- [ ] Login page displays correctly
- [ ] Demo credentials visible
- [ ] No styling issues

### Demo Login Test
- [ ] Email field accepts input
- [ ] Password field accepts input
- [ ] Login button clickable
- [ ] Accepts: `student@gmail.com` / `password123`
- [ ] Redirects to dashboard
- [ ] User name displays correctly

### Dashboard Test
- [ ] Welcome message shows
- [ ] User role displays
- [ ] Stats cards visible
- [ ] Quick action buttons present
- [ ] Navigation links visible

### Navigation Test
- [ ] Sidebar displays role-based links
- [ ] Can click on Student/Browse link
- [ ] Can click on Student/Bookmarks link
- [ ] Logout button works (redirects to login)

### API Test
- [ ] Backend console shows API requests
- [ ] Frontend console has no CORS errors
- [ ] API responses appear correct
- [ ] No "Cannot GET /api/..." errors

## 📊 Feature Testing

### Student Features
- [ ] Browse page loads
- [ ] Can search for files
- [ ] Filter dropdown works
- [ ] File cards display
- [ ] Bookmark button visible
- [ ] Download button responds

### Faculty Features
- [ ] Upload page loads
- [ ] All form fields present
- [ ] Can select file from computer
- [ ] Subject dropdown works
- [ ] Submit button functional

### Admin Features
- [ ] Pending Approvals page loads
- [ ] Approvals cards display
- [ ] Approve/Reject buttons visible
- [ ] Subjects page loads
- [ ] Analytics page shows charts

## 🔐 Security Verification

- [ ] Password fields show dots (masked)
- [ ] Token stored in localStorage (check browser DevTools)
- [ ] Token sent in API requests (check Network tab)
- [ ] Login required for protected pages
- [ ] Unauthorized access redirected to login

## 🎨 UI/UX Verification

- [ ] Sidebar responsive on mobile
- [ ] Colors load correctly (no broken CSS)
- [ ] Icons display (not missing)
- [ ] Forms are properly formatted
- [ ] Buttons have hover effects
- [ ] Tables display correctly

## 📱 Responsive Design Check

### Mobile View (320px - 768px)
- [ ] Use browser DevTools (F12)
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Select mobile device
- [ ] Page still loads
- [ ] Sidebar collapses or adapts
- [ ] Text is readable
- [ ] Buttons are clickable

### Tablet View (768px - 1024px)
- [ ] Change device to tablet
- [ ] Layout adapts properly
- [ ] Content is visible
- [ ] No horizontal scrolling

### Desktop View (1920px+)
- [ ] Layout looks optimal
- [ ] Full features visible
- [ ] Proper spacing

## 🔧 Troubleshooting & Common Issues

### If MongoDB doesn't connect:
- [ ] Is MongoDB running?
- [ ] Is connection string correct in .env?
- [ ] Is password correct (if using Atlas)?
- [ ] Is IP whitelisted (if using Atlas)?
- [ ] Check backend console for errors

### If frontend won't load API:
- [ ] Is backend server running?
- [ ] Is VITE_API_URL correct in .env.local?
- [ ] No CORS errors in console?
- [ ] Did you restart frontend server after changing .env?

### If port is already in use:
- [ ] Windows: `netstat -ano | findstr :5000`
- [ ] macOS/Linux: `lsof -i :5000`
- [ ] Kill process or change PORT in .env

### If npm install fails:
- [ ] Try: `npm cache clean --force`
- [ ] Delete node_modules: `rm -rf node_modules`
- [ ] Reinstall: `npm install`

## 📖 Documentation Review

- [ ] Read README.md (5 minute overview)
- [ ] Reviewed SETUP_GUIDE.md (detailed steps)
- [ ] Bookmarked QUICK_REFERENCE.md (for commands)
- [ ] Know location of API docs (backend/README.md)
- [ ] Know location of frontend docs (frontend/README.md)

## 🚀 Production Deployment (Optional)

### Backend Deployment
- [ ] Choose hosting (Heroku, Railway, AWS, etc.)
- [ ] Set all environment variables
- [ ] Ensure MongoDB is on production server
- [ ] Update database connection string
- [ ] Change JWT_SECRET to production-grade
- [ ] Set NODE_ENV=production
- [ ] Deploy backend code
- [ ] Verify backend working on production URL

### Frontend Deployment
- [ ] Build frontend: `cd frontend && npm run build`
- [ ] Deploy dist/ folder to hosting (Vercel, Netlify, etc.)
- [ ] Update VITE_API_URL to production backend URL
- [ ] Verify frontend connects to production backend

### Post-Deployment
- [ ] Test login on production
- [ ] Create test user account
- [ ] Test file upload (if applicable)
- [ ] Monitor for errors
- [ ] Set up backups

## ✅ Final Verification Checklist

- [ ] Both servers running without errors
- [ ] Can login with demo credentials
- [ ] Dashboard displays correctly
- [ ] Navigation works for user role
- [ ] No console errors (F12 to check)
- [ ] No network errors
- [ ] API calls successful (Network tab)
- [ ] Database connections working
- [ ] File upload ready for testing
- [ ] All documentation reviewed
- [ ] Environment properly configured
- [ ] Ready for use/deployment

## 📝 Notes

Use this space to record any issues or customizations:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

## 🎉 Ready to Go!

If all checkboxes are checked, your setup is complete!

**Next Steps:**
1. Test all features thoroughly
2. Create real user accounts
3. Upload and test files
4. Review analytics
5. Customize as needed
6. Deploy to production (when ready)

---

**Save this checklist for future reference or when setting up on another machine.**

For help: See [INDEX.md](./INDEX.md) for documentation navigation
