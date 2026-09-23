import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../services/api";

type Reaction = {
  id: string;
  emoji: string;
  createdAt: string;
  username: string;
};

type CommunityPost = {
  id: string;
  type: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    username: string;
  };
  reactionCount: number;
  reactions: Reaction[];
};

type CommunityData = {
  success: boolean;
  summary: {
    totalPosts: number;
    totalReactions: number;
    postsLast7Days: number;
    activeUsers: number;
  };
  posts: CommunityPost[];
};

export default function AdminCommunity() {
  const [data, setData] =
    useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommunity() {
      try {
        const token = localStorage.getItem(
          "recovery_plus_token"
        );

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/community`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result: CommunityData =
          await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            "Failed to load community data"
          );
        }

        setData(result);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load community"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCommunity();
  }, []);

  if (loading) {
    return (
      <div className="container-fluid py-4 text-center">
        <div className="spinner-border" />
        <p className="mt-3 text-muted">
          Loading community...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-danger">
          {error || "Community data unavailable"}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2>Community</h2>
        <p className="text-muted">
          Monitor community activity and engagement.
        </p>
      </div>

      <div className="row g-3 mb-4">
        {[
          ["Total Posts", data.summary.totalPosts],
          [
            "Total Reactions",
            data.summary.totalReactions,
          ],
          [
            "Posts · 7 Days",
            data.summary.postsLast7Days,
          ],
          [
            "Active Users · 30 Days",
            data.summary.activeUsers,
          ],
        ].map(([label, value]) => (
          <div
            className="col-12 col-sm-6 col-lg-3"
            key={String(label)}
          >
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="small text-muted">
                  {label}
                </div>
                <div className="fs-3 fw-bold">
                  {value}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">
            Recent Community Posts
          </h5>

          {data.posts.length === 0 ? (
            <p className="text-muted mb-0">
              No community posts yet.
            </p>
          ) : (
            <div className="list-group list-group-flush">
              {data.posts.map((post) => (
                <div
                  className="list-group-item px-0 py-3"
                  key={post.id}
                >
                  <div className="d-flex justify-content-between gap-3">
                    <div>
                      <strong>
                        {post.author.username}
                      </strong>

                      <div className="small text-muted">
                        {post.author.name}
                      </div>
                    </div>

                    <small className="text-muted">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>

                  <p className="mt-3 mb-2">
                    {post.content}
                  </p>

                  <div className="small text-muted">
                    {post.type} · 👏{" "}
                    {post.reactionCount} reactions
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
