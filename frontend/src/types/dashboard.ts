export interface DashboardUser{id:string;firstName:string;lastName:string;email:string;timezone:string;locale:string;language:string;createdAt:string}
export interface DashboardCheckIn{id:string;date:string;recoveryDate?:string;mood:string;stress:number;journal?:string|null;wins?:string|null}
export interface DashboardAchievement{id:string;badge:string;earnedAt:string}
export interface DashboardSummary{user:DashboardUser;recovery:{currentStreak:number;totalCheckIns:number;recoveryDays:number;recoveryScore:number;successRate:number;averageStress:number};goals:{total:number;completed:number;remaining:number};achievements:{total:number;items:DashboardAchievement[]};recentActivity:DashboardCheckIn[]}
