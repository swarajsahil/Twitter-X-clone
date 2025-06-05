import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies(); // ✅ no await needed

   cookieStore.set("jwt", "", {
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({ message: "Logout successful" }, { status: 200 });
}