import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import { createEvent, getEvents, getEventById, updateEvent, deleteEvent} from "../controllers/eventController";
import { uploadEvent } from "../middleware/uploadEvent";

const router = express.Router();

// Get all events (Public)
router.route("/").get(getEvents as any);
// Create event (Admin)
router.route("/").post(protect as any, admin as any, createEvent as any);
// Get single event (Public)
router.route("/:id").get(getEventById as any);
// Update event (Admin)
router.route("/:id").patch(protect as any, admin as any, updateEvent as any);
// Delete event (Admin)
router.route("/:id").delete(protect as any, admin as any, deleteEvent as any);

export default router;