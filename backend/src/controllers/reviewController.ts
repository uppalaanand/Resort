import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/Review';
import Booking from '../models/Booking';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';
import { deleteMultipleCache, getCache, setCache } from '../utils/cache';

interface AuthRequest extends Request {
  user?: any;
  body: any;
}

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  // 1. Handle uploaded photos
  const files = req.files as Express.Multer.File[]; // multer files
  const photos = files ? files.map(file => file.path) : [];
  // 2. Validate input
  const { targetType, targetId, ratingStars, comment } = req.body;

  // 2. Check if user has a COMPLETED booking for this item
  const query: any = {
    user: req.user._id,
    status: 'Completed',
  };

  if (targetType === 'room') query.room = targetId;
  else query.banquetHall = targetId;

  const booking = await Booking.findOne(query);

  if (!booking && req.user.role !== 'admin') {
    (res as any).status(400);
    throw new Error('You can only review items you have completed a booking for.');
  }

  // 3. Create Review
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

  // 4. Update Average Rating on Target
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
  // 5. Invalidate relevant caches
  await deleteMultipleCache([
    `reviews:room:${targetId}`,
    `reviews:banquet:${targetId}`,
    "reviews:all"
  ]);
  (res as any).status(201).json(review);
});


//Before Caching
// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
// export const getRoomReviews = asyncHandler(async (req: Request, res: Response) => {
//   const reviews = await Review.find({ room: (req as any).params.roomId }).populate('user', 'name');
//   (res as any).json(reviews);
// });


//After Caching
// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
export const getRoomReviews = asyncHandler(async (req: Request, res: Response) => {
  // Create a cache key specific to this room's reviews
  const roomId = req.params.roomId;
  const cacheKey = `reviews:room:${roomId}`;
  // Try to get reviews from cache
  const cachedReviews = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedReviews) {
    // console.log(`Serving reviews for room ${roomId} from Redis`);
    return (res as any).status(200).json(cachedReviews);
  }
  // If not in cache, fetch from DB
  const reviews = await Review.find({ room: (req as any).params.roomId }).populate('user', 'name');
  // Store in cache for future requests for 1 hour (3600 seconds)
  await setCache(cacheKey, reviews, 3600);
  // console.log(`Serving reviews for room ${roomId} from MongoDB`);
  // Return the response
  (res as any).json(reviews);
});


//Before Caching
// @desc    Get reviews for a banquet
// @route   GET /api/reviews/banquet/:banquetId
// @access  Public
// export const getBanquetReviews = asyncHandler(async (req: Request, res: Response) => {
//   const reviews = await Review.find({ banquetHall: (req as any).params.banquetId }).populate('user', 'name');
//   (res as any).json(reviews);
// });


//After Caching
// @desc    Get reviews for a banquet
// @route   GET /api/reviews/banquet/:banquetId
// @access  Public
export const getBanquetReviews = asyncHandler(async (req: Request, res: Response) => {
  // Create a cache key specific to this banquet's reviews
  const banquetId = req.params.banquetId;
  const cacheKey = `reviews:banquet:${banquetId}`;
  // Try to get reviews from cache
  const cachedReviews = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedReviews) {
    // console.log(`Serving reviews for banquet ${banquetId} from Redis`);
    return (res as any).status(200).json(cachedReviews);
  }
  // If not in cache, fetch from DB
  const reviews = await Review.find({ banquetHall: (req as any).params.banquetId }).populate('user', 'name');
  // Store in cache for future requests for 1 hour (3600 seconds)
  await setCache(cacheKey, reviews, 3600);
  // console.log(`Serving reviews for banquet ${banquetId} from MongoDB`);
  // Return the response
  (res as any).json(reviews);
});

//Before Caching
// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Admin
// export const getAllReviews = asyncHandler(async (_req, res) => {
//   const reviews = await Review.find()
//     .populate("user", "name")
//     .populate("room", "name")
//     .populate("banquetHall", "name")
//     .sort({ createdAt: -1 });

//   res.json(reviews);
// });


//After Caching
// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Admin
export const getAllReviews = asyncHandler(async (_req, res) => {
  // Create a cache key for all reviews
  const cacheKey = "reviews:all";
  // Try to get reviews from cache
  const cachedData = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedData) {
    // console.log("Serving all reviews from Redis");
    return (res as any).json(cachedData);
  }
  // If not in cache, fetch from DB
  const reviews = await Review.find()
    .populate("user", "name")
    .populate("room", "name")
    .populate("banquetHall", "name")
    .sort({ createdAt: -1 });
  // Store in cache for future requests for 1 hour (3600 seconds)
  await setCache(cacheKey, reviews, 3600);
  // console.log("Serving all reviews from MongoDB");
  // Return the response
  res.json(reviews);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private
export const deleteReview = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Get review ID from params
  const { reviewId } = req.params;
  // 1. Find review
  const review = await Review.findById(reviewId);
  // 2. Check if review exists and if user is authorized to delete
  if (!review) {
    (res as any).status(404);
    throw new Error('Review not found');
  }
  const targetType = review.targetType;
  const targetId =
    targetType === 'room' ? review.room : review.banquetHall;

  // 3. Delete review
  await review.deleteOne();

  // 4. Recalculate ratings
  const remainingReviews = await Review.find({
    targetType,
    [targetType === 'room' ? 'room' : 'banquetHall']: targetId,
  });

  const reviewCount = remainingReviews.length;
  const avgRating =
    reviewCount > 0
      ? remainingReviews.reduce((acc, r) => acc + r.ratingStars, 0) / reviewCount
      : 0;

  if (targetType === 'room') {
    await Room.findByIdAndUpdate(targetId, {
      averageRating: avgRating,
      reviewCount,
    });
  } else {
    await BanquetHall.findByIdAndUpdate(targetId, {
      averageRating: avgRating,
      reviewCount,
    });
  }
  // 5. Invalidate relevant caches
  await deleteMultipleCache([
    `reviews:room:${targetId}`,
    `reviews:banquet:${targetId}`,
    "reviews:all"
  ]);

  // 5. Response
  (res as any).status(200).json({
    message: 'Review deleted successfully',
  });
});