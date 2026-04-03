import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Slot from "@/models/Slot";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const specialization = searchParams.get("specialization");

  try {
    await connectToDatabase();

    const query: any = { role: "DOCTOR" };
    if (specialization && specialization !== "all") {
      query.specialization = specialization;
    }

    const doctors = await User.find(query).select("-password");

    // Map through doctors and find their available slots
    const doctorsWithSlots = await Promise.all(
        doctors.map(async (doctor) => {
            const slots = await Slot.find({ 
                doctorId: doctor._id, 
                status: "AVAILABLE",
                startTime: { $gte: new Date() } // Future slots only
            }).limit(10); // Show up to 10 upcoming slots in search card
            return {
                ...doctor.toObject(),
                slots
            };
        })
    );

    return NextResponse.json({ doctors: doctorsWithSlots }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
