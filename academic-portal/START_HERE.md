# 👋 START HERE!

Welcome to your **Department Academic Portal** MERN application!

This is your quick start guide. Follow these simple steps and you'll be running the app in **5 minutes**.

---

## ⚡ The Fastest Path (5 Minutes)

### Step 1: Run Automatic Setup (30 seconds)

**Windows:** 
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Wait for it to complete. You'll see "✅ Setup Complete!"

### Step 2: Start MongoDB (1 minute)

**If using local MongoDB:**

**Windows:** Open Terminal and run:
```bash
mongod
```

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

*Skip this if using MongoDB Atlas (cloud)*

### Step 3: Start Backend Server (30 seconds)

Open **new terminal** and run:
```bash
cd backend
npm run dev
```

You should see: `🚀 Server running on port 5000`

### Step 4: Start Frontend Server (30 seconds)

Open **another new terminal** and run:
```bash
cd frontend
npm run dev
```

You should see something like: `Local: http://localhost:5173`

### Step 5: Login! (1 minute)

1. Open your browser
2. Go to: **http://localhost:5173**
3. Login with:
   - **Email:** `student@gmail.com`
   - **Password:** `password123`
4. 🎉 You're in! Explore the app

---

## ❓ Got an Error?

**"MongoDB connection failed"**
- Make sure MongoDB is running (see Step 2)
- Check `backend/.env` has correct connection string

**"Port 5000 already in use"**
- Kill other process on that port
- Or change PORT in `backend/.env`

**"Can't reach http://localhost:5173"**
- Check frontend server is running
- Try http://localhost:3000 instead

**Still stuck?** → Read [QUICK_REFERENCE.md - Troubleshooting](./QUICK_REFERENCE.md#-troubleshooting)

---

## 📚 What You Have

✅ **Complete Backend**
- Express.js server
- MongoDB database
- 30+ API endpoints
- JWT authentication

✅ **Beautiful Frontend**
- React.js with Tailwind CSS
- 10+ pages
- Responsive design
- Dark mode ready

✅ **Full Documentation**
- Setup guide
- API docs
- Feature list
- Troubleshooting

---

## 🎯 Next: Explore the App

### As a **Student**
- Click "Browse Files" to see available materials
- Search and filter by type
- Download files
- Rate and bookmark favorites

### As **Faculty** (Create One)
- Go to "Upload" to submit course materials
- Track your uploads in "My Uploads"
- See approval status

### As **Admin** (Advanced)
- Check "Pending Approvals" to review files
- Manage subjects in "Subjects Manager"
- View analytics dashboard

---

## 📖 Full Documentation

Ready to dive deeper? Check these files:

| File | Purpose | Time |
|------|---------|------|
| [README.md](./README.md) | Project overview | 5 min |
| [DELIVERY_SUMMARY.md](./DELIVERY_SUMMARY.md) | What you got | 5 min |
| [SETUP_GUIDE.md](./SETUP_GUIDE.md) | Detailed setup | 15 min |
| [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) | Commands & tips | As needed |
| [FEATURES.md](./FEATURES.md) | All capabilities | 10 min |

---

## 🆘 Common Issues

**I can't login**
- Did you create the account first?
- Try demo credentials: `student@gmail.com` / `password123`

**I don't see any files**
- Files need to be uploaded by faculty
- Use demo account to test
- Check backend console for errors

**Something is broken**
- Make sure both servers are running
- Check browser console (F12)
- Read QUICK_REFERENCE.md

---

## 🚀 Production Deployment (Later)

Once you're comfortable, deploy to the cloud:

1. Deploy backend to Heroku, Railway, or AWS
2. Deploy frontend to Vercel, Netlify, or similar
3. Update `.env` files with production URLs
4. Set up production MongoDB

**Guide:** [SETUP_GUIDE.md - Deployment](./SETUP_GUIDE.md#-deployment-guide)

---

## ✅ Checklist Before You Start

- [ ] Node.js installed? (`node --version`)
- [ ] MongoDB installed or Atlas account? 
- [ ] 500MB disk space available?
- [ ] Both terminals open ready to run servers?

---

## 🎓 Demo Credentials

```
Student Account:
  Email: student@gmail.com
  Password: password123
```

This account pre-exists for quick testing.

---

## 🆓 What's Included?

✨ Complete MERN application (3 months of dev work!)
- Full backend with APIs
- Beautiful responsive frontend
- Professional documentation
- Security best practices
- Production-ready code

---

## 💡 Pro Tips

1. **Keep 3 terminals open:** MongoDB, Backend, Frontend
2. **Use DevTools (F12)** to see what's happening
3. **Check console** if something breaks
4. **Read QUICK_REFERENCE.md** for common commands
5. **Bookmark SETUP_GUIDE.md** for later reference

---

## 🎉 Let's Get Started!

Ready? Run this now:

**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
bash setup.sh
```

Then follow the 5 steps above.

**Questions?** Check [INDEX.md](./INDEX.md) for navigation to all docs.

---

**Happy coding! 🚀**

Once you're done: [Next Page Tutorial](./README.md)
