import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Event from "../models/Event";

// Helper to map uploaded files to URLs
const getImageUrls = (files: Express.Multer.File[] | undefined) => {
  if (!files) return [];
  return files.map((file) => file.path); // Cloudinary URLs
};

/* ---------------- CREATE EVENT ---------------- */
export const createEvent = asyncHandler(
  async (req: Request, res: Response) => {
    // const files = req.files as Express.Multer.File[];
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      res.status(400);
      throw new Error("Please upload at least one image");
    }

    const images = getImageUrls(files);

    const { title, description, startDate, endDate } = req.body;

    if (!title || !description || !startDate || !endDate) {
      res.status(400);
      throw new Error("All fields are required");
    }

    const event = await Event.create({
      title,
      description,
      startDate,
      endDate,
      images,
    });

    res.status(201).json(event);
  }
);

/* ---------------- GET ALL EVENTS ---------------- */
export const getEvents = asyncHandler(
  async (_req: Request, res: Response) => {
    const events = await Event.find().sort({ startDate: 1 });
    res.status(200).json(events);
  }
);

/* ---------------- GET SINGLE EVENT ---------------- */
export const getEventById = asyncHandler(
  async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.status(200).json(event);
  }
);

/* ---------------- UPDATE EVENT ---------------- */
export const updateEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const files = req.files as Express.Multer.File[];

    const event = await Event.findById(id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    // Replace images if new images uploaded
    if (files && files.length > 0) {
      // event.images = files.map((file) => file.path);
      event.images = getImageUrls(files);
    }

    event.title = req.body.title || event.title;
    event.description = req.body.description || event.description;
    event.startDate = req.body.startDate || event.startDate;
    event.endDate = req.body.endDate || event.endDate;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
  }
);

/* ---------------- DELETE EVENT ---------------- */
export const deleteEvent = asyncHandler(
  async (req: Request, res: Response) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    await event.deleteOne();
    res.status(200).json({ message: "Event deleted successfully" });
  }
);