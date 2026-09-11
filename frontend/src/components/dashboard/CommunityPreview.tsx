import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCommunityPosts,
  type CommunityPost,
} from "../../services/communityService";

function CommunityPreview() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState<
    CommunityPost[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCommunityPosts() {
      try {
        setError("");

        const communityPosts =
          await getCommunityPosts();

        setPosts(
          communityPosts.slice(0, 3)
        );
      } catch (err) {
        console.error(
          "Failed to load community preview:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load community"
        );
      } finally {
        setLoading(false);
      }
    }

    loadCommunityPosts();
  }, []);

  const getDisplayName = (
    post: CommunityPost
  ) => {
    if (post.user.communityUsername) {
      return `@${post.user.communityUsername}`;
    }

    return "Community Member";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString(
      undefined,
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  const getTotalReactions = (
    post: CommunityPost
  ) => {
    return post.reactions.length;
  };

  return (
    <section className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Community 🤝
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Connect, encourage, and celebrate
            recovery progress together.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/community")
          }
          className="rounded-xl bg-blue-900 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          View Community →
        </button>
      </div>

      {loading && (
        <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-500">
            Loading community updates...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading &&
        !error &&
        posts.length === 0 && (
          <div className="mt-5 rounded-2xl bg-slate-50 p-8 text-center">
            <div className="text-4xl">
              🌱
            </div>

            <h3 className="mt-3 font-semibold text-slate-800">
              The community is getting
              started
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Be one of the first to share
              your progress.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/community")
              }
              className="mt-4 rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Share an Update
            </button>
          </div>
        )}

      {!loading &&
        !error &&
        posts.length > 0 && (
          <div className="mt-5 space-y-4">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">
                      {getDisplayName(post)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {formatDate(
                        post.createdAt
                      )}
                    </p>
                  </div>

                  {post.type ===
                    "achievement" && (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                      🏆 Achievement
                    </span>
                  )}
                </div>

                {post.achievement && (
                  <div className="mt-3 rounded-xl bg-yellow-50 p-3">
                    <p className="text-sm font-semibold text-yellow-800">
                      🏆{" "}
                      {post.achievement.badge}
                    </p>
                  </div>
                )}

                <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {post.content}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    ❤️ 👏 💪 🎉{" "}
                    {getTotalReactions(post)}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        "/community"
                      )
                    }
                    className="text-sm font-semibold text-blue-900 hover:text-blue-700"
                  >
                    Join the conversation →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
    </section>
  );
}

export default CommunityPreview;
