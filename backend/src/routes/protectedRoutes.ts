import { Router } from "express";
import {
  authenticate,
  AuthRequest,
} from "../middleware/authMiddleware";
import {
  updateUserPreferencesController,
} from "../controllers/userController";

const router = Router();

router.get(
  "/profile",
  authenticate,
  (req: AuthRequest, res) => {
    res.json({
      message:
        "You accessed a protected route successfully 🔐",
      user: req.user,
    });
  }
);

router.patch(
  "/preferences",
  authenticate,
  updateUserPreferencesController
);

export default router;