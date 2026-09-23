import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
  verifyEmailToken,
  resendVerificationEmail,
} from "../services/authService";

export async function register(
  req: Request,
  res: Response
) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    if (
      [firstName, lastName, email, password].some(
        (value) =>
          typeof value !== "string" ||
          !value.trim()
      )
    ) {
      return res.status(400).json({
        message:
          "First name, last name, email and password are required",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long",
      });
    }

    if (password.length > 128) {
      return res.status(400).json({
        message: "Password is too long",
      });
    }

    const result = await registerUser({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });

    return res.status(201).json({
      message:
        "Registration successful. Please verify your email address.",
      user: result,
      emailVerificationRequired: true,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "A user with this email already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({
      message: "Unable to register user",
    });
  }
}

export async function login(
  req: Request,
  res: Response
) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    return res.json({
      message: "Login successful",
      ...(await loginUser({
        email: email.trim().toLowerCase(),
        password,
      })),
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "Invalid email or password"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "This account has been suspended"
    ) {
      return res.status(403).json({
        message: error.message,
      });
    }

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({
      message: "Unable to login",
    });
  }
}

export async function verifyEmail(
  req: Request,
  res: Response
) {
  try {
    const token =
      typeof req.query.token === "string"
        ? req.query.token
        : "";

    if (!token) {
      return res.status(400).json({
        message:
          "Verification token is required",
      });
    }

    const user =
      await verifyEmailToken(token);

    return res.json({
      success: true,
      message:
        "Email verified successfully.",
      user,
    });
  } catch (error) {
    if (error instanceof Error) {
      const knownErrors = [
        "Verification token is required",
        "Invalid verification token",
        "This verification link has already been used",
        "Verification token has expired",
      ];

      if (
        knownErrors.includes(error.message)
      ) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    }

    console.error(
      "Email verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to verify email address",
    });
  }
}

export async function resendVerification(
  req: Request,
  res: Response
) {
  try {
    const { email } = req.body;

    if (
      typeof email !== "string" ||
      !email.trim()
    ) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const result =
      await resendVerificationEmail(
        email.trim().toLowerCase()
      );

    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error(
      "Resend verification error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to resend verification email",
    });
  }
}
