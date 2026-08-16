import { generateAIResponse } from "../services/ai.service.js";

/**
 * POST /api/job
 * body: { message: string }
 *
 * Stateless — each request is a fresh job-post analysis.
 * The "job" mode prompt in ai.service.js enforces strict no-hallucination
 * rules (only extract what's explicitly in the posting).
 */
async function analyzeJob(req, res) {
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
        message: "Job description too long. Please shorten it.",
      });
    }

    const reply = await generateAIResponse(message, "job", []);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("analyzeJob error:", error.message);
    return res.status(500).json({
      success: false,
      message: "AI service failed to analyze the job posting. Please try again.",
    });
  }
}

export { analyzeJob };
