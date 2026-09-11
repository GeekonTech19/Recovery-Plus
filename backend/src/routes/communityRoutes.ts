import { Router } from "express";

import { authenticate } from "../middleware/authMiddleware";

import {
  getPosts,
  createPost,
  reactToPost,
} from "../controllers/communityController";

const router = Router();

router.get(
  "/posts",
  authenticate,
  getPosts
);

router.post(
  "/posts",
  authenticate,
  createPost
);

router.post(
  "/posts/:postId/reactions",
  authenticate,
  reactToPost
);

export default router;