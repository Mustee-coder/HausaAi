import mongoose from "mongoose";

interface IMessage {
  conversationId: mongoose.Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  language: "ha" | "en";
}

const messageSchema = new mongoose.Schema<IMessage>(
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
      maxlength: 4000,
    },

    language: {
      type: String,
      enum: ["ha", "en"],
      default: "ha",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IMessage>(
  "Message",
  messageSchema
);