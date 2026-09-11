import DashboardCard from "../DashboardCard";
import type { DashboardSummary } from "../../types/dashboard";

interface RecentActivityProps {
  dashboard: DashboardSummary;
}

function RecentActivity({
  dashboard,
}: RecentActivityProps) {
  const activities = dashboard.recentActivity;

  return (
    <DashboardCard title="📝 Recent Activity">
      {activities.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 p-6 text-center">
          <p className="text-slate-500">
            No recovery activity yet.
          </p>

          <p className="mt-2 text-sm text-slate-400">
            Complete your first check-in to see your
            activity here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-2xl bg-slate-50 p-5 transition hover:bg-slate-100"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-slate-800">
                    {activity.mood}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {new Date(
                      activity.date
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
                  Stress {activity.stress}/10
                </span>
              </div>

              {activity.journal && (
                <p className="mt-4 text-slate-600">
                  {activity.journal}
                </p>
              )}

              {activity.wins && (
                <div className="mt-3 rounded-xl bg-emerald-50 p-3">
                  <p className="text-sm font-medium text-emerald-700">
                    🎉 {activity.wins}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}

export default RecentActivity;