import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { walletAddress, name, specialization } = await req.json();
    await connectToDatabase();

    // Check if a user with this wallet already exists
    let user = await User.findOne({ walletAddress });
    
    if (user) {
      // Update their role to DOCTOR
      user.role = "DOCTOR";
      user.specialization = specialization;
      await user.save();
    } else {
      // Create a new user entry for this doctor
      const hashedPassword = await bcrypt.hash("changeme123", 12);
      user = await User.create({
        username: name.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@doctor.medledger`,
        password: hashedPassword,
        walletAddress,
        role: "DOCTOR",
        specialization,
      });
    }

    return NextResponse.json({ message: "Doctor registered", user }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
