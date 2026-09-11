import type { Goal } from "../../types/Goal";

type GoalCardProps = {
  goal: Goal;
};

const trackingLabels: Record<
  Goal["trackingType"],
  string
> = {
  checkin: "Daily check-ins",
  alcoholFree: "Alcohol-free days",
  noSmoking: "Smoke-free days",
  noDrugs: "Drug-free days",
  exercised: "Exercise days",
  drankWater: "Hydration days",
  sleptWell: "Good sleep days",
};

function GoalCard({
  goal,
}: GoalCardProps) {
  const percentage =
    goal.target <= 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (goal.progress /
              goal.target) *
              100
          )
        );

  return (
    <div className="rounded-3xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">
            🎯 {goal.title}
          </h2>

          {goal.description && (
            <p className="mt-2 text-slate-500">
              {goal.description}
            </p>
          )}
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {goal.category}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Automatically tracked by
        </p>

        <p className="mt-1 font-semibold text-blue-900">
          {trackingLabels[
            goal.trackingType
          ]}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex justify-between text-sm">
          <span>Progress</span>

          <span className="font-semibold">
            {goal.progress} /{" "}
            {goal.target}
          </span>
        </div>

        <div className="h-3 rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <p className="mt-2 text-right text-sm font-semibold text-emerald-600">
          {percentage}%
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        {goal.dueDate ? (
          <p className="text-sm text-slate-500">
            Due:{" "}
            {new Date(
              goal.dueDate
            ).toLocaleDateString()}
          </p>
        ) : (
          <p className="text-sm text-slate-400">
            No due date
          </p>
        )}

        {goal.completed ? (
          <span className="rounded-xl bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
            ✓ Completed automatically
          </span>
        ) : (
          <span className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Active
          </span>
        )}
      </div>
    </div>
  );
}

export default GoalCard;