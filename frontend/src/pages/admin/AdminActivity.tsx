import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../services/api";

type ActivityType =
  | "registration"
  | "checkin"
  | "goal"
  | "achievement"
  | "community_post"
  | "reaction";

type ActivityItem = {
  id: string;
  type: ActivityType;
  timestamp: string;
  user: {
    id: string;
    name: string;
    username?: string | null;
  };
  details: {
    emoji?: string;
    postContent?: string;
    postAuthor?: string;
    title?: string;
    goalTitle?: string;
    badge?: string;
    mood?: string;
    recoveryDate?: string;
    content?: string;
    postType?: string;
    reactions?: number;
    [key: string]: unknown;
  };
};

type ActivityResponse = {
  success: boolean;
  activity: ActivityItem[];
};

export default function AdminActivity() {
  const [activity, setActivity] = useState<ActivityItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] =
    useState<"all" | ActivityType>("all");

  useEffect(() => {
    async function loadActivity() {
      try {
        const token = localStorage.getItem(
          "recovery_plus_token"
        );

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/activity`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ActivityResponse =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            "Failed to load admin activity"
          );
        }

        setActivity(data.activity || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load activity"
        );
      } finally {
        setLoading(false);
      }
    }

    loadActivity();
  }, []);

  const filteredActivity = useMemo(() => {
    if (filter === "all") {
      return activity;
    }

    return activity.filter(
      (item) => item.type === filter
    );
  }, [activity, filter]);

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  function getIcon(type: ActivityType) {
    switch (type) {
      case "registration":
        return "👤";
      case "checkin":
        return "📝";
      case "goal":
        return "🎯";
      case "achievement":
        return "🏆";
      case "community_post":
        return "💬";
      case "reaction":
        return "👏";
      default:
        return "•";
    }
  }

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <div className="spinner-border" />
          <p className="mt-3 text-muted">
            Loading activity...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
        <div>
          <h2 className="mb-1">Activity</h2>
          <p className="text-muted mb-0">
            Recent activity across Recovery+.
          </p>
        </div>

        <select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={filter}
          onChange={(event) =>
            setFilter(
              event.target.value as
                | "all"
                | ActivityType
            )
          }
        >
          <option value="all">All activity</option>
          <option value="registration">
            Registrations
          </option>
          <option value="checkin">Check-ins</option>
          <option value="goal">Goals</option>
          <option value="achievement">
            Achievements
          </option>
          <option value="community_post">
            Community posts
          </option>
          <option value="reaction">Reactions</option>
        </select>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {filteredActivity.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No activity found.
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredActivity.map((item) => (
                <div
                  key={item.id}
                  className="list-group-item px-0 py-3"
                >
                  <div className="d-flex gap-3">
                    <div
                      className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                      style={{
                        width: 44,
                        height: 44,
                        minWidth: 44,
                      }}
                    >
                      {getIcon(item.type)}
                    </div>

                    <div className="flex-grow-1">
                      <div className="d-flex flex-wrap justify-content-between gap-2">
                        <strong>
                          {item.user.name || "R+user"}
                        </strong>

                        <small className="text-muted">
                          {formatDate(item.timestamp)}
                        </small>
                      </div>

                      <div className="text-muted small text-capitalize">
                        {item.type.replace("_", " ")}
                      </div>

                      <div className="mt-1">
                        {item.type === "registration" &&
                          "Joined Recovery+."}

                        {item.type === "checkin" &&
                          `Completed a recovery check-in${
                            item.details.mood
                              ? ` with mood: ${item.details.mood}`
                              : ""
                          }.`}

                        {item.type === "goal" &&
                          `Goal activity${
                            item.details.goalTitle
                              ? `: ${item.details.goalTitle}`
                              : ""
                          }.`}

                        {item.type === "achievement" &&
                          `Earned ${
                            item.details.badge ||
                            "an achievement"
                          }.`}

                        {item.type ===
                          "community_post" &&
                          (item.details.content ||
                            item.details.postContent ||
                            "Created a community post.")}

                        {item.type === "reaction" &&
                          `${
                            item.details.emoji || "👏"
                          } reacted to a community post.`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
