import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Prescription from "@/models/Prescription";
import Slot from "@/models/Slot";

export async function POST(req: Request) {
  try {
    const { slotId, patientId, doctorId, medicines, clinicalNotes, attachmentBase64, attachmentType, txHash } = await req.json();
    await connectToDatabase();

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    if (slot.doctorId.toString() !== doctorId) {
      return NextResponse.json({ error: "Unauthorized: You are not the attending doctor" }, { status: 403 });
    }

    // Since files can be large, we might need to increase payload limit in Next.js config if it exceeds 1MB (usually 4MB default)
    const prescription = await Prescription.create({
      slotId,
      patientId,
      doctorId,
      medicines,
      clinicalNotes,
      attachmentBase64,
      attachmentType,
      txHash,
    });

    return NextResponse.json({ message: "Prescription issued successfully", prescription }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slotId = searchParams.get("slotId");

  try {
    await connectToDatabase();
    const prescription = await Prescription.findOne({ slotId })
      .populate("doctorId", "username email specialization")
      .populate("patientId", "username email");

    if (!prescription) {
      return NextResponse.json({ prescription: null }, { status: 200 });
    }

    return NextResponse.json({
      prescription: {
        id: prescription._id,
        doctor: { name: prescription.doctorId?.username, specialization: prescription.doctorId?.specialization },
        patient: { name: prescription.patientId?.username },
        date: prescription.createdAt?.toLocaleDateString?.() || new Date().toLocaleDateString(),
        medicines: prescription.medicines,
        notes: prescription.clinicalNotes,
        attachmentBase64: prescription.attachmentBase64,
        attachmentType: prescription.attachmentType,
        txHash: prescription.txHash,
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
