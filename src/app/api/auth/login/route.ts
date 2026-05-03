import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "123456";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Check for hardcoded admin login first
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      return NextResponse.json({
        user: {
          id: "admin_hardcoded",
          email: ADMIN_EMAIL,
          username: "Admin",
          role: "ADMIN",
          walletAddress: null,
        }
      }, { status: 200 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // If user is a doctor, they must have a walletAddress linked by admin
    if (user.role === "DOCTOR" && !user.walletAddress) {
      return NextResponse.json({ error: "Your wallet has not been registered by the admin yet. Please contact the administrator." }, { status: 403 });
    }

    return NextResponse.json({ 
      user: { 
        id: user._id, 
        email: user.email, 
        username: user.username,
        role: user.role, 
        walletAddress: user.walletAddress 
      } 
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
