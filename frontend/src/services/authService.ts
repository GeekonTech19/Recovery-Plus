import { API_BASE_URL, readJson } from "./api";

export type AuthUser = { id:string; firstName:string; lastName:string; email:string; createdAt:string };
type RegisterInput = { firstName:string; lastName:string; email:string; password:string };
type LoginInput = { email:string; password:string };
type RegisterResponse = { message:string; user:AuthUser };
type LoginResponse = { message:string; token:string; user:AuthUser };

const TOKEN_KEY="recovery_plus_token";
const USER_KEY="recovery_plus_user";
const SESSION_TOKEN_KEY="recovery_plus_session_token";
const SESSION_USER_KEY="recovery_plus_session_user";

export async function registerUser(data:RegisterInput):Promise<RegisterResponse>{
 const response=await fetch(`${API_BASE_URL}/auth/register`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const result=await readJson<RegisterResponse & {message?:string}>(response);
 if(!response.ok) throw new Error(result.message||"Unable to create account");
 return result;
}

export async function loginUser(data:LoginInput, rememberMe=true):Promise<LoginResponse>{
 const response=await fetch(`${API_BASE_URL}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 const result=await readJson<LoginResponse & {message?:string}>(response);
 if(!response.ok) throw new Error(result.message||"Invalid email or password");
 logoutUser();
 const tokenKey=rememberMe?TOKEN_KEY:SESSION_TOKEN_KEY;
 const userKey=rememberMe?USER_KEY:SESSION_USER_KEY;
 localStorage.setItem(tokenKey,result.token);
 localStorage.setItem(userKey,JSON.stringify(result.user));
 return result;
}
export function getAuthToken(){return localStorage.getItem(TOKEN_KEY)||sessionStorage.getItem(SESSION_TOKEN_KEY);}
export function getCurrentUser():AuthUser|null{
 const raw=localStorage.getItem(USER_KEY)||sessionStorage.getItem(SESSION_USER_KEY); if(!raw)return null;
 try{return JSON.parse(raw) as AuthUser;}catch{return null;}
}
export function logoutUser(){[TOKEN_KEY,USER_KEY].forEach(k=>localStorage.removeItem(k));[SESSION_TOKEN_KEY,SESSION_USER_KEY].forEach(k=>sessionStorage.removeItem(k));}
export function isAuthenticated(){return Boolean(getAuthToken());}
