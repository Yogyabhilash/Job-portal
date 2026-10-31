const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup view engine for Admin SSR Panel
app.set('views', path.join(__dirname, '../admin/views'));
app.set('view engine', 'ejs');

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./routes/savedJobRoutes'));
app.use('/admin', require('./routes/adminRoutes'));

// Redirect root URL to client or admin login
app.get('/', (req, res) => {
  res.send('Job Portal Backend API is running. Access Admin Panel at /admin/login');
});

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof require('multer').MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
});

// Serve static assets if needed, but not strictly necessary since CSS is inline
// app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  console.log(`Admin Panel available at: http://localhost:${PORT}/admin/login`);
});
