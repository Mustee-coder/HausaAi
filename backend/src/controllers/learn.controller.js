import { generateAIResponse } from "../services/ai.service.js";

/**
 * POST /api/learn
 * body: { message: string, history?: Array<{role, content}> }
 *
 * Unlike Translate/Job (fully stateless), Learn mode accepts history
 * so follow-up questions ("give me another example") keep tutoring context.
 * History is passed from the frontend directly — no DB persistence, same
 * pattern as before, just no longer hardcoded to [].
 */
async function learn(req, res) {
  try {
    const { message, history = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Learning topic cannot be empty.",
      });
    }

    if (message.length > 4000) {
      return res.status(400).json({
        success: false,
        message: "Learning topic too long. Please shorten it.",
      });
    }

    if (!Array.isArray(history)) {
      return res.status(400).json({
        success: false,
        message: "History must be an array.",
      });
    }

    const reply = await generateAIResponse(message.trim(), "learn", history);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("learn error:", error.message);

    return res.status(500).json({
      success: false,
      message: "AI service failed to generate the lesson.",
    });
  }
}

export { learn };
