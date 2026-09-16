import type { Goal } from "../../types/Goal";

type GoalCardProps = {
  goal: Goal;
};

const trackingLabels: Record<Goal["trackingType"], string> = {
  checkin: "Daily check-ins",
  alcoholFree: "Alcohol-free days",
  noSmoking: "Smoke-free days",
  noDrugs: "Drug-free days",
  exercised: "Exercise days",
  drankWater: "Hydration days",
  sleptWell: "Good sleep days",
};

const trackingIcons: Record<Goal["trackingType"], string> = {
  checkin: "📋",
  alcoholFree: "🍺",
  noSmoking: "🚭",
  noDrugs: "💊",
  exercised: "🏃",
  drankWater: "💧",
  sleptWell: "😴",
};

function GoalCard({ goal }: GoalCardProps) {
  const percentage =
    goal.target <= 0
      ? 0
      : Math.min(
          100,
          Math.round((goal.progress / goal.target) * 100)
        );

  return (
    <div className="group rounded-3xl bg-white p-5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
            🎯
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-blue-900">
              {goal.title}
            </h2>

            {goal.description && (
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                {goal.description}
              </p>
            )}
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          {goal.category}
        </span>
      </div>

      {/* Automatic Tracking */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-slate-50 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
          {trackingIcons[goal.trackingType]}
        </span>

        <div>
          <p className="text-xs font-medium text-slate-500">
            Automatically tracked by
          </p>

          <p className="mt-0.5 text-sm font-bold text-blue-900">
            {trackingLabels[goal.trackingType]}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-600">
            Progress
          </span>

          <span className="text-sm font-bold text-slate-800">
            {goal.progress} / {goal.target}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Keep going
          </span>

          <span className="text-sm font-bold text-emerald-600">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {goal.dueDate ? (
          <p className="text-sm text-slate-500">
            �� Due{" "}
            {new Date(goal.dueDate).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            No due date
          </p>
        )}

        {goal.completed ? (
          <span className="rounded-xl bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">
            ✓ Completed automatically
          </span>
        ) : (
          <span className="rounded-xl bg-blue-100 px-4 py-2 text-xs font-bold text-blue-700">
            Active
          </span>
        )}
      </div>
    </div>
  );
}

export default GoalCard;
