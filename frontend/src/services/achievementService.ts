import { apiFetch, authHeaders } from "./api";

import type {
  AchievementProgressResponse,
} from "../types/achievement";

export async function getAchievementProgress(): Promise<AchievementProgressResponse> {
  return apiFetch<AchievementProgressResponse>(
    "/achievements/progress",
    {
      headers: authHeaders(),
    }
  );
}
