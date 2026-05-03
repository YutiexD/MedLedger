import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Review from "@/models/Review";
import Slot from "@/models/Slot";

export async function POST(req: Request) {
  try {
    const { doctorId, patientId, rating, comment, patientName } = await req.json();
    await connectToDatabase();

    // Verify eligibility: Must have at least one past BOOKED slot with this doctor
    const pastSlot = await Slot.findOne({
      doctorId,
      patientId,
      status: "BOOKED",
      startTime: { $lt: new Date() },
    });

    if (!pastSlot) {
      return NextResponse.json(
        { error: "Review denied: No past completed appointments found with this doctor." },
        { status: 403 }
      );
    }

    const review = await Review.create({
      doctorId,
      patientId,
      rating,
      comment,
      patientName,
    });

    return NextResponse.json({ message: "Review posted successfully", review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    try {
        await connectToDatabase();
        const reviews = await Review.find({ doctorId }).sort({ createdAt: -1 });
        return NextResponse.json({ reviews }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
