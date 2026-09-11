import { Router } from "express";
import {
  createDailyCheckIn,
  getDailyCheckIns,
  getDailyCheckInById,
} from "../controllers/checkInController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createDailyCheckIn);

router.get("/", authenticate, getDailyCheckIns);

router.get("/:id", authenticate, getDailyCheckInById);

export default router;