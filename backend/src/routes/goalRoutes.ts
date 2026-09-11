import { Router } from "express";
import {
    createGoalController,
    getGoalsController,
    getGoalByIdController,
    updateGoalController,
    deleteGoalController,
  } from "../controllers/goalController";

import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createGoalController);

router.get("/", authenticate, getGoalsController);

router.get("/:id", authenticate, getGoalByIdController);

router.patch("/:id", authenticate, updateGoalController);

router.delete("/:id", authenticate, deleteGoalController);

export default router;