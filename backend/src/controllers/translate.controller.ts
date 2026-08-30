import type { Request, Response } from "express";
import { generateAIResponse } from "../services/ai.service.js";

interface TranslateRequestBody {
  message: string;
}

async function translate(
  req: Request<{}, {}, TranslateRequestBody>,
  res: Response
) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Text cannot be empty.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Text too long.",
      });
    }

    const reply = await generateAIResponse(
      message.trim(),
      "translate",
      []
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        "translate error:",
        error.message
      );
    } else {
      console.error(
        "translate error:",
        error
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Translation failed. Please try again.",
    });
  }
}

export { translate };