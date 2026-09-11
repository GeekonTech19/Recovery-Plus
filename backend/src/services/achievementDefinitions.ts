export type AchievementCategory =
  | "Streaks"
  | "Check-ins"
  | "Goals";

export type AchievementMetric =
  | "currentStreak"
  | "totalCheckIns"
  | "totalGoals"
  | "completedGoals";

export type AchievementDefinition = {
  badge: string;
  category: AchievementCategory;
  icon: string;
  title: string;
  description: string;
  requirement: string;
  metric: AchievementMetric;
  target: number;
};

export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    badge: "First Check-In",
    category: "Check-ins",
    icon: "🌱",
    title: "First Check-In",
    description:
      "You completed your first recovery check-in.",
    requirement:
      "Complete your first Daily Check-in.",
    metric: "totalCheckIns",
    target: 1,
  },

  {
    badge: "3-Day Streak",
    category: "Streaks",
    icon: "🔥",
    title: "3-Day Streak",
    description:
      "You checked in for 3 consecutive days.",
    requirement:
      "Check in for 3 consecutive days.",
    metric: "currentStreak",
    target: 3,
  },

  {
    badge: "7-Day Streak",
    category: "Streaks",
    icon: "🔥",
    title: "7-Day Streak",
    description:
      "You checked in for 7 consecutive days.",
    requirement:
      "Check in for 7 consecutive days.",
    metric: "currentStreak",
    target: 7,
  },

  {
    badge: "14-Day Streak",
    category: "Streaks",
    icon: "🔥",
    title: "14-Day Streak",
    description:
      "You checked in for 14 consecutive days.",
    requirement:
      "Check in for 14 consecutive days.",
    metric: "currentStreak",
    target: 14,
  },

  {
    badge: "30-Day Streak",
    category: "Streaks",
    icon: "🏆",
    title: "30-Day Streak",
    description:
      "You checked in for 30 consecutive days.",
    requirement:
      "Check in for 30 consecutive days.",
    metric: "currentStreak",
    target: 30,
  },

  {
    badge: "10 Check-Ins",
    category: "Check-ins",
    icon: "📋",
    title: "10 Check-Ins",
    description:
      "You completed 10 recovery check-ins.",
    requirement:
      "Complete 10 Daily Check-ins.",
    metric: "totalCheckIns",
    target: 10,
  },

  {
    badge: "30 Check-Ins",
    category: "Check-ins",
    icon: "📋",
    title: "30 Check-Ins",
    description:
      "You completed 30 recovery check-ins.",
    requirement:
      "Complete 30 Daily Check-ins.",
    metric: "totalCheckIns",
    target: 30,
  },

  {
    badge: "First Goal",
    category: "Goals",
    icon: "🎯",
    title: "First Goal",
    description:
      "You created your first recovery goal.",
    requirement:
      "Create your first recovery goal.",
    metric: "totalGoals",
    target: 1,
  },

  {
    badge: "First Goal Completed",
    category: "Goals",
    icon: "🏆",
    title: "First Goal Completed",
    description:
      "You completed your first recovery goal.",
    requirement:
      "Complete your first recovery goal.",
    metric: "completedGoals",
    target: 1,
  },
];