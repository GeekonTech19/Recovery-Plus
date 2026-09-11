import type { CheckIn } from "../models/CheckIn";
import { apiFetch, authHeaders } from "./api";
export type CreateCheckInInput={mood:string;stress:number;alcoholFree:boolean;noSmoking:boolean;noDrugs:boolean;exercised:boolean;drankWater:boolean;sleptWell:boolean;journal?:string;challenge?:string;wins?:string};
type Response={message:string;checkIn:CheckIn;automatedGoals?:unknown};
export async function saveCheckIn(data:CreateCheckInInput){const result=await apiFetch<Response>("/checkins",{method:"POST",headers:authHeaders(),body:JSON.stringify(data)});return result.checkIn;}
export async function getCheckIns(){const result=await apiFetch<{checkIns:CheckIn[]}>("/checkins",{headers:authHeaders()});return result.checkIns;}
export async function getCheckInById(id:string){const result=await apiFetch<{checkIn:CheckIn}>(`/checkins/${encodeURIComponent(id)}`,{headers:authHeaders()});return result.checkIn;}
