import express from "express";
import { translate } from "../controllers/translate.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/", requireAuth, translate);

export default router;