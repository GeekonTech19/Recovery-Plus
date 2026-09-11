import { Router } from "express";

import {
  createAchievementController,
  getAchievementsController,
  getAchievementByIdController,
  getAchievementProgressController,
  deleteAchievementController,
} from "../controllers/achievementController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/",
  authenticate,
  createAchievementController
);

router.get(
  "/progress",
  authenticate,
  getAchievementProgressController
);

router.get(
  "/",
  authenticate,
  getAchievementsController
);

router.get(
  "/:id",
  authenticate,
  getAchievementByIdController
);

router.delete(
  "/:id",
  authenticate,
  deleteAchievementController
);

export default router;