import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Patient ID is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();
    const slots = await Slot.find({ patientId: id, status: "BOOKED" })
      .populate("doctorId", "username email specialization walletAddress")
      .sort({ startTime: 1 });

    return NextResponse.json({ slots }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
