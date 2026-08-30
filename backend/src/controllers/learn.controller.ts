import type { Request, Response } from "express";
import { generateAIResponse } from "../services/ai.service.js";

interface LearnMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface LearnRequestBody {
  message: string;
  history?: LearnMessage[];
}

/**
 * POST /api/learn
 *
 * body:
 * {
 *   message: string;
 *   history?: Array<{
 *     role: "system" | "user" | "assistant";
 *     content: string;
 *   }>;
 * }
 *
 * Learn mode accepts history so follow-up questions
 * can keep the tutoring context.
 */
async function learn(
  req: Request<{}, {}, LearnRequestBody>,
  res: Response
) {
  try {
    const {
      message,
      history = [],
    } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "Learning topic cannot be empty.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message:
          "Learning topic too long. Please shorten it.",
      });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message:
          "History must be an array.",
      });
    }

    const reply = await generateAIResponse(
      message.trim(),
      "learn",
      history
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "learn error:",
        error.message
      );
    } else {
      console.error(
        "learn error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "AI service failed to generate the lesson.",
    });
  }
}

export { learn };