import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { corsOptions } from './security/corsConfig';
import { apiLimiter, authLimiter } from './security/rateLimiter';
import { errorHandler } from './middleware/errorMiddleware';

import authRoutes from './routes/authRoutes';
import roomRoutes from './routes/roomRoutes';
import banquetRoutes from './routes/banquetRoutes';
import bookingRoutes from './routes/bookingRoutes';
import reviewRoutes from './routes/reviewRoutes';
import userRoutes from './routes/userRoutes';
import galleryRoutes from './routes/galleryRoutes';
import eventRoutes from './routes/eventRoutes';
import roomRequestRoutes from './routes/roomRequestRoutes';
// PMS Enhancement Routes
import dashboardRoutes from './routes/dashboardRoutes';
import activityLogRoutes from './routes/activityLogRoutes';
import otpRoutes from './routes/otpRoutes';
import searchRoutes from './routes/searchRoutes';

const app = express();

// Security Middleware
// app.use(helmet() as any);
app.use(cors(corsOptions) as any);
// app.use(mongoSanitize() as any);
// app.use(hpp() as any);

// Body Parsers
app.use(express.json({ limit: '10mb' }) as any);
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use('/uploads', express.static('uploads'));

// Rate Limiting
// app.use('/api/', apiLimiter as any);
// app.use('/api/auth', authLimiter as any);

// Existing API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/banquets', banquetRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/room-requests', roomRequestRoutes);

// PMS Enhancement Routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/search', searchRoutes);

// Default Route
app.get('/', (req, res) => {
  res.send('API is running... created by bugbros');
});

// Error Middleware
app.use(errorHandler);

export default app;
