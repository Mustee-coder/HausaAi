import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "New conversation",
    },
    mode: {
      type: String,
      enum: ["chat", "translate", "job", "learn"],
      default: "chat",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
