import { getAuthToken } from "./authService";

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

export function authHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token) throw new Error("Authentication required");
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  try { return JSON.parse(text) as T; }
  catch { throw new Error("The server returned an invalid response."); }
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const result = await readJson<T & { message?: string }>(response);
  if (!response.ok) throw new Error(result.message || `Request failed (${response.status})`);
  return result;
}
