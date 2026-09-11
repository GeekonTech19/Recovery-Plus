import type { DashboardSummary } from "../../types/dashboard";

type AchievementsProps = {
  dashboard: DashboardSummary;
};

const achievementDetails: Record<
  string,
  {
    icon: string;
    description: string;
  }
> = {
  "First Check-In": {
    icon: "🌱",
    description:
      "You completed your first recovery check-in.",
  },

  "3-Day Streak": {
    icon: "🔥",
    description:
      "You checked in for 3 consecutive days.",
  },

  "7-Day Streak": {
    icon: "🔥",
    description:
      "You checked in for 7 consecutive days.",
  },

  "14-Day Streak": {
    icon: "🔥",
    description:
      "You checked in for 14 consecutive days.",
  },

  "30-Day Streak": {
    icon: "🏆",
    description:
      "You checked in for 30 consecutive days.",
  },

  "10 Check-Ins": {
    icon: "📋",
    description:
      "You completed 10 recovery check-ins.",
  },

  "30 Check-Ins": {
    icon: "📋",
    description:
      "You completed 30 recovery check-ins.",
  },

  "First Goal": {
    icon: "🎯",
    description:
      "You created your first recovery goal.",
  },

  "First Goal Completed": {
    icon: "🏆",
    description:
      "You completed your first recovery goal.",
  },
};

function formatEarnedDate(
  earnedAt: string
) {
  const date = new Date(earnedAt);

  if (Number.isNaN(date.getTime())) {
    return "Recently earned";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function Achievements({
  dashboard,
}: AchievementsProps) {
  const achievements =
    dashboard.achievements.items;

  return (
    <section
      id="achievements"
      className="mt-6 rounded-3xl bg-white p-6 shadow-sm"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
            Recovery milestones
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-800">
            🏆 Achievements
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Celebrate the progress you are making.
          </p>
        </div>

        <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
          {dashboard.achievements.total}{" "}
          {dashboard.achievements.total === 1
            ? "Achievement"
            : "Achievements"}
        </div>
      </div>

      {achievements.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-center">
          <div className="text-4xl">🌱</div>

          <h3 className="mt-3 text-lg font-semibold text-slate-800">
            Your journey is just beginning
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Complete your first Daily Check-in
            or create a goal to start earning
            achievements.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {achievements.map(
            (achievement) => {
              const details =
                achievementDetails[
                  achievement.badge
                ] ?? {
                  icon: "🏅",
                  description:
                    "You earned a Recovery+ achievement.",
                };

              return (
                <div
                  key={achievement.id}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
                      {details.icon}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-800">
                        {achievement.badge}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {details.description}
                      </p>

                      <p className="mt-3 text-xs font-medium text-slate-400">
                        Earned{" "}
                        {formatEarnedDate(
                          achievement.earnedAt
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </section>
  );
}

export default Achievements;
