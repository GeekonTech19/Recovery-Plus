import DashboardCard from "../DashboardCard";
import type { DashboardSummary } from "../../types/dashboard";

interface RecoveryStatisticsProps {
  dashboard: DashboardSummary;
}

function RecoveryStatistics({
  dashboard,
}: RecoveryStatisticsProps) {
  const {
    totalCheckIns,
    averageStress,
    successRate,
  } = dashboard.recovery;

  const {
    total: totalGoals,
    completed: completedGoals,
    remaining: remainingGoals,
  } = dashboard.goals;

  const totalAchievements =
    dashboard.achievements.total;

  return (
    <DashboardCard title="📈 Recovery Statistics">
      <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">

        <div>
          <p className="text-sm text-slate-500">
            Total Check-Ins
          </p>

          <p className="text-3xl font-bold text-blue-900">
            {totalCheckIns}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Average Stress
          </p>

          <p className="text-3xl font-bold text-orange-500">
            {averageStress.toFixed(1)}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Success Rate
          </p>

          <p className="text-3xl font-bold text-indigo-600">
            {successRate}%
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Total Goals
          </p>

          <p className="text-3xl font-bold text-blue-900">
            {totalGoals}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Completed Goals
          </p>

          <p className="text-3xl font-bold text-emerald-600">
            {completedGoals}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Achievements
          </p>

          <p className="text-3xl font-bold text-purple-600">
            {totalAchievements}
          </p>
        </div>

      </div>

      <div className="mt-8 rounded-2xl bg-slate-50 p-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-slate-700">
            Goals Remaining
          </p>

          <span className="font-bold text-slate-800">
            {remainingGoals}
          </span>
        </div>
      </div>
    </DashboardCard>
  );
}

export default RecoveryStatistics;