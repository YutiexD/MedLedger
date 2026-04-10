import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    walletAddress: {
      type: String,
    },
    role: {
      type: String,
      enum: ["PATIENT", "DOCTOR", "ADMIN"],
      default: "PATIENT",
    },
    specialization: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
