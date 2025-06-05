// utils/getAuthUser.ts
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { User } from "@/app/api/models/user";

export async function getAuthUserFromRequest(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value;

  if (!token) return null;

  try {
    // Verify the token using the same secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    // Find user and exclude password
    const user = await User.findById(decoded.userId).select("-password");
    return user;
  } catch (error) {
    return null;
  }
}