import { apiFetch, authHeaders } from "./api";

export type CommunityUser = {
  id: string;
  communityUsername: string | null;
};

export type CommunityAchievement = {
  id: string;
  badge: string;
  earnedAt: string;
};

export type CommunityReaction = {
  id: string;
  postId: string;
  userId: string;
  emoji: string;
  createdAt: string;
  user?: CommunityUser;
};

export type CommunityPost = {
  id: string;
  userId: string;
  type: string;
  content: string;
  achievementId: string | null;
  createdAt: string;
  user: CommunityUser;
  achievement: CommunityAchievement | null;
  reactions: CommunityReaction[];
};

export async function getCommunityPosts() {
  const r = await apiFetch<{
    success: boolean;
    posts: CommunityPost[];
  }>("/community/posts", {
    headers: authHeaders(),
  });

  return r.posts;
}

export async function createCommunityPost(
  content: string,
  type = "user",
) {
  const r = await apiFetch<{
    success: boolean;
    post: CommunityPost;
  }>("/community/posts", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      content,
      type,
    }),
  });

  return r.post;
}

export async function reactToCommunityPost(
  postId: string,
  emoji = "👏",
) {
  return apiFetch<{
    success: boolean;
    action: "added" | "changed" | "removed";
    reaction: CommunityReaction;
  }>(
    `/community/posts/${encodeURIComponent(postId)}/reactions`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ emoji }),
    },
  );
}
