# Notes App Frontend with Authentication

A React-based frontend for the Notes application with complete user authentication, protected routes, and JWT token management.

## 🚀 Features

- **User Authentication**: Signup and login functionality
- **Protected Routes**: JWT-based route protection
- **State Management**: Centralized authentication state
- **API Integration**: Secure API calls with authentication headers
- **Responsive Design**: Modern, mobile-friendly UI
- **Auto-logout**: Automatic logout on token expiration

## 🏗️ Project Structure

```
frontend/src/
├── components/
│   ├── LoginForm.js          # User login component
│   ├── SignupForm.js         # User registration component
│   ├── ProtectedRoute.js     # Route protection component
│   ├── NotesPage.js          # Main notes page (protected)
│   ├── NoteForm.js           # Note creation/editing form
│   ├── NoteList.js           # Notes display component
│   ├── AuthForms.css         # Authentication form styles
│   └── NotesPage.css         # Notes page styles
├── utils/
│   └── api.js                # API configuration and utilities
├── App.js                    # Main app with routing
└── App.css                   # App-wide styles
```

## 🔐 Authentication Flow

1. **User Registration** (`/signup`)
   - Username and password validation
   - Password confirmation
   - Redirects to login after successful signup

2. **User Login** (`/login`)
   - Credentials validation
   - JWT token storage in localStorage
   - Automatic redirect to main notes page

3. **Protected Routes**
   - All notes functionality requires valid JWT
   - Automatic redirect to login if token is missing/invalid
   - Token expiration handling

4. **Logout**
   - Clears authentication data
   - Redirects to login page

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on `http://localhost:5000`

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Available Routes

- **`/`** - Main notes page (protected, requires login)
- **`/login`** - User login page
- **`/signup`** - User registration page
- **`*`** - Catch-all route (redirects based on auth status)

## 🔧 API Integration

### Authentication Endpoints
- `POST /api/login` - User login
- `POST /api/signup` - User registration
- `GET /api/profile` - Get user profile (protected)

### Notes Endpoints (All Protected)
- `GET /notes` - Fetch user's notes
- `POST /notes` - Create new note
- `PUT /notes/:id` - Update existing note
- `DELETE /notes/:id` - Delete note

### API Headers
All protected endpoints automatically include:
```
Authorization: Bearer <jwt_token>
```

## 🎨 UI Components

### LoginForm
- Username and password inputs
- Form validation
- Error handling
- Loading states
- Link to signup page

### SignupForm
- Username, password, and confirm password
- Password validation (minimum 6 characters)
- Password confirmation matching
- Form validation
- Link to login page

### NotesPage
- Protected main page
- User welcome message
- Logout button
- Notes management interface

### ProtectedRoute
- JWT token validation
- Automatic redirect to login if unauthorized
- Seamless user experience

## 🔒 Security Features

- **JWT Token Storage**: Secure localStorage usage
- **Route Protection**: Automatic authentication checks
- **Token Expiration**: Automatic logout on expired tokens
- **Input Validation**: Client-side form validation
- **Error Handling**: Graceful error management
- **Auto-redirect**: Seamless authentication flow

## 🚀 Usage Examples

### Creating a New User
1. Navigate to `/signup`
2. Enter username and password
3. Confirm password
4. Submit form
5. Redirected to login page

### Logging In
1. Navigate to `/login`
2. Enter credentials
3. Submit form
4. Automatically redirected to main notes page

### Accessing Protected Routes
- All notes functionality is automatically protected
- JWT token is automatically included in API calls
- Unauthorized access redirects to login

### Logging Out
- Click logout button in header
- Authentication data is cleared
- Redirected to login page

## 🎯 Key Features

- **Responsive Design**: Works on all device sizes
- **Modern UI**: Clean, professional appearance
- **Error Handling**: Comprehensive error management
- **Loading States**: User feedback during operations
- **Auto-redirect**: Seamless navigation flow
- **Token Management**: Automatic JWT handling

## 🔧 Customization

### Styling
- Modify `AuthForms.css` for authentication styling
- Modify `NotesPage.css` for main page styling
- Update `App.css` for app-wide styles

### API Configuration
- Update `utils/api.js` for different backend URLs
- Modify authentication headers if needed
- Add new API endpoints as required

### Routing
- Update `App.js` for new routes
- Modify `ProtectedRoute.js` for custom protection logic
- Add new protected components as needed

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has CORS enabled
   - Check API base URL in `utils/api.js`

2. **Authentication Errors**
   - Verify JWT secret in backend
   - Check token expiration settings
   - Ensure proper Authorization headers

3. **Routing Issues**
   - Verify react-router-dom installation
   - Check route definitions in App.js
   - Ensure proper component imports

4. **API Connection Issues**
   - Verify backend server is running
   - Check API endpoints in backend
   - Verify database connection

## 📚 Dependencies

- **react**: ^19.1.0
- **react-dom**: ^19.1.0
- **react-router-dom**: ^6.x.x
- **axios**: ^1.9.0

## 🤝 Contributing

1. Follow the existing code structure
2. Maintain authentication security
3. Test all authentication flows
4. Ensure responsive design
5. Update documentation as needed

## 📄 License

This project is part of the Notes application with authentication system.
