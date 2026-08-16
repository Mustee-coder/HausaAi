import express from "express";
import {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
} from "../controllers/chat.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// All chat routes require a logged-in user
router.use(requireAuth);

router.post("/", sendMessage);
router.get("/conversations", getConversations);
router.get("/:conversationId", getConversationById);
router.delete("/:conversationId", deleteConversation);

export default router;
