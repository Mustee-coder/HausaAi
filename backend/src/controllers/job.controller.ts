import type { Request, Response } from "express";

import { generateAIResponse } from "../services/ai.service.js";

interface JobBody {
  message: string;
}

async function analyzeJob(
  req: Request<{}, {}, JobBody>,
  res: Response
) {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job description cannot be empty.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message:
          "Job description too long. Please shorten it.",
      });
    }

    const reply = await generateAIResponse(
      message,
      "job",
      []
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: unknown) {
    console.error("analyzeJob error:", error);

    return res.status(500).json({
      success: false,
      message:
        "AI service failed to analyze the job posting. Please try again.",
    });
  }
}

export { analyzeJob };