import { Request, Response } from "express";

import {
  requestPasswordReset,
  resetPassword,
} from "../services/passwordResetService";

export async function forgotPassword(
  req: Request,
  res: Response
) {
  try {
    const email =
      String(req.body?.email || "")
        .trim()
        .toLowerCase();

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result =
      await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to process password reset request",
    });
  }
}

export async function resetUserPassword(
  req: Request,
  res: Response
) {
  try {
    const token =
      String(req.body?.token || "").trim();

    const password =
      String(req.body?.password || "");

    if (!token) {
      return res.status(400).json({
        message:
          "Password reset token is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "Password is required",
      });
    }

    if (
      password.length < 8 ||
      password.length > 128
    ) {
      return res.status(400).json({
        message:
          "Password must be between 8 and 128 characters",
      });
    }

    const result =
      await resetPassword(
        token,
        password
      );

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Unable to reset password";

    const knownErrors = [
      "Password reset token is required",
      "Invalid password reset token",
      "This password reset link has already been used",
      "Password reset token has expired",
    ];

    if (knownErrors.includes(message)) {
      return res.status(400).json({
        message,
      });
    }

    console.error(
      "Reset password error:",
      error
    );

    return res.status(500).json({
      message:
        "Unable to reset password",
    });
  }
}
