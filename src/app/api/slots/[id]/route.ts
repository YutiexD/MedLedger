import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Slot ID is required" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedSlot = await Slot.findByIdAndDelete(id);

    if (!deletedSlot) {
      return NextResponse.json({ error: "Slot not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Slot deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
