import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';

dotenv.config();

// Initialize Express and HTTP server
const app = express();
const server = http.createServer(app);

// Set up __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Change this to match your frontend port
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

// Make io accessible in controllers via app.get('io')
app.set('io', io);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tickets', ticketRoutes);

// Fallback route (optional)
app.get('/', (req, res) => {
  res.send('Bug Tracker API is running...');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to MongoDB:', error);
    process.exit(1);
  });
