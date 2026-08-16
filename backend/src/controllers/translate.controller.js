import { generateAIResponse } from "../services/ai.service.js";

async function translate(req, res) {
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
  } catch (error) {
    console.error("translate error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Translation failed. Please try again.",
    });
  }
}

export { translate };