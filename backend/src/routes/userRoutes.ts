import { Router } from "express";
import {
  updateUserPreferencesController,
} from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.put(
  "/preferences",
  authenticate,
  updateUserPreferencesController
);

export default router;