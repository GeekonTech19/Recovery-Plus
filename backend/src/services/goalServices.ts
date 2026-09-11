import prisma from "../config/prisma";
import { createAchievement } from "./achievementService";

export async function createGoal(data: {
  userId: string;
  title: string;
  description?: string;
  category?: string;
  target?: number;
  dueDate?: Date;
  trackingType?: string;
}) {
  const goal = await prisma.goal.create({
    data: {
      userId: data.userId,
      title: data.title,
      description: data.description || "",
      category: data.category || "General",
      target: data.target || 1,
      dueDate: data.dueDate,
      trackingType: data.trackingType,
    },
  });

  const goalCount = await prisma.goal.count({
    where: {
      userId: data.userId,
    },
  });

  if (goalCount === 1) {
    await createAchievement({
      userId: data.userId,
      badge: "First Goal",
    });
  }

  return goal;
}

export function getGoals(userId: string) {
  return prisma.goal.findMany({
    where: { userId },
    orderBy: [
      { completed: "asc" },
      { createdAt: "desc" },
    ],
  });
}

export async function getGoalById(
  id: string,
  userId: string
) {
  const goal = await prisma.goal.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!goal) {
    throw new Error("Goal not found");
  }

  return goal;
}

export async function updateGoal(
  id: string,
  userId: string,
  data: Record<string, unknown>
) {
  await getGoalById(id, userId);

  return prisma.goal.update({
    where: { id },
    data,
  });
}

export async function deleteGoal(
  id: string,
  userId: string
) {
  await getGoalById(id, userId);

  await prisma.goal.delete({
    where: { id },
  });
}
