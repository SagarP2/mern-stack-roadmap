# 🚀 Blog Admin Panel

A complete, production-ready admin panel for MERN Blog Management System built with React, Tailwind CSS, and modern UI/UX practices.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control
- Auto logout on token expiry
- Secure API communication

### 📊 Dashboard & Analytics
- Real-time statistics
- Interactive charts (Recharts)
- Activity monitoring
- Performance metrics

### 📝 Blog Management
- Rich text editor (React Quill)
- CRUD operations
- Search and filtering
- Status management
- Word count and reading time

### 👥 User Management
- User roles (Admin/User)
- Account management
- Activity tracking
- Bulk operations

### 💬 Feedback System
- User feedback management
- Rating system
- Status tracking
- Response management

### 📋 Activity Logs
- Comprehensive logging
- Action tracking
- User activity monitoring
- Filterable logs

### ⚙️ Settings
- Profile management
- Password change
- Notification preferences
- Theme customization

### 🎨 UI/UX Features
- Dark/Light mode toggle
- Fully responsive design
- Smooth animations (Framer Motion)
- Toast notifications
- Loading states
- Modern design system

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **Recharts** - Chart library
- **React Quill** - Rich text editor
- **Framer Motion** - Animation library
- **React Hot Toast** - Notification system
- **Lucide React** - Icon library

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Backend API running on port 5000

### Installation

1. **Clone and navigate to admin directory**
   ```bash
   cd frontend/admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3001/admin/login
   ```

### Default Admin Credentials
```
Email: admin@example.com
Password: admin123
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Topbar.jsx      # Top navigation bar
│   ├── StatsCard.jsx   # Statistics display card
│   ├── Table.jsx       # Data table with pagination
│   ├── Modal.jsx       # Modal dialogs
│   ├── Chart.jsx       # Chart components
│   └── Loader.jsx      # Loading components
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── BlogManagement.jsx    # Blog CRUD
│   ├── BlogEditor.jsx        # Rich text editor
│   ├── UserManagement.jsx    # User management
│   ├── Feedback.jsx          # Feedback system
│   ├── ActivityLogs.jsx      # Activity monitoring
│   └── Settings.jsx          # Admin settings
├── context/            # React Context providers
│   ├── AdminAuthContext.jsx  # Authentication state
│   └── AdminDataContext.jsx  # Application data state
├── routes/             # Route protection
│   └── AdminProtectedRoute.jsx
├── utils/              # Utility functions
│   └── axiosInstance.js      # API configuration
├── App.jsx             # Main application component
├── main.jsx           # Application entry point
└── index.css          # Global styles and Tailwind
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the admin directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Blog Admin Panel
```

### API Endpoints
The admin panel expects these backend endpoints:

```
Authentication:
POST /api/auth/login
GET  /api/auth/me

Admin Operations:
GET  /api/admin/stats/dashboard
GET  /api/admin/posts
POST /api/admin/posts
PUT  /api/admin/posts/:id
DELETE /api/admin/posts/:id
GET  /api/admin/users
PUT  /api/admin/users/:id/role
DELETE /api/admin/users/:id
GET  /api/admin/feedback
DELETE /api/admin/feedback/:id
GET  /api/admin/activity
```

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom primary colors
      }
    }
  }
}
```

### Components
All components are modular and can be easily customized:

- **Sidebar**: Modify navigation items in `components/Sidebar.jsx`
- **Dashboard**: Add/remove widgets in `pages/Dashboard.jsx`
- **Tables**: Customize columns in respective management pages

## 📱 Responsive Design

The admin panel is fully responsive with breakpoints:

- **Mobile**: < 768px (Collapsible sidebar, touch-friendly)
- **Tablet**: 768px - 1024px (Optimized layout)
- **Desktop**: > 1024px (Full feature set)

## 🔒 Security Features

- JWT token management
- Automatic token refresh
- Role-based route protection
- XSS protection
- CSRF protection via SameSite cookies

## 🚀 Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Performance

- Code splitting with React.lazy()
- Optimized bundle size
- Efficient re-rendering
- Lazy loading of components
- Image optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ for modern web development**
