import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

type AnalyticsSummary = {
  totalUsers: number;
  newUsers7Days: number;
  newUsers30Days: number;
  activeUsers30Days: number;
  totalCheckIns: number;
  checkIns7Days: number;
  totalGoals: number;
  completedGoals: number;
  pendingGoals: number;
  totalAchievements: number;
  totalCommunityPosts: number;
  communityReactions: number;
};

type TrendItem = {
  date: string;
  count: number;
};

type AnalyticsResponse = {
  success: boolean;
  summary: AnalyticsSummary;
  checkInTrend: TrendItem[];
  registrationTrend: TrendItem[];
  goals: {
    total: number;
    completed: number;
    pending: number;
  };
  community: {
    posts: number;
    reactions: number;
  };
};

export default function AdminAnalytics() {
  const [data, setData] =
    useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const token = localStorage.getItem(
          "recovery_plus_token"
        );

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/analytics`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result: AnalyticsResponse =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            "Failed to load analytics"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load analytics"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border" />
        <p className="mt-3 text-muted">
          Loading analytics...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error || "Analytics unavailable"}
        </div>
      </div>
    );
  }

  const { summary } = data;

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="mb-1">Analytics</h2>
        <p className="text-muted mb-0">
          Recovery+ usage and engagement trends.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Users", summary.totalUsers],
          [
            "New Users · 7 Days",
            summary.newUsers7Days,
          ],
          [
            "New Users · 30 Days",
            summary.newUsers30Days,
          ],
          [
            "Active Users · 30 Days",
            summary.activeUsers30Days,
          ],
          ["Total Check-ins", summary.totalCheckIns],
          [
            "Check-ins · 7 Days",
            summary.checkIns7Days,
          ],
          ["Total Goals", summary.totalGoals],
          [
            "Completed Goals",
            summary.completedGoals,
          ],
        ].map(([label, value]) => (
          <div
            className="col-12 col-sm-6 col-lg-3"
            key={String(label)}
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="small text-muted">
                  {label}
                </div>
                <div className="fs-3 fw-bold mt-1">
                  {value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Goals</h5>

              <div className="mb-3">
                <div className="d-flex justify-content-between">
                  <span>Completed</span>
                  <strong>
                    {data.goals.completed}
                  </strong>
                </div>

                <div className="progress mt-2">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${
                        data.goals.total
                          ? (data.goals.completed /
                              data.goals.total) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <span>Pending</span>
                <strong>{data.goals.pending}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h5>Community</h5>

              <div className="row g-3 mt-1">
                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Posts
                    </small>
                    <div className="fs-4 fw-bold">
                      {data.community.posts}
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Reactions
                    </small>
                    <div className="fs-4 fw-bold">
                      {data.community.reactions}
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="border rounded p-3">
                    <small className="text-muted">
                      Achievements earned
                    </small>
                    <div className="fs-4 fw-bold">
                      {summary.totalAchievements}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="mb-3">
            30-Day Check-in Trend
          </h5>

          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-ins</th>
                </tr>
              </thead>

              <tbody>
                {data.checkInTrend.map((item) => (
                  <tr key={item.date}>
                    <td>{item.date}</td>
                    <td>{item.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
