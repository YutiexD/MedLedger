import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
    
    return NextResponse.json({ message: "Role updated in database", user: updatedUser }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
