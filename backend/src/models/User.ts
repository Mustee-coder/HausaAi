import mongoose from "mongoose";
import bcrypt from "bcryptjs";

interface IUser {
  name: string;
  email: string;
  password: string;
  preferredLanguage: "ha" | "en";

  comparePassword(candidatePassword: string): Promise<boolean>;
}
const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    preferredLanguage: {
      type: String,
      enum: ["ha", "en"],
      default: "ha",
    },
  },
  {
    timestamps: true,
  }
);


userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
