import dotenv from "dotenv"; dotenv.config();
const isProduction=(process.env.NODE_ENV||"development")==="production";
const jwtSecret=process.env.JWT_SECRET?.trim(); const databaseUrl=process.env.DATABASE_URL?.trim();
if(isProduction&&!jwtSecret)throw new Error("JWT_SECRET is required in production");
if(!databaseUrl)throw new Error("DATABASE_URL is required");
export const env={PORT:Number(process.env.PORT)||5000,NODE_ENV:process.env.NODE_ENV||"development",JWT_SECRET:jwtSecret||"local-development-secret-change-me",DATABASE_URL:databaseUrl,OPENAI_API_KEY:process.env.OPENAI_API_KEY?.trim()||"",OPENAI_MODEL:process.env.OPENAI_MODEL?.trim()||"gpt-5.6-luna",CORS_ORIGINS:(process.env.CORS_ORIGINS||"http://localhost:5173").split(",").map(v=>v.trim()).filter(Boolean),AI_RATE_LIMIT_WINDOW_MS:Number(process.env.AI_RATE_LIMIT_WINDOW_MS)||60000,AI_RATE_LIMIT_MAX:Number(process.env.AI_RATE_LIMIT_MAX)||20};
