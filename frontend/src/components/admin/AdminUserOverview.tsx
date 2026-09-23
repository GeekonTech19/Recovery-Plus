import { API_BASE_URL } from "../../services/api";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  communityUsername: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  language: string;
  locale: string;
  timezone: string;
};

type Statistics = {
  totalCheckIns: number;
  totalGoals: number;
  completedGoals: number;
  goalCompletionRate: number;
  totalAchievements: number;
  totalPosts: number;
  totalReactions: number;
};

type CheckIn = {
  id: string;
  date: string;
  recoveryDate: string;
  mood: string;
  stress: number;
  alcoholFree: boolean;
  noSmoking: boolean;
  noDrugs: boolean;
  exercised: boolean;
  drankWater: boolean;
  sleptWell: boolean;
  journal: string | null;
  challenge: string | null;
  wins: string | null;
};

type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  completed: boolean;
  progress: number;
  target: number;
  trackingType: string | null;
  dueDate: string | null;
  createdAt: string;
};

type Achievement = {
  id: string;
  badge: string;
  earnedAt: string;
};

type Post = {
  id: string;
  type: string;
  content: string;
  createdAt: string;
  _count: {
    reactions: number;
  };
};

function AdminUserOverview() {
  const { id } = useParams();

  const [user, setUser] = useState<User | null>(null);

  const [statistics, setStatistics] =
    useState<Statistics | null>(null);

  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);

  const [goals, setGoals] = useState<Goal[]>([]);

  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [posts, setPosts] = useState<Post[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadUserOverview(id);
    }
  }, [id]);

  async function loadUserOverview(userId: string) {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "recovery_plus_token"
      );

      if (!token) {
        throw new Error(
          "Authentication token not found"
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load user overview"
        );
      }

      setUser(data.user);
      setStatistics(data.statistics);
      setCheckIns(data.checkIns || []);
      setGoals(data.goals || []);
      setAchievements(data.achievements || []);
      setPosts(data.posts || []);
    } catch (err) {
      console.error(
        "Admin user overview error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load user overview"
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Loading state
   */
  if (loading) {
    return (
      <div className="admin-shell">
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1 className="h4 mb-1 fw-bold">
                User Overview
              </h1>

              <p className="text-muted mb-0">
                Recovery+ account and activity details
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Link
                to="/admin/users"
                className="btn btn-outline-secondary btn-sm"
              >
                ← Users
              </Link>

              <Link
                to="/admin"
                className="btn btn-success btn-sm"
              >
                📊 Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="admin-content">
            <div className="text-center py-5">
              <div
                className="spinner-border text-success"
                role="status"
              >
                <span className="visually-hidden">
                  Loading...
                </span>
              </div>

              <p className="text-muted mt-3 mb-0">
                Loading user information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Error / missing user state
   */
  if (error || !user || !statistics) {
    return (
      <div className="admin-shell">
        <div className="admin-main">
          <div className="admin-topbar">
            <div>
              <h1 className="h4 mb-1 fw-bold">
                User Overview
              </h1>

              <p className="text-muted mb-0">
                Recovery+ account and activity details
              </p>
            </div>

            <div className="d-flex align-items-center gap-2">
              <Link
                to="/admin/users"
                className="btn btn-outline-secondary btn-sm"
              >
                ← Users
              </Link>

              <Link
                to="/admin"
                className="btn btn-success btn-sm"
              >
                📊 Admin Dashboard
              </Link>
            </div>
          </div>

          <div className="admin-content">
            <div className="alert alert-danger">
              {error ||
                "User information unavailable"}
            </div>

            <Link
              to="/admin/users"
              className="btn btn-outline-success"
            >
              ← Back to Users
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /*
   * Main user overview
   */
  return (
    <div className="admin-shell">
      <div className="admin-main">

        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <h1 className="h4 mb-1 fw-bold">
              User Overview
            </h1>

            <p className="text-muted mb-0">
              Recovery+ account and activity details
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Link
              to="/admin/users"
              className="btn btn-outline-secondary btn-sm"
            >
              ← Users
            </Link>

            <Link
              to="/admin"
              className="btn btn-success btn-sm"
            >
              📊 Admin Dashboard
            </Link>
          </div>
        </div>

        <div className="admin-content">

          {/* User Profile */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">

                <div
                  className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                  style={{
                    width: "80px",
                    height: "80px",
                    fontSize: "30px",
                    flexShrink: 0,
                  }}
                >
                  {user.firstName
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="flex-grow-1">

                  <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                    <h2 className="h4 fw-bold mb-0">
                      {user.firstName}{" "}
                      {user.lastName}
                    </h2>

                    <span
                      className={`badge ${
                        user.role === "SUPER_ADMIN"
                          ? "bg-danger"
                          : user.role === "ADMIN"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {user.role.replace(
                        "_",
                        " "
                      )}
                    </span>
                  </div>

                  <p className="text-muted mb-1">
                    {user.email}
                  </p>

                  <p className="small text-muted mb-0">
                    {user.communityUsername ||
                      "No community username"}
                  </p>
                </div>

                <div className="text-md-end">
                  <div className="small text-muted">
                    Registered
                  </div>

                  <div className="fw-semibold">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString()}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="row g-3 mb-4">

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Check-ins
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.totalCheckIns}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Goals
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.totalGoals}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Completed Goals
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.completedGoals}
                  </div>

                  <small className="text-success">
                    {statistics.goalCompletionRate}%
                    completion
                  </small>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Achievements
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.totalAchievements}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Community Posts
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.totalPosts}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-6 col-lg-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className="text-muted small">
                    Reactions
                  </div>

                  <div className="fs-3 fw-bold">
                    {statistics.totalReactions}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Account Details */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              <h2 className="h5 fw-bold mb-3">
                Account Details
              </h2>

              <div className="row g-3">

                <div className="col-md-4">
                  <div className="small text-muted">
                    Language
                  </div>

                  <div className="fw-semibold">
                    {user.language}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="small text-muted">
                    Locale
                  </div>

                  <div className="fw-semibold">
                    {user.locale}
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="small text-muted">
                    Timezone
                  </div>

                  <div className="fw-semibold">
                    {user.timezone}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Check-ins */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h2 className="h5 fw-bold mb-1">
                    Recent Check-ins
                  </h2>

                  <p className="text-muted small mb-0">
                    Latest recovery activity
                  </p>
                </div>

                <span className="badge bg-light text-dark border">
                  {statistics.totalCheckIns} total
                </span>

              </div>

              {checkIns.length === 0 ? (
                <p className="text-muted mb-0">
                  No check-ins recorded yet.
                </p>
              ) : (
                <div className="table-responsive">

                  <table className="table align-middle">

                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Mood</th>
                        <th>Stress</th>
                        <th>Alcohol</th>
                        <th>Smoking</th>
                        <th>Drugs</th>
                        <th>Exercise</th>
                        <th>Water</th>
                        <th>Sleep</th>
                      </tr>
                    </thead>

                    <tbody>

                      {checkIns.map((checkIn) => (
                        <tr key={checkIn.id}>

                          <td>
                            {new Date(
                              checkIn.date
                            ).toLocaleDateString()}
                          </td>

                          <td>
                            {checkIn.mood}
                          </td>

                          <td>
                            {checkIn.stress}
                          </td>

                          <td>
                            {checkIn.alcoholFree
                              ? "✓"
                              : "—"}
                          </td>

                          <td>
                            {checkIn.noSmoking
                              ? "✓"
                              : "—"}
                          </td>

                          <td>
                            {checkIn.noDrugs
                              ? "✓"
                              : "—"}
                          </td>

                          <td>
                            {checkIn.exercised
                              ? "✓"
                              : "—"}
                          </td>

                          <td>
                            {checkIn.drankWater
                              ? "✓"
                              : "—"}
                          </td>

                          <td>
                            {checkIn.sleptWell
                              ? "✓"
                              : "—"}
                          </td>

                        </tr>
                      ))}

                    </tbody>

                  </table>

                </div>
              )}

            </div>
          </div>

          {/* Goals */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              <h2 className="h5 fw-bold mb-3">
                Goals
              </h2>

              {goals.length === 0 ? (
                <p className="text-muted mb-0">
                  No goals created yet.
                </p>
              ) : (
                <div className="row g-3">

                  {goals.map((goal) => {

                    const percentage =
                      goal.target > 0
                        ? Math.min(
                            100,
                            Math.round(
                              (goal.progress /
                                goal.target) *
                                100
                            )
                          )
                        : 0;

                    return (
                      <div
                        key={goal.id}
                        className="col-md-6"
                      >

                        <div className="border rounded-3 p-3 h-100">

                          <div className="d-flex justify-content-between gap-3">

                            <div>

                              <h3 className="h6 fw-bold mb-1">
                                {goal.title}
                              </h3>

                              <div className="small text-muted">
                                {goal.category}
                              </div>

                            </div>

                            {goal.completed && (
                              <span className="badge bg-success">
                                Completed
                              </span>
                            )}

                          </div>

                          {goal.description && (
                            <p className="small text-muted mt-3 mb-2">
                              {goal.description}
                            </p>
                          )}

                          <div className="progress mb-2">

                            <div
                              className="progress-bar bg-success"
                              role="progressbar"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                          <div className="d-flex justify-content-between small text-muted">

                            <span>
                              {goal.progress} /{" "}
                              {goal.target}
                            </span>

                            <span>
                              {percentage}%
                            </span>

                          </div>

                          {goal.dueDate && (
                            <div className="small text-muted mt-2">
                              Due:{" "}
                              {new Date(
                                goal.dueDate
                              ).toLocaleDateString()}
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          </div>

          {/* Achievements */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              <h2 className="h5 fw-bold mb-3">
                Achievements
              </h2>

              {achievements.length === 0 ? (
                <p className="text-muted mb-0">
                  No achievements earned yet.
                </p>
              ) : (
                <div className="row g-3">

                  {achievements.map(
                    (achievement) => (
                      <div
                        key={achievement.id}
                        className="col-md-4"
                      >

                        <div className="border rounded-3 p-3">

                          <div className="fs-3 mb-2">
                            🏆
                          </div>

                          <div className="fw-semibold">
                            {achievement.badge}
                          </div>

                          <div className="small text-muted">
                            Earned{" "}
                            {new Date(
                              achievement.earnedAt
                            ).toLocaleDateString()}
                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

            </div>
          </div>

          {/* Community Activity */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">

              <div className="d-flex justify-content-between align-items-center mb-3">

                <div>
                  <h2 className="h5 fw-bold mb-1">
                    Community Activity
                  </h2>

                  <p className="text-muted small mb-0">
                    Recent community posts
                  </p>
                </div>

                <span className="badge bg-light text-dark border">
                  {statistics.totalPosts} posts
                </span>

              </div>

              {posts.length === 0 ? (
                <p className="text-muted mb-0">
                  No community posts yet.
                </p>
              ) : (
                <div className="d-flex flex-column gap-3">

                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="border rounded-3 p-3"
                    >

                      <div className="d-flex justify-content-between gap-3 mb-2">

                        <span className="badge bg-light text-dark border">
                          {post.type}
                        </span>

                        <small className="text-muted">
                          {new Date(
                            post.createdAt
                          ).toLocaleDateString()}
                        </small>

                      </div>

                      <p className="mb-2">
                        {post.content}
                      </p>

                      <small className="text-muted">
                        👏{" "}
                        {post._count.reactions}{" "}
                        reactions
                      </small>

                    </div>
                  ))}

                </div>
              )}

            </div>
          </div>

          {/* Bottom navigation */}
          <div className="d-flex justify-content-between align-items-center pb-4">

            <Link
              to="/admin/users"
              className="btn btn-outline-success"
            >
              ← Back to Users
            </Link>

            <Link
              to="/admin"
              className="btn btn-success"
            >
              📊 Admin Dashboard
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
}

export default AdminUserOverview;
