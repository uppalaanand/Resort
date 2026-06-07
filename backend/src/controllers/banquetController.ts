import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import BanquetHall from '../models/BanquetHall';
import { deleteCache, deleteMultipleCache, getCache, setCache } from '../utils/cache';

// Helper to map uploaded files to URLs
const getImageUrls = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => file.path); // Cloudinary URLs
};

// @desc    Create a banquet
// @route   POST /api/banquets
// @access  Private/Admin
export const createBanquet = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    // const images = files.map(file => file.path);
    const images = getImageUrls(req.files as Express.Multer.File[]);

    const newBanquet = await BanquetHall.create({
      ...req.body,
      images,
    });

    // Invalidate cache for banquets list
    await deleteCache('banquets:all');

  (res as any).status(201).json(newBanquet);
});

// @desc    Get all banquets
// @route   GET /api/banquets
// @access  Public
export const getBanquets = asyncHandler(async (req: Request, res: Response) => {
  //create a cache key for all banquets
  const cacheKey = 'banquets:all';
  // Try to get from cache
  const cachedData = await getCache(cacheKey);
  // If cached data exists, return it
  if(cachedData) {
    // console.log("Serving banquets from Redis");
    return (res as any).json(cachedData);
  }
  // If no cache, fetch from DB
  const banquets = await BanquetHall.find({ isActive: true });
  // Return the response
  if(banquets) {
    // Store in cache for future requests for 1 hour (3600 seconds)
    await setCache(cacheKey, banquets, 3600);
    // console.log("Serving banquets from MongoDB");
    (res as any).json(banquets);
  }else{
    (res as any).status(404);
    throw new Error('No banquets found');
  }
});

// @desc    Get banquet by ID
// @route   GET /api/banquets/:id
// @access  Public
export const getBanquetById = asyncHandler(async (req: Request, res: Response) => {
  // Create a cache key specific to this banquet ID
  const cacheKey = `banquet:${req.params.id}`;
  // Try to get banquet from cache
  const cachedBanquet = await getCache(cacheKey);
  // If found in cache, return it
  if(cachedBanquet) {
    // console.log(`Serving banquet ${req.params.id} from Redis`);
    return (res as any).json(cachedBanquet);
  }
  // If not in cache, fetch from DB
  const banquet = await BanquetHall.findById(req.params.id);
  // Return the response
  if(banquet) {
    // Store in cache for future requests for 1 hour (3600 seconds)
    await setCache(cacheKey, banquet, 3600);
    // console.log(`Serving banquet ${req.params.id} from MongoDB`);
    (res as any).json(banquet);
  }else{
    (res as any).status(404);
    throw new Error('Banquet not found');
  }
});

// @desc    Update a banquet
// @route   PUT /api/banquets/:id
// @access  Private/Admin
const parseArrayField = (field: any): string[] => {
  if (!field) return [];

  // Already an array
  if (Array.isArray(field)) return field;

  // JSON string → ["WiFi","Projector"]
  if (typeof field === "string" && field.trim().startsWith("[")) {
    return JSON.parse(field);
  }

  // Comma separated → "WiFi,Projector"
  if (typeof field === "string") {
    return field.split(",").map((item) => item.trim());
  }

  return [];
};


export const updateBanquete = asyncHandler(async (req: Request, res: Response) => {
  const banquet = await BanquetHall.findById(req.params.id);

  if (!banquet) {
    res.status(404);
    throw new Error("Banquet not found");
  }

  /* -------- SAFE ARRAY PARSING -------- */
  const amenities = parseArrayField(req.body.amenities);
  const supportedEvents = parseArrayField(req.body.supportedEvents);

  /* -------- NORMAL FIELDS -------- */
  banquet.capacity = req.body.capacity ?? banquet.capacity;
  // banquet.pricePerPlate = req.body.pricePerPlate ?? banquet.pricePerPlate;
  banquet.description = req.body.description ?? banquet.description;
  banquet.averageRating = req.body.averageRating ?? banquet.averageRating;
  banquet.reviewCount = req.body.reviewCount ?? banquet.reviewCount;

  banquet.amenities = amenities;
  banquet.supportedEvents = supportedEvents;

  /* -------- IMAGES -------- */
  const files = req.files as Express.Multer.File[];
  if (files && files.length > 0) {
    banquet.images = files.map((file) => file.path);
  }

  const updatedBanquet = await banquet.save();
  // Invalidate cache for this banquet and banquets list
  await deleteMultipleCache([
    `banquet:${req.params.id}`,
    'banquets:all'
  ])
  // Return updated banquet
  res.json(updatedBanquet);
});



// @desc    Delete a banquet (Soft delete)
// @route   DELETE /api/banquets/:id
// @access  Private/Admin
export const deleteBanquet = asyncHandler(async (req: Request, res: Response) => {
    const banquet = await BanquetHall.findById(req.params.id);
    if(banquet) {
        banquet.isActive = false;
        await banquet.save();
        // Invalidate cache for this banquet and banquets list
        await deleteMultipleCache([
            "banquets:all",
            `banquet:${req.params.id}`
        ]);
        (res as any).json({ message: 'Banquet hall deactivated' });
    }else{
        (res as any).status(404);
        throw new Error('Banquet not found');
    }
});

// @desc    Toggle banquet active/inactive
// @route   PATCH /api/banquets/:id/toggle
// @access  Private/Admin
export const toggleBanquet = asyncHandler(async (req: Request, res: Response) => {
  const banquet = await BanquetHall.findById(req.params.id);

  if (!banquet) {
    (res as any).status(404);
    throw new Error("Banquet not found");
  }

  banquet.isActive = !banquet.isActive;
  await banquet.save();

  await deleteMultipleCache([`banquet:${banquet._id}`, 'banquets:all']);

  (res as any).json(banquet);
});

// @desc    Get all banquets (Admin - includes inactive)
// @route   GET /api/banquets/admin/all
// @access  Private/Admin
export const getAllBanquetsAdmin = asyncHandler(async (req: Request, res: Response) => {
  const banquets = await BanquetHall.find({});
  (res as any).json(banquets);
});