import prisma from "../config/prisma";

const MAX_POST_LENGTH = 2000;

export const ALLOWED_REACTIONS = [
  "👏",
  "❤️",
  "💪",
  "🙌",
] as const;

export async function getCommunityPosts() {
  return prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          communityUsername: true,
        },
      },
      achievement: {
        select: {
          id: true,
          badge: true,
          earnedAt: true,
        },
      },
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              communityUsername: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
}

export async function createCommunityPost(data: {
  userId: string;
  content: string;
  type?: string;
}) {
  const content = data.content.trim();

  if (!content) {
    throw new Error("Post content cannot be empty");
  }

  if (content.length > MAX_POST_LENGTH) {
    throw new Error(
      `Post content cannot exceed ${MAX_POST_LENGTH} characters`,
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    select: { id: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.communityPost.create({
    data: {
      userId: data.userId,
      content,
      type: data.type === "user" ? "user" : "user",
    },
    include: {
      user: {
        select: {
          id: true,
          communityUsername: true,
        },
      },
      achievement: {
        select: {
          id: true,
          badge: true,
          earnedAt: true,
        },
      },
      reactions: true,
    },
  });
}

export async function createCommunityReaction(data: {
  userId: string;
  postId: string;
  emoji: string;
}) {
  const emoji = data.emoji.trim();

  if (!(ALLOWED_REACTIONS as readonly string[]).includes(emoji)) {
    throw new Error("Unsupported reaction");
  }

  const post = await prisma.communityPost.findUnique({
    where: { id: data.postId },
    select: { id: true },
  });

  if (!post) {
    throw new Error("Community post not found");
  }

  const existing = await prisma.communityReaction.findUnique({
    where: {
      postId_userId: {
        postId: data.postId,
        userId: data.userId,
      },
    },
  });

  if (existing) {
    if (existing.emoji === emoji) {
      await prisma.communityReaction.delete({
        where: { id: existing.id },
      });

      return {
        action: "removed" as const,
        reaction: existing,
      };
    }

    const reaction = await prisma.communityReaction.update({
      where: { id: existing.id },
      data: { emoji },
    });

    return {
      action: "changed" as const,
      reaction,
    };
  }

  const reaction = await prisma.communityReaction.create({
    data: {
      postId: data.postId,
      userId: data.userId,
      emoji,
    },
  });

  return {
    action: "added" as const,
    reaction,
  };
}
