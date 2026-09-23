import { API_BASE_URL } from "../../services/api";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  communityUsername: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;

  _count: {
    checkIns: number;
    goals: number;
    achievements: number;
    posts: number;
    reactions: number;
  };
};

function getRoleBadgeClass(role: User["role"]) {
  switch (role) {
    case "SUPER_ADMIN":
      return "bg-danger";

    case "ADMIN":
      return "bg-warning text-dark";

    default:
      return "bg-secondary";
  }
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem(
        "recovery_plus_token"
      );

      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load users"
        );
      }

      setUsers(data.users);
    } catch (err) {
      console.error("Admin users error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load users"
      );
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    return (
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchValue) ||
      user.email
        .toLowerCase()
        .includes(searchValue) ||
      (user.communityUsername || "")
        .toLowerCase()
        .includes(searchValue) ||
      user.role
        .toLowerCase()
        .includes(searchValue)
    );
  });

  return (
    <div className="admin-shell">
      <div className="admin-main">
        <div className="admin-topbar">
          <div>
            <h1 className="h4 mb-1 fw-bold">
              Users
            </h1>

            <p className="text-muted mb-0">
              View and monitor Recovery+ users
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-dark border">
              {users.length} users
            </span>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={loadUsers}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "↻ Refresh"}
            </button>
          </div>
        </div>

        <div className="admin-content">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mb-4">
                <div>
                  <h2 className="h5 fw-bold mb-1">
                    Registered Users
                  </h2>

                  <p className="text-muted small mb-0">
                    User activity and recovery statistics
                  </p>
                </div>

                <div style={{ maxWidth: "360px", width: "100%" }}>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search name, email, username or role..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-danger">
                  <strong>Error:</strong> {error}
                </div>
              )}

              {loading ? (
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
                    Loading users...
                  </p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <div className="display-6 mb-3">
                    👥
                  </div>

                  <h3 className="h5">
                    No users found
                  </h3>

                  <p className="text-muted mb-0">
                    Try a different search term.
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Check-ins</th>
                        <th>Goals</th>
                        <th>Achievements</th>
                        <th>Posts</th>
                        <th>Joined</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: "42px",
                                  height: "42px",
                                  flexShrink: 0,
                                }}
                              >
                                {user.firstName
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <div className="fw-semibold">
                                  {user.firstName}{" "}
                                  {user.lastName}
                                </div>

                                <div className="small text-muted">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="text-muted">
                              {user.communityUsername ||
                                "—"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`badge ${getRoleBadgeClass(
                                user.role
                              )}`}
                            >
                              {user.role.replace(
                                "_",
                                " "
                              )}
                            </span>
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {user._count.checkIns}
                            </span>
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {user._count.goals}
                            </span>
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {user._count.achievements}
                            </span>
                          </td>

                          <td>
                            <span className="fw-semibold">
                              {user._count.posts}
                            </span>
                          </td>

                          <td>
                            <span className="small text-muted">
                              {new Date(
                                user.createdAt
                              ).toLocaleDateString()}
                            </span>
                          </td>

                          <td>
                            <Link
                              to={`/admin/users/${user.id}`}
                              className="btn btn-sm btn-outline-success"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading &&
                filteredUsers.length > 0 && (
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      Showing {filteredUsers.length} of{" "}
                      {users.length} users
                    </small>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUsers;
