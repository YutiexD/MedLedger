import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function POST(req: Request) {
  try {
    const { slotId, patientId, txHash } = await req.json();
    await connectToDatabase();

    const updatedSlot = await Slot.findByIdAndUpdate(
      slotId,
      {
        status: "BOOKED",
        patientId,
        txHash,
      },
      { new: true }
    );

    if (!updatedSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Booking updated in database", slot: updatedSlot }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
