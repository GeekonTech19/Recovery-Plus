export type GoalTrackingType =
  | "checkin"
  | "alcoholFree"
  | "noSmoking"
  | "noDrugs"
  | "exercised"
  | "drankWater"
  | "sleptWell";

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: string;
  target: number;
  progress: number;
  dueDate: string | null;
  trackingType: GoalTrackingType;
  completed: boolean;
  createdAt: string;
};