import { Router } from "express";

import {
  register,
  login,
  verifyEmail,
  resendVerification,
} from "../controllers/authController";

import {
  forgotPassword,
  resetUserPassword,
} from "../controllers/passwordResetController";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/verify-email", verifyEmail);

router.post(
  "/resend-verification",
  resendVerification
);

// Password recovery
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetUserPassword);

export default router;
