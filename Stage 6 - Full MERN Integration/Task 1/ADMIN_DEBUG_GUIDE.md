# 🔧 Admin Panel Debug Guide

## 🚨 Issue: Admin Panel Not Displaying

If your admin panel is not displaying anything, follow these steps to debug:

## ✅ **Step 1: Check if Backend is Running**

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Verify backend is working:**
   - Visit: http://localhost:5000/api/health
   - Should show: `{"message": "Server is running", "timestamp": "..."}`

## ✅ **Step 2: Start Admin Panel**

1. **Navigate to admin directory:**
   ```bash
   cd frontend/admin
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start the admin panel:**
   ```bash
   npm run dev
   ```

4. **Check the console output:**
   - Should show: `Local: http://localhost:3001/` (or similar port)
   - Look for any error messages

## ✅ **Step 3: Test Basic Functionality**

1. **Visit test route:**
   - Go to: http://localhost:3001/test
   - You should see: "Admin Panel Test" message

2. **Check browser console:**
   - Press F12 to open developer tools
   - Look for any JavaScript errors in the Console tab

3. **Check network requests:**
   - Go to Network tab in developer tools
   - Look for failed API requests

## ✅ **Step 4: Try Login**

1. **Go to login page:**
   - Visit: http://localhost:3001/admin/login

2. **Use default admin credentials:**
   ```
   Email: admin@example.com
   Password: admin123
   ```

3. **Check what happens:**
   - Does the login form appear?
   - Any console errors?
   - Does login attempt work?

## 🔍 **Common Issues & Solutions**

### **Issue 1: White/Blank Screen**
- **Cause**: JavaScript errors preventing React from rendering
- **Solution**: Check browser console for errors

### **Issue 2: "Cannot connect to server"**
- **Cause**: Backend not running or wrong API URL
- **Solution**: 
  - Start backend server
  - Check `.env` file has correct API URL

### **Issue 3: Login page shows but login fails**
- **Cause**: No admin user in database
- **Solution**: Create admin user manually:
  ```bash
  cd backend
  node -e "
  const User = require('./models/User.js');
  const mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost:27017/mern-blog');
  User.create({
    name: 'Admin User',
    email: 'admin@example.com', 
    password: 'admin123',
    role: 'admin'
  }).then(() => console.log('Admin created')).catch(console.error);
  "
  ```

### **Issue 4: Styles not loading**
- **Cause**: Tailwind CSS not compiled
- **Solution**: Restart the dev server

## 📋 **Debug Checklist**

- [ ] Backend server running on port 5000
- [ ] Admin panel running on port 3001
- [ ] No JavaScript errors in browser console
- [ ] Test route (/test) shows content
- [ ] Login page loads without errors
- [ ] Admin user exists in database
- [ ] API requests are reaching backend

## 🛠️ **Quick Fixes**

### **Reset Everything:**
```bash
# Stop all servers
# Then restart:

# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Admin Panel  
cd frontend/admin
npm run dev
```

### **Clear Browser Cache:**
- Press Ctrl+Shift+R (hard refresh)
- Or clear browser cache completely

### **Check Environment:**
- Ensure `.env` file exists in `frontend/admin/`
- Contains: `VITE_API_URL=http://localhost:5000/api`

## 📞 **Still Not Working?**

If the admin panel still doesn't display:

1. **Check the exact error message** in browser console
2. **Verify all files exist** in the admin directory
3. **Try the test route** first: http://localhost:3001/test
4. **Check if other routes work**: http://localhost:3001/admin/login

The admin panel should now display properly! 🎉
