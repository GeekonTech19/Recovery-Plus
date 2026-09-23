import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import prisma from "../config/prisma";
import { env } from "../config/env";

export type UserRole =
  | "USER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

type JwtPayload = {
  userId?: unknown;
  email?: unknown;
};

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const [scheme, token] =
      authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication header",
      });
    }

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as JwtPayload;

    if (
      !decoded ||
      typeof decoded !== "object" ||
      typeof decoded.userId !== "string" ||
      !decoded.userId
    ) {
      return res.status(401).json({
        message:
          "Invalid authentication token",
      });
    }

    /*
     * The JWT identifies the user, but the database
     * remains the source of truth for role and status.
     *
     * This means:
     * - role changes take effect immediately
     * - suspended users lose access immediately
     * - old JWTs cannot preserve old privileges
     */
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "User account not found",
      });
    }

    if (user.status === "SUSPENDED") {
      return res.status(403).json({
        message:
          "This account has been suspended",
      });
    }

    if (
      user.role !== "USER" &&
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return res.status(401).json({
        message: "Invalid user role",
      });
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    next();
  } catch (error) {
    console.error(
      "Authentication error:",
      error
    );

    return res.status(401).json({
      message:
        "Invalid or expired authentication token",
    });
  }
}

/**
 * Allows both ADMIN and SUPER_ADMIN users.
 */
export function requireAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required",
    });
  }

  if (
    req.user.role !== "ADMIN" &&
    req.user.role !== "SUPER_ADMIN"
  ) {
    return res.status(403).json({
      message:
        "Administrator access required",
    });
  }

  next();
}

/**
 * Allows SUPER_ADMIN users only.
 */
export function requireSuperAdmin(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({
      message:
        "Authentication required",
    });
  }

  if (
    req.user.role !== "SUPER_ADMIN"
  ) {
    return res.status(403).json({
      message:
        "Super administrator access required",
    });
  }

  next();
}
