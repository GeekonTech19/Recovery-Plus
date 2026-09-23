import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import prisma from "../config/prisma";

/**
 * =========================
 * ADMIN DASHBOARD
 * =========================
 */
export async function getAdminDashboard(
  req: AuthRequest,
  res: Response
) {
  try {
    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [
      totalUsers,
      totalCheckIns,
      totalGoals,
      completedGoals,
      totalAchievements,
      totalCommunityPosts,

      newUsersLast7Days,
      activeUsersToday,
      checkInsToday,

      alcoholFreeCount,
      noSmokingCount,
      noDrugsCount,
      exercisedCount,
      drankWaterCount,
      sleptWellCount,

      recentUsers,
      recentCheckIns,
      recentCommunityPosts,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.dailyCheckIn.count(),

      prisma.goal.count(),

      prisma.goal.count({
        where: {
          completed: true,
        },
      }),

      prisma.achievement.count(),

      prisma.communityPost.count(),

      prisma.user.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),

      prisma.dailyCheckIn.findMany({
        where: {
          date: {
            gte: startOfToday,
          },
        },
        distinct: ["userId"],
        select: {
          userId: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          date: {
            gte: startOfToday,
          },
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          alcoholFree: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          noSmoking: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          noDrugs: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          exercised: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          drankWater: true,
        },
      }),

      prisma.dailyCheckIn.count({
        where: {
          sleptWell: true,
        },
      }),

      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 8,

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
      }),

      prisma.dailyCheckIn.findMany({
        orderBy: {
          date: "desc",
        },

        take: 10,

        select: {
          id: true,
          date: true,
          mood: true,
          stress: true,
          alcoholFree: true,
          noSmoking: true,
          noDrugs: true,
          exercised: true,
          drankWater: true,
          sleptWell: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },
        },
      }),

      prisma.communityPost.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 8,

        select: {
          id: true,
          type: true,
          content: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },

          _count: {
            select: {
              reactions: true,
            },
          },
        },
      }),
    ]);

    const activeUsersTodayCount =
      activeUsersToday.length;

    const goalCompletionRate =
      totalGoals > 0
        ? Math.round(
            (completedGoals / totalGoals) * 100
          )
        : 0;

    return res.json({
      success: true,

      admin: {
        userId: req.user?.userId,
        email: req.user?.email,
        role: req.user?.role,
      },

      statistics: {
        totalUsers,
        newUsersLast7Days,
        activeUsersToday: activeUsersTodayCount,
        totalCheckIns,
        checkInsToday,
        totalGoals,
        completedGoals,
        goalCompletionRate,
        totalAchievements,
        totalCommunityPosts,
      },

      recoveryActivity: {
        alcoholFree: alcoholFreeCount,
        noSmoking: noSmokingCount,
        noDrugs: noDrugsCount,
        exercised: exercisedCount,
        drankWater: drankWaterCount,
        sleptWell: sleptWellCount,
      },

      recentUsers,
      recentCheckIns,
      recentCommunityPosts,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin dashboard",
    });
  }
}

/**
 * =========================
 * ADMIN USERS
 * =========================
 */
export async function getAdminUsers(
  req: AuthRequest,
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
            reactions: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load users",
    });
  }
}

/**
 * =========================
 * ADMIN USER OVERVIEW
 * =========================
 */
export async function getAdminUserOverview(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.params.id;

    if (typeof userId !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        communityUsername: true,
        role: true,
        createdAt: true,
        language: true,
        locale: true,
        timezone: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const [
      totalCheckIns,
      totalGoals,
      completedGoals,
      totalAchievements,
      totalPosts,
      totalReactions,

      checkIns,
      goals,
      achievements,
      posts,
    ] = await Promise.all([
      prisma.dailyCheckIn.count({
        where: {
          userId,
        },
      }),

      prisma.goal.count({
        where: {
          userId,
        },
      }),

      prisma.goal.count({
        where: {
          userId,
          completed: true,
        },
      }),

      prisma.achievement.count({
        where: {
          userId,
        },
      }),

      prisma.communityPost.count({
        where: {
          userId,
        },
      }),

      prisma.communityReaction.count({
        where: {
          userId,
        },
      }),

      prisma.dailyCheckIn.findMany({
        where: {
          userId,
        },

        orderBy: {
          date: "desc",
        },

        take: 20,

        select: {
          id: true,
          date: true,
          recoveryDate: true,
          mood: true,
          stress: true,
          alcoholFree: true,
          noSmoking: true,
          noDrugs: true,
          exercised: true,
          drankWater: true,
          sleptWell: true,
          journal: true,
          challenge: true,
          wins: true,
        },
      }),

      prisma.goal.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        select: {
          id: true,
          title: true,
          description: true,
          category: true,
          completed: true,
          progress: true,
          target: true,
          trackingType: true,
          dueDate: true,
          createdAt: true,
        },
      }),

      prisma.achievement.findMany({
        where: {
          userId,
        },

        orderBy: {
          earnedAt: "desc",
        },

        select: {
          id: true,
          badge: true,
          earnedAt: true,
        },
      }),

      prisma.communityPost.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: "desc",
        },

        take: 20,

        select: {
          id: true,
          type: true,
          content: true,
          createdAt: true,

          _count: {
            select: {
              reactions: true,
            },
          },
        },
      }),
    ]);

    const goalCompletionRate =
      totalGoals > 0
        ? Math.round(
            (completedGoals / totalGoals) * 100
          )
        : 0;

    return res.json({
      success: true,

      user,

      statistics: {
        totalCheckIns,
        totalGoals,
        completedGoals,
        goalCompletionRate,
        totalAchievements,
        totalPosts,
        totalReactions,
      },

      checkIns,
      goals,
      achievements,
      posts,
    });
  } catch (error) {
    console.error(
      "Admin user overview error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load user overview",
    });
  }
}

/**
 * =========================
 * ADMIN ACTIVITY
 * =========================
 */
export async function getAdminActivity(
  req: AuthRequest,
  res: Response
) {
  try {
    const [
      registrations,
      checkIns,
      goals,
      achievements,
      communityPosts,
      reactions,
    ] = await Promise.all([
      /*
       * User registrations
       */
      prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          communityUsername: true,
          createdAt: true,
        },
      }),

      /*
       * Daily check-ins
       */
      prisma.dailyCheckIn.findMany({
        orderBy: {
          date: "desc",
        },

        take: 30,

        select: {
          id: true,
          date: true,
          mood: true,
          stress: true,
          recoveryDate: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },
        },
      }),

      /*
       * Goals
       */
      prisma.goal.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          title: true,
          category: true,
          completed: true,
          progress: true,
          target: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },
        },
      }),

      /*
       * Achievements
       */
      prisma.achievement.findMany({
        orderBy: {
          earnedAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          badge: true,
          earnedAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },
        },
      }),

      /*
       * Community posts
       */
      prisma.communityPost.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          type: true,
          content: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },

          _count: {
            select: {
              reactions: true,
            },
          },
        },
      }),

      /*
       * Community reactions
       */
      prisma.communityReaction.findMany({
        orderBy: {
          createdAt: "desc",
        },

        take: 30,

        select: {
          id: true,
          emoji: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },

          post: {
            select: {
              id: true,
              content: true,

              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  communityUsername: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const activity = [
      /*
       * Registrations
       */
      ...registrations.map((user) => ({
        id: `registration-${user.id}`,
        type: "registration",
        timestamp: user.createdAt,

        user: {
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          username: user.communityUsername,
        },

        details: {
          email: user.email,
        },
      })),

      /*
       * Check-ins
       */
      ...checkIns.map((checkIn) => ({
        id: `checkin-${checkIn.id}`,
        type: "checkin",
        timestamp: checkIn.date,

        user: {
          id: checkIn.user.id,
          name: `${checkIn.user.firstName} ${checkIn.user.lastName}`,
          username: checkIn.user.communityUsername,
        },

        details: {
          mood: checkIn.mood,
          stress: checkIn.stress,
          recoveryDate: checkIn.recoveryDate,
        },
      })),

      /*
       * Goals
       */
      ...goals.map((goal) => ({
        id: `goal-${goal.id}`,
        type: "goal",
        timestamp: goal.createdAt,

        user: {
          id: goal.user.id,
          name: `${goal.user.firstName} ${goal.user.lastName}`,
          username: goal.user.communityUsername,
        },

        details: {
          title: goal.title,
          category: goal.category,
          completed: goal.completed,
          progress: goal.progress,
          target: goal.target,
        },
      })),

      /*
       * Achievements
       */
      ...achievements.map((achievement) => ({
        id: `achievement-${achievement.id}`,
        type: "achievement",
        timestamp: achievement.earnedAt,

        user: {
          id: achievement.user.id,
          name: `${achievement.user.firstName} ${achievement.user.lastName}`,
          username: achievement.user.communityUsername,
        },

        details: {
          badge: achievement.badge,
        },
      })),

      /*
       * Community posts
       */
      ...communityPosts.map((post) => ({
        id: `post-${post.id}`,
        type: "community_post",
        timestamp: post.createdAt,

        user: {
          id: post.user.id,
          name: `${post.user.firstName} ${post.user.lastName}`,
          username: post.user.communityUsername,
        },

        details: {
          content: post.content,
          postType: post.type,
          reactions: post._count.reactions,
        },
      })),

      /*
       * Community reactions
       */
      ...reactions.map((reaction) => ({
        id: `reaction-${reaction.id}`,
        type: "reaction",
        timestamp: reaction.createdAt,

        user: {
          id: reaction.user.id,
          name: `${reaction.user.firstName} ${reaction.user.lastName}`,
          username: reaction.user.communityUsername,
        },

        details: {
          emoji: reaction.emoji,
          postContent: reaction.post.content,

          postAuthor:
            reaction.post.user.communityUsername ||
            `${reaction.post.user.firstName} ${reaction.post.user.lastName}`,
        },
      })),
    ];

    /*
     * Sort newest activity first.
     */
    activity.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
    );

    return res.json({
      success: true,
      activity: activity.slice(0, 100),
    });
  } catch (error) {
    console.error(
      "Admin activity error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to load admin activity",
    });
  }
}