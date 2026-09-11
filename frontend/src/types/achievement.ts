export type AchievementCategory =
  | "Streaks"
  | "Check-ins"
  | "Goals";

export interface AchievementProgressItem {
  badge: string;
  category: AchievementCategory;
  icon: string;
  title: string;
  description: string;
  requirement: string;

  metric:
    | "currentStreak"
    | "totalCheckIns"
    | "totalGoals"
    | "completedGoals";

  target: number;
  current: number;
  percentage: number;

  earned: boolean;

  earnedAt:
    | string
    | null;

  achievementId:
    | string
    | null;
}

export interface AchievementProgressResponse {
  user: {
    firstName: string;
    lastName: string;
  };

  stats: {
    totalAchievements: number;
    totalAvailable: number;
    currentStreak: number;
    totalCheckIns: number;
    totalGoals: number;
    completedGoals: number;
  };

  achievements:
    AchievementProgressItem[];

  nextAchievement:
    AchievementProgressItem | null;
}