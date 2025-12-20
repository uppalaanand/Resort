import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import { errorHandler } from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import banquetRoutes from './routes/banquetRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();
connectDB();

const app = express();

app.use(cors() as any);
app.use(express.json() as any);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/banquets', banquetRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});