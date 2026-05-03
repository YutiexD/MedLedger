import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function POST(req: Request) {
  try {
    const { slotId, cancelTxHash } = await req.json();
    await connectToDatabase();

    const updatedSlot = await Slot.findByIdAndUpdate(
      slotId,
      {
        status: "AVAILABLE",
        cancelTxHash: cancelTxHash || undefined,
        $unset: { patientId: "", txHash: "" },
      },
      { new: true }
    );

    if (!updatedSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slot reset to available" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
