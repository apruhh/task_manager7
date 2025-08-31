# 🔧 Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. **CORS Errors**
**Symptoms:** Browser console shows CORS policy errors
**Solution:** 
- Ensure backend is running on port 5000
- Check that CORS is properly configured in `server.js`
- Verify frontend is running on `http://localhost:3000`

### 2. **Database Connection Issues**
**Symptoms:** Backend shows "Error connecting to database"
**Solution:**
- Ensure MySQL is running
- Check database credentials in `.env` file
- Verify database `notes_app` exists
- Run the test script: `node test-connection.js`

### 3. **Frontend Can't Connect to Backend**
**Symptoms:** "No response from server" errors
**Solution:**
- Check if backend server is running: `npm start` in backend directory
- Verify backend is on port 5000
- Check console for backend startup messages
- Test health endpoint: `http://localhost:5000/health`

### 4. **Authentication Failures**
**Symptoms:** Login/signup returns 401/403 errors
**Solution:**
- Check JWT_SECRET in `.env` file
- Verify database tables exist (`users` and `notes`)
- Check backend console for detailed error logs

## 🧪 Testing Steps

### Step 1: Test Backend Connection
```bash
cd backend
node test-connection.js
```

### Step 2: Test Backend Health
```bash
curl http://localhost:5000/health
```

### Step 3: Test Frontend API
Open browser console and run:
```javascript
fetch('http://localhost:5000/health')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## 📋 Required Setup Checklist

- [ ] MySQL server running
- [ ] Database `notes_app` created
- [ ] Tables `users` and `notes` exist
- [ ] Backend `.env` file configured
- [ ] Backend server running on port 5000
- [ ] Frontend running on port 3000
- [ ] CORS properly configured
- [ ] All dependencies installed

## 🗄️ Database Setup Commands

```sql
-- Create database
CREATE DATABASE notes_app;
USE notes_app;

-- Create users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notes table
CREATE TABLE notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## 🔍 Debug Mode

Enable detailed logging by checking:
- Backend console for request logs
- Frontend browser console for API calls
- Network tab in browser dev tools
- Backend error logs

## 📞 Getting Help

If issues persist:
1. Check all console logs (backend + frontend)
2. Verify database connection
3. Test endpoints individually
4. Check network connectivity
5. Review error messages carefully
