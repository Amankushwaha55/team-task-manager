const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Base Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health Check Endpoint
app.get('/', (req, res) => res.send('API Running smoothly 🚀'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server started on port ${PORT}`));