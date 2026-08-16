import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 4000, // basic guard against abuse / runaway tokens
    },
    language: {
      type: String,
      enum: ["ha", "en"],
      default: "ha",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
