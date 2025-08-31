# Authentication Setup Guide

## Prerequisites
- Node.js and npm installed
- MySQL database running
- Dependencies installed: `npm install bcrypt jsonwebtoken`

## Database Setup

1. **Create the database and tables** using the SQL commands in `MySQL/Notes table`

2. **Set up environment variables** by creating a `.env` file in the backend directory:

```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=notes_app

# JWT Configuration (change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

## API Endpoints

### Authentication (No token required)
- `POST /api/signup` - Register a new user
  - Body: `{ "username": "user123", "password": "password123" }`
  - Returns: `{ "message": "User created successfully", "userId": 1 }`

- `POST /api/login` - Login user
  - Body: `{ "username": "user123", "password": "password123" }`
  - Returns: `{ "message": "Login successful", "token": "jwt_token_here", "user": {...} }`

- `GET /api/profile` - Get user profile (requires token)
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ "message": "Profile accessed successfully", "user": {...} }`

### Notes (All require authentication)
- `GET /notes` - Get all notes for authenticated user
- `POST /notes` - Create a new note
- `PUT /notes/:id` - Update a note
- `DELETE /notes/:id` - Delete a note

## Usage

1. **Start the server**: `npm start`
2. **Register a user** using the signup endpoint
3. **Login** to get a JWT token
4. **Include the token** in the Authorization header for all notes requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Security Features

- Passwords are hashed using bcrypt with salt rounds of 10
- JWT tokens expire after 24 hours
- All notes routes are protected and require authentication
- Users can only access their own notes
- Input validation for username and password
- SQL injection protection using parameterized queries

## Testing the API

You can test the endpoints using tools like:
- Postman
- cURL
- Thunder Client (VS Code extension)
- Your frontend application

## Production Considerations

1. **Change the JWT_SECRET** to a strong, unique value
2. **Use HTTPS** in production
3. **Set appropriate CORS origins**
4. **Implement rate limiting**
5. **Add logging and monitoring**
6. **Use environment-specific database configurations**
