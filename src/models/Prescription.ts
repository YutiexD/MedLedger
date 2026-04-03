import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema(
  {
    slotId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Slot",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medicines: [
      {
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
      },
    ],
    clinicalNotes: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Prescription || mongoose.model("Prescription", PrescriptionSchema);
