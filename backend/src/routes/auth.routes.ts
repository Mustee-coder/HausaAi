import express from "express";

import {
  register,
  login,
  logout,
  getMe,
} from "../controllers/auth.controller.js";

import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAuth, getMe);

export default router;