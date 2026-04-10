import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, email, password, role, specialization, walletAddress } = await req.json();
    await connectToDatabase();

    if (!username) {
        return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ error: "User or email already exists" }, { status: 400 });
    }

    // If registering as DOCTOR, verify wallet is admin-approved
    if (role === "DOCTOR") {
      if (!walletAddress) {
        return NextResponse.json({ error: "Doctors must connect their wallet" }, { status: 400 });
      }
      // Check if admin already registered this wallet
      const existingDoctor = await User.findOne({ walletAddress, role: "DOCTOR" });
      if (!existingDoctor) {
        return NextResponse.json({ error: "This wallet address has not been approved by the admin. Please contact the administrator to register your wallet first." }, { status: 403 });
      }
      // Update the existing admin-created doctor record with the new credentials
      const hashedPassword = await bcrypt.hash(password, 12);
      existingDoctor.username = username;
      existingDoctor.email = email;
      existingDoctor.password = hashedPassword;
      if (specialization) existingDoctor.specialization = specialization;
      await existingDoctor.save();
      return NextResponse.json({ message: "Doctor account updated successfully" }, { status: 201 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || "PATIENT",
      specialization: role === "DOCTOR" ? specialization : undefined,
      walletAddress: walletAddress || undefined,
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
