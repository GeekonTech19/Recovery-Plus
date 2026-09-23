import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getAdminAnalytics(
  _req: Request,
  res: Response
) {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOf7Days = new Date(startOfToday);
    startOf7Days.setDate(startOf7Days.getDate() - 6);

    const startOf30Days = new Date(startOfToday);
    startOf30Days.setDate(startOf30Days.getDate() - 29);

    const [
      totalUsers,
      newUsers7Days,
      newUsers30Days,
      totalCheckIns,
      checkIns7Days,
      totalGoals,
      completedGoals,
      totalAchievements,
      totalCommunityPosts,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          createdAt: {
            gte: startOf7Days,
          },
        },
      }),

      prisma.user.count({
        where: {
          createdAt: {
            gte: startOf30Days,
          },
        },
      }),

      prisma.dailyCheckIn.count(),

      prisma.dailyCheckIn.count({
        where: {
          date: {
            gte: startOf7Days,
          },
        },
      }),

      prisma.goal.count(),

      prisma.goal.count({
        where: {
          completed: true,
        },
      }),

      prisma.achievement.count(),

      prisma.communityPost.count(),
    ]);

    /*
     * Active users:
     * Users who have performed at least one
     * check-in during the last 30 days.
     */
    const activeUsers30Days = await prisma.user.count({
      where: {
        checkIns: {
          some: {
            date: {
              gte: startOf30Days,
            },
          },
        },
      },
    });

    /*
     * Build the last 30 days of check-in activity.
     */
    const recentCheckIns =
      await prisma.dailyCheckIn.findMany({
        where: {
          date: {
            gte: startOf30Days,
          },
        },
        select: {
          date: true,
        },
        orderBy: {
          date: "asc",
        },
      });

    const checkInTrend: {
      date: string;
      count: number;
    }[] = [];

    for (
      let i = 0;
      i < 30;
      i++
    ) {
      const day = new Date(startOf30Days);

      day.setDate(
        startOf30Days.getDate() + i
      );

      const nextDay = new Date(day);

      nextDay.setDate(
        day.getDate() + 1
      );

      const count = recentCheckIns.filter(
        (checkIn) =>
          checkIn.date >= day &&
          checkIn.date < nextDay
      ).length;

      checkInTrend.push({
        date: day.toISOString().split("T")[0],
        count,
      });
    }

    /*
     * Goal completion breakdown.
     */
    const pendingGoals =
      totalGoals - completedGoals;

    /*
     * Community activity.
     */
    const communityReactions =
      await prisma.communityReaction.count();

    /*
     * User registration trend for the last 30 days.
     */
    const recentUsers =
      await prisma.user.findMany({
        where: {
          createdAt: {
            gte: startOf30Days,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    const registrationTrend: {
      date: string;
      count: number;
    }[] = [];

    for (
      let i = 0;
      i < 30;
      i++
    ) {
      const day = new Date(startOf30Days);

      day.setDate(
        startOf30Days.getDate() + i
      );

      const nextDay = new Date(day);

      nextDay.setDate(
        day.getDate() + 1
      );

      const count = recentUsers.filter(
        (user) =>
          user.createdAt >= day &&
          user.createdAt < nextDay
      ).length;

      registrationTrend.push({
        date: day.toISOString().split("T")[0],
        count,
      });
    }

    return res.json({
      success: true,

      summary: {
        totalUsers,
        newUsers7Days,
        newUsers30Days,
        activeUsers30Days,
        totalCheckIns,
        checkIns7Days,
        totalGoals,
        completedGoals,
        pendingGoals,
        totalAchievements,
        totalCommunityPosts,
        communityReactions,
      },

      checkInTrend,

      registrationTrend,

      goals: {
        total: totalGoals,
        completed: completedGoals,
        pending: pendingGoals,
      },

      community: {
        posts: totalCommunityPosts,
        reactions: communityReactions,
      },
    });
  } catch (error) {
    console.error(
      "Admin analytics error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load admin analytics",
    });
  }
}