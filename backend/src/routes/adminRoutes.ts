import { Router } from "express";

import {
    authenticate,
    requireAdmin,
    requireSuperAdmin,
  } from "../middleware/authMiddleware";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserOverview,
  getAdminActivity,
} from "../controllers/adminController";

import {
  getAdminAnalytics,
} from "../controllers/analyticsController";

import {
  getAdminCommunity,
} from "../controllers/adminCommunityController";

import {
  getAdminAchievements,
} from "../controllers/adminAchievementsController";

import {
    getAdminManagementUsers,
    updateUserRole,
  } from "../controllers/adminManagementController";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  requireAdmin,
  getAdminDashboard
);

router.get(
  "/users",
  authenticate,
  requireAdmin,
  getAdminUsers
);

router.get(
  "/users/:id",
  authenticate,
  requireAdmin,
  getAdminUserOverview
);

router.get(
  "/activity",
  authenticate,
  requireAdmin,
  getAdminActivity
);

router.get(
  "/analytics",
  authenticate,
  requireAdmin,
  getAdminAnalytics
);

router.get(
  "/community",
  authenticate,
  requireAdmin,
  getAdminCommunity
);

router.get(
  "/achievements",
  authenticate,
  requireAdmin,
  getAdminAchievements
);

router.get(
    "/management/users",
    authenticate,
    requireSuperAdmin,
    getAdminManagementUsers
  );
  
  router.patch(
    "/management/users/:id/role",
    authenticate,
    requireSuperAdmin,
    updateUserRole
  );

export default router;