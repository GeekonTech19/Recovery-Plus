import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Welcome from "../pages/Welcome"; import Login from "../pages/Login"; import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard"; import DailyCheckIn from "../pages/DailyCheckIn"; import AIAssistant from "../pages/AIAssistant"; import Goals from "../pages/Goals"; import Community from "../pages/Community"; import Achievements from "../pages/Achievements"; import ProtectedRoute from "./ProtectedRoute";
export default function AppRoutes(){return <BrowserRouter><Routes>
<Route path="/" element={<Welcome/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/>
<Route element={<ProtectedRoute/>}><Route path="/dashboard" element={<Dashboard/>}/><Route path="/daily-checkin" element={<DailyCheckIn/>}/><Route path="/ai-assistant" element={<AIAssistant/>}/><Route path="/goals" element={<Goals/>}/><Route path="/community" element={<Community/>}/><Route path="/achievements" element={<Achievements/>}/></Route>
<Route path="*" element={<Navigate to="/" replace/>}/></Routes></BrowserRouter>}
