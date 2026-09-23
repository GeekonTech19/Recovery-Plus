import { Request, Response } from "express";
import prisma from "../config/prisma";

export async function getAdminCommunity(
  _req: Request,
  res: Response
) {
  try {
    const [
      totalPosts,
      totalReactions,
      postsLast7Days,
      activeUsers,
      recentPosts,
    ] = await Promise.all([
      prisma.communityPost.count(),

      prisma.communityReaction.count(),

      prisma.communityPost.count({
        where: {
          createdAt: {
            gte: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ),
          },
        },
      }),

      prisma.user.count({
        where: {
          OR: [
            {
              posts: {
                some: {
                  createdAt: {
                    gte: new Date(
                      Date.now() -
                        30 * 24 * 60 * 60 * 1000
                    ),
                  },
                },
              },
            },
            {
              reactions: {
                some: {
                  createdAt: {
                    gte: new Date(
                      Date.now() -
                        30 * 24 * 60 * 60 * 1000
                    ),
                  },
                },
              },
            },
          ],
        },
      }),

      prisma.communityPost.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 50,
        select: {
          id: true,
          type: true,
          content: true,
          createdAt: true,

          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              communityUsername: true,
            },
          },

          reactions: {
            select: {
              id: true,
              emoji: true,
              createdAt: true,

              user: {
                select: {
                  communityUsername: true,
                },
              },
            },
          },
        },
      }),
    ]);

    const posts = recentPosts.map((post) => ({
      id: post.id,
      type: post.type,
      content: post.content,
      createdAt: post.createdAt,

      author: {
        id: post.user.id,
        name:
          `${post.user.firstName} ${post.user.lastName}`.trim(),
        username:
          post.user.communityUsername ||
          "R+user",
      },

      reactionCount: post.reactions.length,

      reactions: post.reactions.map((reaction) => ({
        id: reaction.id,
        emoji: reaction.emoji,
        createdAt: reaction.createdAt,
        username:
          reaction.user.communityUsername ||
          "R+user",
      })),
    }));

    return res.json({
      success: true,

      summary: {
        totalPosts,
        totalReactions,
        postsLast7Days,
        activeUsers,
      },

      posts,
    });
  } catch (error) {
    console.error(
      "Admin community error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load community administration data",
    });
  }
}