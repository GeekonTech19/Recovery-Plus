import { apiFetch, authHeaders } from "./api";
export type UserPreferences={timezone:string;locale:string;language:string};
export async function updateUserPreferences(data:Partial<UserPreferences>){const r=await apiFetch<{user:UserPreferences}>("/users/preferences",{method:"PUT",headers:authHeaders(),body:JSON.stringify(data)});return r.user;}
