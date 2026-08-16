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
      maxlength: 100,
      trim: true,
    },

    mode: {
      type: String,
      enum: ["chat", "translate", "job", "learn"],
      default: "chat",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({
  userId: 1,
  updatedAt: -1,
});

export default mongoose.model("Conversation", conversationSchema);
