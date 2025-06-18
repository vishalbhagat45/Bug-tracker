import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();
const app = express();

// ✅ Middleware
app.use(cors({
  origin: 'http://localhost:3000',  // frontend URL
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads')); // if file uploads used
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads')));


// ✅ API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// ✅ Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
});
