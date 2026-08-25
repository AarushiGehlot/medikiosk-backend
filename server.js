const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const patientRoutes = require('./routes/patientRoutes');
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.json({
        status: 'Success',
        message: 'MediKiosk Backend is Running! 🚀',
        database: 'MongoDB Connected'
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Success',
        message: 'MediKiosk Backend Running Smoothly!'
    });
});

// API routes
app.use('/api/patients', patientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});