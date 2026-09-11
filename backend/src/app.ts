import express from "express"; import cors from "cors"; import authRoutes from "./routes/authRoutes"; import protectedRoutes from "./routes/protectedRoutes"; import dashboardRoutes from "./routes/dashboardRoutes"; import checkInRoutes from "./routes/checkInRoutes"; import goalRoutes from "./routes/goalRoutes"; import achievementRoutes from "./routes/achievementRoutes"; import userRoutes from "./routes/userRoutes"; import aiAssistantRoutes from "./routes/aiAssistantRoutes"; import communityRoutes from "./routes/communityRoutes"; import {env} from "./config/env";
const app=express();
app.use(cors({origin:(origin,callback)=>{if(!origin||env.CORS_ORIGINS.includes(origin))return callback(null,true);return callback(new Error("CORS origin not allowed"));},credentials:false}));
app.use(express.json({limit:"32kb"}));
app.get("/",(_req,res)=>res.json({success:true,message:"Recovery+ Backend API is running 🚀",version:"1.1.0"}));
app.use("/auth",authRoutes);app.use("/protected",protectedRoutes);app.use("/dashboard",dashboardRoutes);app.use("/checkins",checkInRoutes);app.use("/goals",goalRoutes);app.use("/achievements",achievementRoutes);app.use("/users",userRoutes);app.use("/ai-assistant",aiAssistantRoutes);app.use("/community",communityRoutes);
app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error(err);if(!res.headersSent)res.status(500).json({message:"Internal server error"});});
export default app;
