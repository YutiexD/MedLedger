import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    // Assuming admin role is checked by middleware or skipped for this phase
    const users = await User.find({}).select("-password");
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
