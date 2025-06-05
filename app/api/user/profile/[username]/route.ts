import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/models/user";
type Params = Promise<{ username: string }>
export async function GET(request:NextRequest, { params }: { params: Params }) {
  const { username } = await params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
}
catch (error:any) {     
    console.log("Error in getUserProfile: ", error.message);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}