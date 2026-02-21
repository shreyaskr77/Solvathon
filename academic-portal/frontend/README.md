# Academic Portal - Frontend

A beautiful React.js frontend for the Department Academic Portal MERN application.

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Frontend will run on `http://localhost:3000` or `http://localhost:5173` (Vite)

### Production Build

```bash
npm run build
```

Output files in `dist/` directory.

## ⚙️ Configuration

Create `.env.local` file (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

If not set, defaults to `http://localhost:5000/api`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout.jsx              # Main app layout with sidebar
│   │   ├── Sidebar.jsx             # Navigation sidebar component
│   │   ├── ProtectedRoute.jsx      # Route protection wrapper
│   │   └── ...
│   │
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   │
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   │
│   │   ├── Student/
│   │   │   ├── Browse.jsx          # Browse and search files
│   │   │   └── Bookmarks.jsx       # Bookmarked files
│   │   │
│   │   ├── Faculty/
│   │   │   ├── Upload.jsx          # Upload academic material
│   │   │   └── MyUploads.jsx       # Manage uploads
│   │   │
│   │   └── Admin/
│   │       ├── Approvals.jsx       # Review pending files
│   │       ├── Subjects.jsx        # Manage subjects
│   │       └── Analytics.jsx       # Dashboard & analytics
│   │
│   ├── services/
│   │   └── api.js                  # API client (Axios with interceptors)
│   │
│   ├── App.jsx                     # Router configuration
│   ├── index.js                    # React entry point
│   ├── index.css                   # Tailwind CSS setup
│   │
│   ├── public/
│   │   ├── index.html
│   │   └── robots.txt
│   │
│   └── .env.local
│
├── tailwind.config.js              # Tailwind CSS config
├── package.json
└── README.md
```

## 🎨 Key Components

### Layout.jsx
Main layout container with sidebar and header. Wraps all protected routes.

### Sidebar.jsx
Navigation component showing:
- User profile with role badge
- Role-specific navigation links
- Logout button
- Responsive mobile menu

### ProtectedRoute.jsx
HOC that:
- Checks authentication status
- Verifies user role
- Redirects to login if unauthorized
- Shows loading state

### AuthContext.jsx
Manages:
- User authentication state
- Login/register functions
- Token storage
- Auto-login on page refresh

## 📚 Pages Overview

### Public Pages
- **Login** - Email/password authentication
- **Register** - Student registration form

### Dashboard
- Welcome message with user info
- Quick stats (downloads, uploads, etc.)
- Quick action buttons
- Recent activity feed

### Student Pages
- **Browse Files** - Search, filter, download approved files
- **Bookmarks** - Manage saved files

### Faculty Pages
- **Upload** - Upload academic materials with metadata
- **My Uploads** - Track upload status and metrics

### Admin Pages
- **Pending Approvals** - Review and approve/reject files
- **Subject Management** - Create and edit subjects
- **Analytics** - Dashboard with charts and metrics

## 🔐 Authentication

### Login Flow
1. User enters email and password
2. Submit to `/api/auth/login`
3. API returns JWT token
4. Token stored in localStorage
5. Redirect to dashboard

### Token Management
Token automatically included in all API requests via Axios interceptor:
```javascript
Authorization: Bearer <token>
```

### Session Persistence
Token persists across page refreshes by storing in localStorage.

## 🎯 Features

### Student Features
- ✅ Search files by title
- ✅ Filter by type (Notes, Assignment, PYQ, Circular)
- ✅ Download approved files
- ✅ Rate files (1-5 stars)
- ✅ Bookmark files
- ✅ View stats and activity

### Faculty Features
- ✅ Drag-drop file upload
- ✅ Metadata (title, description, subject, tags)
- ✅ Track file approval status
- ✅ View download statistics
- ✅ Update file versions

### Admin Features
- ✅ View pending files
- ✅ Approve/reject with reasons
- ✅ Manage subjects and courses
- ✅ Analytics dashboard
- ✅ User and activity statistics

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Gradient Backgrounds** - Modern purple/indigo gradient
- **Icon-Rich** - Heroicons for visual clarity
- **Dark Mode Ready** - Toggle theme (implemented in Sidebar)
- **Smooth Animations** - CSS transitions and hover effects
- **Data Visualization** - Recharts for analytics
- **Form Validation** - Client-side validation on forms

## 🚀 API Client

### Usage

```javascript
import { authAPI, fileAPI, userAPI } from './services/api';

// Login
const response = await authAPI.login(email, password);

// Upload file
const formData = new FormData();
formData.append('file', file);
formData.append('title', title);
await fileAPI.uploadFile(formData);

// Get approved files
const files = await fileAPI.getApprovedFiles({search, fileType});

// Bookmark file
await userAPI.bookmarkFile({fileId});
```

## 📦 Dependencies

### Production
- `react` - UI library
- `react-dom` - React DOM render
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - Utility CSS
- `@heroicons/react` - Icon library
- `recharts` - Charts library

### Development
- `react-scripts` - Build tool
- `autoprefixer` - CSS processing
- `postcss` - CSS transformation

## 🎯 Routing

```javascript
/               → Redirect to /login
/login          → Public: Login page
/register       → Public: Registration page
/dashboard      → Protected: Main dashboard
/student/files  → Protected: Browse files
/student/bookmarks → Protected: Bookmarks
/faculty/upload → Protected: Upload form
/faculty/my-uploads → Protected: My uploads
/admin/approvals → Protected: Approvals
/admin/subjects  → Protected: Subject management
/admin/analytics → Protected: Analytics
```

## 🔒 Security

- JWT tokens stored in localStorage
- Token automatically included in requests
- Protected routes check authentication and role
- Unauthorized access redirects to login
- Sensitive data not stored in frontend

## ⚡ Performance

- Lazy loading of components
- Optimized Tailwind CSS build
- Minified production build
- Efficient re-rendering with React hooks
- Image optimization (if applicable)

## 🌐 Environment Variables

```env
# API Base URL (defaults to http://localhost:5000/api)
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel deploy --prod
```

### Netlify
```bash
npm run build
# Upload dist/ folder
```

### GitHub Pages
```bash
npm run build
# Deploy dist/ to gh-pages branch
```

## 🐛 Troubleshooting

### API Connection Failed
- Check backend is running on port 5000
- Verify `VITE_API_URL` environment variable
- Check CORS settings on backend
- Open DevTools console for error details

### Login Issues
- Verify credentials
- Check backend database has users
- Clear localStorage and try again

### File Upload Not Working
- Check file size (max 50MB)
- Verify file type allowed
- Ensure sufficient disk space
- Check browser console for errors

### Styling Issues
- Run `npm run build` to rebuild CSS
- Clear browser cache (Ctrl+Shift+Delete)
- Check tailwind.config.js

## 📚 Component Examples

### Using API Client
```javascript
import { fileAPI } from '../services/api';

const MyComponent = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const getFiles = async () => {
      try {
        const response = await fileAPI.getApprovedFiles();
        setFiles(response.data.files);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    getFiles();
  }, []);

  return <div>{/* render files */}</div>;
};
```

### Using Auth Context
```javascript
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 📝 Notes

- All API calls handled through `services/api.js`
- Authentication managed via AuthContext
- Routes protected with ProtectedRoute component
- Theme toggles available in Sidebar
- Responsive design using Tailwind CSS

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Heroicons](https://heroicons.com)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

---

**Happy Coding! 🎨**
