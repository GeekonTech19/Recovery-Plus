export interface RecoveryScoreInput {
  currentStreak: number;
  totalJournalDays: number;
  averageTrigger: number;
  commonMood: string;
}

export interface CheckInScoreInput {
  alcoholFree: boolean;
  noSmoking: boolean;
  noDrugs: boolean;
  exercised: boolean;
  drankWater: boolean;
  sleptWell: boolean;
  mood: string;
  stress: number;
}

export interface CheckInResult {
  score: number;
  level: string;
  message: string;
}

/**
 * --------------------------------------------------------
 * DAILY CHECK-IN SCORE
 * Used immediately after a user saves today's check-in.
 * --------------------------------------------------------
 */
export function calculateCheckInScore(
  checkIn: CheckInScoreInput
): CheckInResult {
  let score = 0;

  if (checkIn.alcoholFree) score += 20;
  if (checkIn.noSmoking) score += 15;
  if (checkIn.noDrugs) score += 15;

  if (checkIn.exercised) score += 10;
  if (checkIn.drankWater) score += 10;
  if (checkIn.sleptWell) score += 10;

  // Lower stress earns more points
  score += Math.round((10 - checkIn.stress) * 2);

  // Mood bonus
  switch (checkIn.mood) {
    case "Excellent 😄":
      score += 10;
      break;

    case "Good 😊":
      score += 8;
      break;

    case "Okay 😐":
      score += 5;
      break;

    case "Low 😔":
      score += 2;
      break;

    default:
      score += 0;
  }

  score = Math.min(score, 100);

  const level = calculateRecoveryStatus(score);

  let message = "";

  if (score >= 90) {
    message = "Outstanding work today! Keep building on this momentum.";
  } else if (score >= 75) {
    message = "Great job! You're making strong recovery progress.";
  } else if (score >= 60) {
    message = "Good work. Stay consistent and keep going.";
  } else if (score >= 40) {
    message = "Every step counts. Tomorrow is another opportunity.";
  } else {
    message = "Recovery starts one day at a time. Keep showing up.";
  }

  return {
    score,
    level,
    message,
  };
}

/**
 * --------------------------------------------------------
 * OVERALL DASHBOARD RECOVERY SCORE
 * Used by dashboardService.
 * --------------------------------------------------------
 */
export function calculateRecoveryScore(
  data: RecoveryScoreInput
): number {
  const streakScore = Math.min(
    (data.currentStreak / 30) * 40,
    40
  );

  const journalScore = Math.min(
    (data.totalJournalDays / 30) * 30,
    30
  );

  const triggerScore =
    ((10 - data.averageTrigger) / 10) * 20;

  const moodBonus =
    data.commonMood === "😊 Happy" ||
    data.commonMood === "😄 Excited"
      ? 10
      : 5;

  const score = Math.round(
    streakScore +
      journalScore +
      triggerScore +
      moodBonus
  );

  return Math.min(score, 100);
}

/**
 * --------------------------------------------------------
 * RECOVERY STATUS
 * --------------------------------------------------------
 */
export function calculateRecoveryStatus(
  score: number
): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong Progress";
  if (score >= 60) return "Building Momentum";
  if (score >= 40) return "Keep Going";
  return "Just Getting Started";
}

/**
 * --------------------------------------------------------
 * RECOVERY MILESTONE
 * --------------------------------------------------------
 */
export function calculateMilestone(
  streak: number
): string {
  if (streak >= 365) return "👑 Legend";
  if (streak >= 180) return "🏆 Champion";
  if (streak >= 90) return "💎 Diamond";
  if (streak >= 30) return "🥇 Gold";
  if (streak >= 14) return "🥈 Silver";
  if (streak >= 7) return "🥉 Bronze";
  if (streak >= 3) return "🔥 Momentum";

  return "🌱 Beginning";
}