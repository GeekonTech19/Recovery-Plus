import { useEffect, useState } from "react";
import AppLayout from "../layouts/AppLayout";
import {
  createCommunityPost,
  getCommunityPosts,
  reactToCommunityPost,
  type CommunityPost,
} from "../services/communityService";

const REACTIONS = [
  { emoji: "👏", label: "Clap" },
  { emoji: "❤️", label: "Support" },
  { emoji: "💪", label: "Strength" },
  { emoji: "🙌", label: "Celebrate" },
] as const;

export default function Community() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setPosts(await getCommunityPosts());
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to load community posts",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function post() {
    if (!content.trim() || posting) return;

    try {
      setPosting(true);
      const p = await createCommunityPost(content);
      setPosts((x) => [p, ...x]);
      setContent("");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to create post",
      );
    } finally {
      setPosting(false);
    }
  }

  async function react(postId: string, emoji: string) {
    try {
      const result = await reactToCommunityPost(postId, emoji);

      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id !== postId) {
            return post;
          }

          if (result.action === "added") {
            return {
              ...post,
              reactions: [...post.reactions, result.reaction],
            };
          }

          if (result.action === "changed") {
            return {
              ...post,
              reactions: post.reactions.map((reaction) =>
                reaction.id === result.reaction.id
                  ? result.reaction
                  : reaction,
              ),
            };
          }

          return {
            ...post,
            reactions: post.reactions.filter(
              (reaction) => reaction.id !== result.reaction.id,
            ),
          };
        }),
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to react",
      );
    }
  }

  function getReactionCount(
    post: CommunityPost,
    emoji: string,
  ) {
    return post.reactions.filter(
      (reaction) => reaction.emoji === emoji,
    ).length;
  }

  return (
    <AppLayout>
      <main className="mx-auto max-w-3xl">
        <section className="mb-8 rounded-2xl bg-blue-900 p-6 text-white">
          <h1 className="text-3xl font-bold">
            Community 🤝
          </h1>

          <p className="mt-2 text-blue-100">
            Share progress, celebrate achievements and
            encourage one another.
          </p>
        </section>

        <section className="mb-6 rounded-2xl bg-white p-5 shadow">
          <h2 className="mb-3 text-lg font-semibold">
            Share with the community
          </h2>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Share a thought, progress update, or encouragement..."
            className="w-full resize-none rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500"
          />

          <div className="mt-3 flex justify-between">
            <span className="text-xs text-slate-500">
              {content.length}/2000
            </span>

            <button
              onClick={() => void post()}
              disabled={posting || !content.trim()}
              className="rounded-xl bg-blue-900 px-5 py-2.5 font-semibold text-white disabled:opacity-50"
            >
              {posting ? "Posting..." : "Share"}
            </button>
          </div>
        </section>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <div className="mb-4 flex justify-between">
          <h2 className="text-2xl font-bold">
            Community Timeline
          </h2>

          <button
            onClick={() => void load()}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
            Loading community...
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <div className="text-4xl">🌱</div>

            <p className="mt-3 text-slate-500">
              Be the first to share something with the community.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl bg-white p-5 shadow"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">
                      @{p.user.communityUsername ||
                        "Recovery+ member"}
                    </p>

                    <p className="text-xs text-slate-400">
                      {new Date(
                        p.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>

                  {p.achievement && (
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                      🏆 {p.achievement.badge}
                    </span>
                  )}
                </div>

                <p className="mt-4 whitespace-pre-wrap text-slate-700">
                  {p.content}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
                  {REACTIONS.map((reaction) => {
                    const count = getReactionCount(
                      p,
                      reaction.emoji,
                    );

                    return (
                      <button
                        key={reaction.emoji}
                        onClick={() =>
                          void react(
                            p.id,
                            reaction.emoji,
                          )
                        }
                        title={reaction.label}
                        className="rounded-full border px-4 py-2 text-sm transition hover:bg-slate-50"
                      >
                        {reaction.emoji}
                        {count > 0 && (
                          <span className="ml-1">
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </AppLayout>
  );
}
