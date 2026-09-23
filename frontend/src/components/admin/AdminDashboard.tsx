import { API_BASE_URL } from "../../services/api";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminStatCard from "../../components/admin/AdminStatCard";

type DashboardData = {
  statistics: {
    totalUsers: number;
    totalCheckIns: number;
    totalGoals: number;
    completedGoals: number;
    totalAchievements: number;
    totalCommunityPosts: number;
  };

  recentUsers: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    communityUsername: string | null;
    role: string;
    createdAt: string;
  }[];

  recentCheckIns: {
    id: string;
    date: string;
    mood: number | null;
    stress: number | null;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      communityUsername: string | null;
    };
  }[];
};

export default function AdminDashboard() {
  const [data, setData] =
    useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem(
          "recovery_plus_token"
        );

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message || "Unable to load dashboard"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <div className="container-fluid">
        <div className="mb-4">
          <h1 className="fw-bold mb-1">
            Admin Dashboard
          </h1>

          <p className="text-muted mb-0">
            Monitor Recovery+ activity and platform growth.
          </p>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              role="status"
            >
              <span className="visually-hidden">
                Loading...
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {data && (
          <>
            <div className="row g-4 mb-4">
              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Total Users"
                  value={data.statistics.totalUsers}
                  icon="👥"
                  description="Registered accounts"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Check-ins"
                  value={data.statistics.totalCheckIns}
                  icon="📝"
                  description="Recovery check-ins"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Goals"
                  value={data.statistics.totalGoals}
                  icon="🎯"
                  description="Goals created"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Completed Goals"
                  value={data.statistics.completedGoals}
                  icon="✅"
                  description="Goals completed"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Achievements"
                  value={data.statistics.totalAchievements}
                  icon="🏆"
                  description="Achievements earned"
                />
              </div>

              <div className="col-12 col-sm-6 col-xl-4">
                <AdminStatCard
                  title="Community Posts"
                  value={data.statistics.totalCommunityPosts}
                  icon="💬"
                  description="Published posts"
                />
              </div>
            </div>

            <div className="row g-4">
              <div className="col-12 col-xl-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">
                          Recent Users
                        </h5>

                        <small className="text-muted">
                          Latest registrations
                        </small>
                      </div>

                      <span className="badge text-bg-light">
                        {data.recentUsers.length}
                      </span>
                    </div>

                    {data.recentUsers.length === 0 ? (
                      <p className="text-muted mb-0">
                        No users yet.
                      </p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {data.recentUsers.map((user) => (
                          <div
                            key={user.id}
                            className="list-group-item px-0"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <div className="fw-semibold">
                                  {user.firstName}{" "}
                                  {user.lastName}
                                </div>

                                <small className="text-muted">
                                  {user.email}
                                </small>
                              </div>

                              <span className="badge rounded-pill text-bg-light">
                                {user.role}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-6">
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h5 className="fw-bold mb-1">
                          Recent Check-ins
                        </h5>

                        <small className="text-muted">
                          Latest recovery activity
                        </small>
                      </div>

                      <span className="badge text-bg-light">
                        {data.recentCheckIns.length}
                      </span>
                    </div>

                    {data.recentCheckIns.length === 0 ? (
                      <p className="text-muted mb-0">
                        No check-ins yet.
                      </p>
                    ) : (
                      <div className="list-group list-group-flush">
                        {data.recentCheckIns.map(
                          (checkIn) => (
                            <div
                              key={checkIn.id}
                              className="list-group-item px-0"
                            >
                              <div>
                                <div className="fw-semibold">
                                  {checkIn.user.firstName}{" "}
                                  {checkIn.user.lastName}
                                </div>

                                <small className="text-muted">
                                  {new Date(
                                    checkIn.date
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
