import express from "express";
import { learn } from "../controllers/learn.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, learn);

export default router;