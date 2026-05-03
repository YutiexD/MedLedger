import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { userId, walletAddress } = await req.json();
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(userId, { walletAddress }, { new: true });
    
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Wallet address updated", user: { id: updatedUser._id, walletAddress: updatedUser.walletAddress } }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
