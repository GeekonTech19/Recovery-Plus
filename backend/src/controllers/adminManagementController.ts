import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getAdminManagementUsers(
  _req: Request,
  res: Response
) {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        communityUsername: true,
        role: true,
        createdAt: true,

        _count: {
          select: {
            checkIns: true,
            goals: true,
            achievements: true,
            posts: true,
          },
        },
      },
    });

    const result = users.map((user) => ({
      id: user.id,

      name:
        `${user.firstName} ${user.lastName}`.trim(),

      email: user.email,

      username:
        user.communityUsername || "R+user",

      role: user.role,

      createdAt: user.createdAt,

      stats: {
        checkIns: user._count.checkIns,
        goals: user._count.goals,
        achievements: user._count.achievements,
        posts: user._count.posts,
      },
    }));

    return res.json({
      success: true,
      users: result,
    });
  } catch (error) {
    console.error(
      "Admin management users error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin management users",
    });
  }
}


export async function updateUserRole(
  req: Request,
  res: Response
) {
  try {
    const targetUserId = String(req.params.id);
    const { role } = req.body;

    if (
      role !== "USER" &&
      role !== "ADMIN"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Role must be USER or ADMIN",
      });
    }

    const targetUser =
      await prisma.user.findUnique({
        where: {
          id: targetUserId,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    /*
     * SUPER_ADMIN accounts cannot be modified
     * through the admin management interface.
     */
    if (targetUser.role === "SUPER_ADMIN") {
      return res.status(403).json({
        success: false,
        message:
          "SUPER_ADMIN accounts cannot be modified here",
      });
    }

    /*
     * Prevent unnecessary role updates.
     */
    if (targetUser.role === role) {
      return res.status(400).json({
        success: false,
        message:
          `User already has the ${role} role`,
      });
    }

    const updatedUser =
      await prisma.user.update({
        where: {
          id: targetUserId,
        },

        data: {
          role,
        },

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          communityUsername: true,
          role: true,
          createdAt: true,
        },
      });

    return res.json({
      success: true,

      message:
        role === "ADMIN"
          ? "User promoted to ADMIN successfully"
          : "ADMIN demoted to USER successfully",

      user: updatedUser,
    });
  } catch (error) {
    console.error(
      "Update user role error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update user role",
    });
  }
}