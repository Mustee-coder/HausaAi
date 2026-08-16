import express from "express";
import { analyzeJob } from "../controllers/job.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, analyzeJob);

export default router;
