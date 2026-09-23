import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getAdminAchievements(
  _req: Request,
  res: Response
) {
  try {
    const [
      totalAchievements,
      usersWithAchievements,
      recentAchievements,
      achievementsByBadge,
    ] = await Promise.all([
      prisma.achievement.count(),

      prisma.user.count({
        where: {
          achievements: {
            some: {},
          },
        },
      }),

      prisma.achievement.findMany({
        orderBy: {
          earnedAt: "desc",
        },
        take: 50,
        select: {
          id: true,
          badge: true,
          earnedAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              communityUsername: true,
            },
          },
        },
      }),

      prisma.achievement.groupBy({
        by: ["badge"],
        _count: {
          badge: true,
        },
        orderBy: {
          _count: {
            badge: "desc",
          },
        },
      }),
    ]);

    const recent = recentAchievements.map(
      (achievement) => ({
        id: achievement.id,

        badge: achievement.badge,

        earnedAt: achievement.earnedAt,

        user: {
          id: achievement.user.id,

          name:
            `${achievement.user.firstName} ${achievement.user.lastName}`.trim(),

          email: achievement.user.email,

          username:
            achievement.user.communityUsername ||
            "R+user",
        },
      })
    );

    const badgeBreakdown =
      achievementsByBadge.map((item) => ({
        badge: item.badge,
        count: item._count.badge,
      }));

    return res.json({
      success: true,

      summary: {
        totalAchievements,
        usersWithAchievements,
      },

      badgeBreakdown,

      recent,
    });
  } catch (error) {
    console.error(
      "Admin achievements error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load achievement administration data",
    });
  }
}