import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { API_BASE_URL } from "../../services/api";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  stats: {
    checkIns: number;
    goals: number;
    achievements: number;
    posts: number;
  };
};

type ManagementResponse = {
  success: boolean;
  users: ManagedUser[];
};

export default function AdminSettings() {
  const [users, setUsers] = useState<ManagedUser[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<
      "ALL" | "USER" | "ADMIN" | "SUPER_ADMIN"
    >("ALL");
  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  async function loadUsers() {
    try {
      const token = localStorage.getItem(
        "recovery_plus_token"
      );

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/management/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: ManagementResponse =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          "Unable to load account management data"
        );
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load account management data"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function updateRole(
    userId: string,
    role: "USER" | "ADMIN"
  ) {
    try {
      const token = localStorage.getItem(
        "recovery_plus_token"
      );

      if (!token) {
        throw new Error("Authentication required");
      }

      setUpdatingId(userId);

      const response = await fetch(
        `${API_BASE_URL}/admin/management/users/${userId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update role"
        );
      }

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? { ...user, role }
            : user
        )
      );
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update role"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term);

      const matchesRole =
        roleFilter === "ALL" ||
        user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const totalAdmins = users.filter(
    (user) => user.role === "ADMIN"
  ).length;

  const totalUsers = users.filter(
    (user) => user.role === "USER"
  ).length;

  const totalSuperAdmins = users.filter(
    (user) => user.role === "SUPER_ADMIN"
  ).length;

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border" />
        <p className="mt-3 text-muted">
          Loading administration settings...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Administration Settings</h2>

        <p className="text-muted mb-0">
          Manage Recovery+ administrator roles and
          account access.
        </p>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Regular Users
              </small>

              <div className="fs-3 fw-bold">
                {totalUsers}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Administrators
              </small>

              <div className="fs-3 fw-bold">
                {totalAdmins}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <small className="text-muted">
                Super Administrators
              </small>

              <div className="fs-3 fw-bold">
                {totalSuperAdmins}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap gap-2 mb-3">
            <input
              type="search"
              className="form-control"
              style={{ maxWidth: 350 }}
              placeholder="Search users..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            <select
              className="form-select"
              style={{ maxWidth: 200 }}
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | "ALL"
                    | "USER"
                    | "ADMIN"
                    | "SUPER_ADMIN"
                )
              }
            >
              <option value="ALL">All roles</option>
              <option value="USER">Users</option>
              <option value="ADMIN">Admins</option>
              <option value="SUPER_ADMIN">
                Super Admins
              </option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Activity</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.name}</strong>

                      <div className="small text-muted">
                        {user.username}
                      </div>
                    </td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={`badge ${
                          user.role === "SUPER_ADMIN"
                            ? "text-bg-dark"
                            : user.role === "ADMIN"
                            ? "text-bg-primary"
                            : "text-bg-secondary"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <small>
                        {user.stats.checkIns} check-ins ·{" "}
                        {user.stats.goals} goals ·{" "}
                        {user.stats.achievements} badges
                      </small>
                    </td>

                    <td>
                      {new Date(
                        user.createdAt
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      {user.role ===
                      "SUPER_ADMIN" ? (
                        <span className="text-muted small">
                          Protected
                        </span>
                      ) : user.role === "USER" ? (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary"
                          disabled={
                            updatingId === user.id
                          }
                          onClick={() =>
                            updateRole(
                              user.id,
                              "ADMIN"
                            )
                          }
                        >
                          {updatingId === user.id
                            ? "Updating..."
                            : "Make Admin"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          disabled={
                            updatingId === user.id
                          }
                          onClick={() =>
                            updateRole(
                              user.id,
                              "USER"
                            )
                          }
                        >
                          {updatingId === user.id
                            ? "Updating..."
                            : "Demote"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center text-muted py-4">
              No users match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
