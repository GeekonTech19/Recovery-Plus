import prisma from "../config/prisma";
import { ACHIEVEMENT_DEFINITIONS } from "./achievementDefinitions";
import { getCurrentRecoveryStreak } from "./streakService";

export async function createAchievement(data: {
  userId: string;
  badge: string;
}) {
  const existing = await prisma.achievement.findUnique({
    where: {
      userId_badge: {
        userId: data.userId,
        badge: data.badge,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.achievement.create({
    data: {
      userId: data.userId,
      badge: data.badge,
    },
  });
}

async function awardCount(
  userId: string,
  target: number,
  badge: string
) {
  const count = await prisma.dailyCheckIn.count({
    where: { userId },
  });

  return count >= target
    ? createAchievement({ userId, badge })
    : null;
}

async function awardStreak(
  userId: string,
  target: number,
  badge: string
) {
  return (await getCurrentRecoveryStreak(userId)) >= target
    ? createAchievement({ userId, badge })
    : null;
}

export async function evaluateCheckInAchievements(
  userId: string
) {
  const results = await Promise.all([
    awardCount(userId, 1, "First Check-In"),
    awardStreak(userId, 3, "3-Day Streak"),
    awardStreak(userId, 7, "7-Day Streak"),
    awardStreak(userId, 14, "14-Day Streak"),
    awardStreak(userId, 30, "30-Day Streak"),
    awardCount(userId, 10, "10 Check-Ins"),
    awardCount(userId, 30, "30 Check-Ins"),
  ]);

  return results.filter(Boolean);
}

export async function getAchievementProgress(userId: string) {
  const [
    user,
    earned,
    checkInCount,
    currentStreak,
    totalGoals,
    completedGoals,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
      },
    }),

    prisma.achievement.findMany({
      where: { userId },
      orderBy: { earnedAt: "desc" },
    }),

    prisma.dailyCheckIn.count({
      where: { userId },
    }),

    getCurrentRecoveryStreak(userId),

    prisma.goal.count({
      where: { userId },
    }),

    prisma.goal.count({
      where: {
        userId,
        completed: true,
      },
    }),
  ]);

  if (!user) {
    throw new Error("User not found");
  }

  const stats = {
    totalAchievements: earned.length,
    totalAvailable: ACHIEVEMENT_DEFINITIONS.length,
    currentStreak,
    totalCheckIns: checkInCount,
    totalGoals,
    completedGoals,
  };

  const items = ACHIEVEMENT_DEFINITIONS.map((definition) => {
    let current = 0;

    switch (definition.metric) {
      case "currentStreak":
        current = currentStreak;
        break;

      case "totalCheckIns":
        current = checkInCount;
        break;

      case "totalGoals":
        current = totalGoals;
        break;

      case "completedGoals":
        current = completedGoals;
        break;
    }

    const earnedItem = earned.find(
      (achievement) =>
        achievement.badge === definition.badge
    );

    return {
      ...definition,
      current: Math.min(current, definition.target),
      target: definition.target,
      percentage: Math.min(
        100,
        Math.round(
          (current / definition.target) * 100
        )
      ),
      earned: Boolean(earnedItem),
      earnedAt:
        earnedItem?.earnedAt.toISOString() ?? null,
      achievementId: earnedItem?.id ?? null,
    };
  });

  const nextAchievement =
    items
      .filter((item) => !item.earned)
      .sort((a, b) => {
        if (a.percentage !== b.percentage) {
          return b.percentage - a.percentage;
        }

        return a.target - b.target;
      })[0] ?? null;

  return {
    user: {
      firstName: user.firstName,
      lastName: user.lastName,
    },
    stats,
    achievements: items,
    nextAchievement,
  };
}
