import type { Request, Response } from "express";

import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { generateAIResponse } from "../services/ai.service.js";

interface ChatRequestBody {
  message: string;
  conversationId?: string;
}

interface ConversationParams {
  conversationId: string;
}

// POST /api/chat
// body: { message: string, conversationId?: string }

async function sendMessage(
  req: Request<{}, {}, ChatRequestBody>,
  res: Response
) {
  try {
    const { message, conversationId } = req.body;

    // requireAuth guarantees that user exists at runtime.
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Message too long.",
      });
    }

    let conversation;

    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }
    } else {
      conversation = await Conversation.create({
        userId,
        mode: "chat",
        title: message.slice(0, 40),
      });
    }

    const priorMessages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: -1 })
      .limit(10);

    const history = priorMessages
      .reverse()
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    await Message.create({
      conversationId: conversation._id,
      role: "user",
      content: message,
    });

    const reply = await generateAIResponse(
      message.trim(),
      "chat",
      history
    );

    await Message.create({
      conversationId: conversation._id,
      role: "assistant",
      content: reply,
    });

    return res.status(200).json({
      success: true,
      conversationId: conversation._id,
      reply,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "sendMessage error:",
        error.message
      );
    } else {
      console.error(
        "sendMessage error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Something went wrong. Please try again.",
    });
  }
}

// GET /api/chat/conversations

async function getConversations(
  req: Request,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    const conversations =
      await Conversation.find({
        userId,
      }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "getConversations error:",
        error.message
      );
    } else {
      console.error(
        "getConversations error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Could not fetch conversations.",
    });
  }
}

// GET /api/chat/:conversationId

async function getConversationById(
  req: Request<ConversationParams>,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    const { conversationId } = req.params;

    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        userId,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const messages = await Message.find({
      conversationId,
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      conversation,
      messages,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "getConversationById error:",
        error.message
      );
    } else {
      console.error(
        "getConversationById error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Could not fetch conversation.",
    });
  }
}

// DELETE /api/chat/:conversationId

async function deleteConversation(
  req: Request<ConversationParams>,
  res: Response
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    const { conversationId } = req.params;

    const conversation =
      await Conversation.findOneAndDelete({
        _id: conversationId,
        userId,
      });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await Message.deleteMany({
      conversationId,
    });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted.",
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "deleteConversation error:",
        error.message
      );
    } else {
      console.error(
        "deleteConversation error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Could not delete conversation.",
    });
  }
}

export {
  sendMessage,
  getConversations,
  getConversationById,
  deleteConversation,
};