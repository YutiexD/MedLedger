import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import Slot from "@/models/Slot";

export async function POST(req: Request) {
  try {
    const { slotId, patientId, doctorId, medicines, clinicalNotes } = await req.json();
    await connectToDatabase();

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.doctorId.toString() !== doctorId) {
      return NextResponse.json({ error: "Unauthorized: You are not the attending doctor" }, { status: 403 });
    }

    const prescription = await Prescription.create({
      slotId,
      patientId,
      doctorId,
      medicines,
      clinicalNotes,
    });

    return NextResponse.json({ message: "Prescription issued successfully", prescription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
