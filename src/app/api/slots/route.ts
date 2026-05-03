import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Slot from "@/models/Slot";
import User from "@/models/User";
import { verifyDoctorRole } from "@/middleware/blockchain-auth";

export async function POST(req: Request) {
  try {
    const { startTime, endTime, userId } = await req.json();
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user || user.role !== "DOCTOR") {
      return NextResponse.json({ error: "Only doctors can post slots" }, { status: 403 });
    }

    // Double check on blockchain
    if (user.walletAddress) {
        const isVerified = await verifyDoctorRole(user.walletAddress);
        if (!isVerified) {
            return NextResponse.json({ error: "Wallet does not hold DOCTOR_ROLE on-chain" }, { status: 403 });
        }
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const intervalMinutes = 15;
    
    let current = start;
    const slotsToCreate = [];

    while (current < end) {
      const next = new Date(current.getTime() + intervalMinutes * 60000);
      slotsToCreate.push({
        doctorId: userId,
        startTime: current,
        endTime: next,
        status: "AVAILABLE",
      });
      current = next;
    }

    const createdSlots = await Slot.insertMany(slotsToCreate);

    return NextResponse.json({ message: "Slots created successfully", count: createdSlots.length }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");

    try {
        await connectToDatabase();
        const slots = await Slot.find({ doctorId })
            .populate("patientId", "username email")
            .sort({ startTime: 1 });
        return NextResponse.json({ slots }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
