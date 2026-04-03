import mongoose from "mongoose";

const SlotSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["AVAILABLE", "BOOKED", "CANCELLED"],
      default: "AVAILABLE",
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    txHash: {
      type: String, // Tracking the on-chain lock transaction in Phase 4
    },
  },
  { timestamps: true }
);

export default mongoose.models.Slot || mongoose.model("Slot", SlotSchema);
