const mysql = require('mysql2');

// Test database connection
const testConnection = () => {
  console.log('🧪 Testing database connection...');
  
  const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'notes_app'
  });

  db.connect(err => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
      console.error('Please check your database configuration:');
      console.error('- Ensure MySQL is running');
      console.error('- Check database credentials');
      console.error('- Verify database exists');
      return;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test if tables exist
    db.query('SHOW TABLES', (err, results) => {
      if (err) {
        console.error('❌ Error checking tables:', err.message);
      } else {
        console.log('📋 Available tables:', results.map(row => Object.values(row)[0]));
        
        // Check if users table exists
        const hasUsersTable = results.some(row => Object.values(row)[0] === 'users');
        const hasNotesTable = results.some(row => Object.values(row)[0] === 'notes');
        
        if (!hasUsersTable) {
          console.log('⚠️  Users table not found. Please run the SQL setup script.');
        }
        
        if (!hasNotesTable) {
          console.log('⚠️  Notes table not found. Please run the SQL setup script.');
        }
        
        if (hasUsersTable && hasNotesTable) {
          console.log('✅ All required tables found!');
        }
      }
      
      db.end();
    });
  });
};

// Test environment variables
const testEnvironment = () => {
  console.log('🔧 Environment variables:');
  console.log('- DB_HOST:', process.env.DB_HOST || 'localhost (default)');
  console.log('- DB_USER:', process.env.DB_USER || 'root (default)');
  console.log('- DB_PASSWORD:', process.env.DB_PASSWORD ? '***set***' : 'empty (default)');
  console.log('- DB_NAME:', process.env.DB_NAME || 'notes_app (default)');
  console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '***set***' : 'default (change in production)');
};

// Run tests
console.log('🚀 Backend Connection Test');
console.log('==========================');
testEnvironment();
console.log('');
testConnection();
