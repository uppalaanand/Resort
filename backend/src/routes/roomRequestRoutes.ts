import express from "express";
import { protect, admin } from "../middleware/authMiddleware";
import { createRoomRequest, getAllRoomRequests, getMyRoomRequests, updateRoomRequestStatus } from "../controllers/roomRequestController";

const router = express.Router();

router.route("/").post(protect as any, createRoomRequest as any);
router.route("/").get(protect as any, admin as any, getAllRoomRequests as any);
router.route("/my").get(protect as any, getMyRoomRequests as any);
router
  .route("/:id/status")
  .patch(protect as any, admin as any, updateRoomRequestStatus as any);

export default router;