import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    message: 'ONE CHICAGO RP Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'operational',
    message: 'ONE CHICAGO RP Server is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`[Socket.IO] User connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] User disconnected: ${socket.id}`);
  });

  socket.on('message', (data) => {
    console.log(`[Socket.IO] Message from ${socket.id}:`, data);
    io.emit('message', { from: socket.id, data });
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  });
});

server.listen(PORT, () => {
  console.log(`\n🚨 ONE CHICAGO RP Server 🚨`);
  console.log(`📍 Running on http://${HOST}:${PORT}`);
  console.log(`🔗 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Ready to accept connections\n`);
});

export { app, io, server };
