import { apiFetch, authHeaders } from "./api";
export type AIResponse={success:boolean;response:string;provider:"openai"|"local";context:{recentCheckIns:number;goals:number;achievements:number}};
export async function sendAIMessage(message:string){if(message.trim().length<1)throw new Error("Message is required");return apiFetch<AIResponse>("/ai-assistant",{method:"POST",headers:authHeaders(),body:JSON.stringify({message})});}
