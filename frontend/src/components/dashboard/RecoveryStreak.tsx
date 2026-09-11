import DashboardCard from "../DashboardCard";
import type { DashboardSummary } from "../../types/dashboard";

interface RecoveryStreakProps {
  dashboard: DashboardSummary;
}

function RecoveryStreak({
  dashboard,
}: RecoveryStreakProps) {
  const streak = dashboard.recovery.currentStreak;

  const progress = Math.min(
    (streak / 30) * 100,
    100
  );

  const milestone =
    streak >= 365
      ? "👑 Legend"
      : streak >= 180
      ? "🏆 Champion"
      : streak >= 90
      ? "💎 Diamond"
      : streak >= 30
      ? "🥇 Gold"
      : streak >= 14
      ? "🥈 Silver"
      : streak >= 7
      ? "🥉 Bronze"
      : streak >= 3
      ? "🔥 Momentum"
      : "🌱 Beginning";

  return (
    <DashboardCard title="🔥 Recovery Streak">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-6xl font-bold text-emerald-500">
            {streak}
          </h2>

          <p className="text-lg font-semibold">
            Day Streak
          </p>
        </div>

        <div className="rounded-full bg-emerald-100 p-6">
          <span className="text-5xl">
            🔥
          </span>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-4 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-emerald-400 to-green-600 transition-all duration-700"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm text-slate-500">
        <span>
          {streak}/30 Recovery Days
        </span>

        <span>
          {Math.round(progress)}%
        </span>
      </div>

      <div className="mt-6 rounded-xl bg-emerald-50 p-4 text-center">
        <p className="text-sm text-slate-600">
          Current Milestone
        </p>

        <h3 className="mt-1 text-xl font-bold text-emerald-700">
          {milestone}
        </h3>
      </div>
    </DashboardCard>
  );
}

export default RecoveryStreak;