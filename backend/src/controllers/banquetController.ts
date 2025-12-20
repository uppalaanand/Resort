import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import BanquetHall from '../models/BanquetHall';

// @desc    Create a banquet
// @route   POST /api/banquets
// @access  Private/Admin
export const createBanquet = asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];

    const images = files.map(file => file.path);

    const newBanquet = await BanquetHall.create({
      ...req.body,
      images,
    });

  (res as any).status(201).json(newBanquet);
});

// @decs   Get all banquets
// @route   GET /api/banquets
// @access  Public
export const getBanquets = asyncHandler(async (req: Request, res: Response) => {
    const banquets = await BanquetHall.find({ isActive: true });
    if(banquets) {
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
    const banquet = await BanquetHall.findById(req.params.id);

    if(banquet) {
        (res as any).json(banquet);
    }else{
        (res as any).status(404);
        throw new Error('Banquet not found');
    }
});

// // @desc    Update a banquet
// // @route   PUT /api/banquets/:id
// // @access  Private/Admin
// export const updateBanquete = asyncHandler(async (req: Request, res: Response) => {
//     const banquet = await BanquetHall.findById(req.params.id);

//     if(!banquet) {
//         (res as any).status(404);
//         throw new Error('Banquet not found');
//     }
//     Object.assign(banquet, (req as any).body);

//     const files = (req as any).files as Express.Multer.File[];
//     if (files && files.length > 0) {
//         banquet.images = files.map((file) => file.path); // overwrite old images
//     }
//     const updatedBanquet = await banquet.save();
//     (res as any).json(updatedBanquet);
// });

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
        (res as any).json({ message: 'Banquet hall deactivated' });
    }else{
        (res as any).status(404);
        throw new Error('Banquet not found');
    }
});