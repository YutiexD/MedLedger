import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slotId = searchParams.get("slotId");

  if (!slotId) {
    return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const slot = await Slot.findById(slotId)
      .populate("patientId", "username email")
      .populate("doctorId", "username email specialization");

    if (!slot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ slot }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
