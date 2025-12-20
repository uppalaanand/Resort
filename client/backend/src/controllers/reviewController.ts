
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review';
import Booking from '../models/Booking';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';

interface AuthRequest extends Request {
  user?: any;
  body: any;
}

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { targetType, targetId, ratingStars, comment, photos } = req.body;

  // 1. Check if user has a COMPLETED booking for this item
  const query: any = {
    user: req.user._id,
    status: 'Completed',
  };

  if (targetType === 'room') query.room = targetId;
  else query.banquetHall = targetId;

  const booking = await Booking.findOne(query);

  if (!booking && req.user.role !== 'admin') {
     // Allow admins to test, but normally block
     (res as any).status(400);
     throw new Error('You can only review items you have completed a booking for.');
  }

  // 2. Create Review
  const review = await Review.create({
    user: req.user._id,
    targetType,
    room: targetType === 'room' ? targetId : undefined,
    banquetHall: targetType === 'banquet' ? targetId : undefined,
    ratingStars,
    comment,
    photos,
    verifiedStay: true
  });

  // 3. Update Average Rating on Target
  // simplified average calc
  const reviews = await Review.find({ 
    targetType, 
    [targetType === 'room' ? 'room' : 'banquetHall']: targetId 
  });
  
  const avgRating = reviews.reduce((acc, item) => acc + item.ratingStars, 0) / reviews.length;

  if (targetType === 'room') {
    await Room.findByIdAndUpdate(targetId, { 
      averageRating: avgRating, 
      reviewCount: reviews.length 
    });
  } else {
    await BanquetHall.findByIdAndUpdate(targetId, { 
      averageRating: avgRating, 
      reviewCount: reviews.length 
    });
  }

  (res as any).status(201).json(review);
});

// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
export const getRoomReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ room: (req as any).params.roomId }).populate('user', 'name');
  (res as any).json(reviews);
});

// @desc    Get reviews for a banquet
// @route   GET /api/reviews/banquet/:banquetId
// @access  Public
export const getBanquetReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await Review.find({ banquetHall: (req as any).params.banquetId }).populate('user', 'name');
  (res as any).json(reviews);
});
