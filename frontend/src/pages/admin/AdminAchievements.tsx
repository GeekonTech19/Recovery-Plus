import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

type RecentAchievement = {
  id: string;
  badge: string;
  earnedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
  };
};

type BadgeBreakdown = {
  badge: string;
  count: number;
};

type AchievementData = {
  success: boolean;
  summary: {
    totalAchievements: number;
    usersWithAchievements: number;
  };
  badgeBreakdown: BadgeBreakdown[];
  recent: RecentAchievement[];
};

export default function AdminAchievements() {
  const [data, setData] =
    useState<AchievementData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAchievements() {
      try {
        const token = localStorage.getItem(
          "recovery_plus_token"
        );

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/achievements`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result: AchievementData =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            "Failed to load achievements"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load achievements"
        );
      } finally {
        setLoading(false);
      }
    }

    loadAchievements();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border" />
        <p className="mt-3 text-muted">
          Loading achievements...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error || "Achievement data unavailable"}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Achievements</h2>
        <p className="text-muted">
          Track recovery milestones earned by users.
        </p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="small text-muted">
                Total Achievements
              </div>

              <div className="fs-2 fw-bold">
                {data.summary.totalAchievements}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="small text-muted">
                Users With Achievements
              </div>

              <div className="fs-2 fw-bold">
                {data.summary.usersWithAchievements}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">
                Badge Breakdown
              </h5>

              {data.badgeBreakdown.length === 0 ? (
                <p className="text-muted">
                  No achievements earned yet.
                </p>
              ) : (
                <div className="list-group list-group-flush">
                  {data.badgeBreakdown.map((badge) => (
                    <div
                      className="list-group-item px-0 d-flex justify-content-between"
                      key={badge.badge}
                    >
                      <span>
                        🏆 {badge.badge}
                      </span>
                      <strong>{badge.count}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">
                Recently Earned
              </h5>

              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Badge</th>
                      <th>Earned</th>
                    </tr>
                  </thead>

                  <tbody>
                    {data.recent.map((achievement) => (
                      <tr key={achievement.id}>
                        <td>
                          <strong>
                            {achievement.user.username}
                          </strong>

                          <div className="small text-muted">
                            {achievement.user.name}
                          </div>
                        </td>

                        <td>
                          🏆 {achievement.badge}
                        </td>

                        <td>
                          {new Date(
                            achievement.earnedAt
                          ).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {data.recent.length === 0 && (
                <p className="text-muted">
                  No recent achievements.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
