// lib/generateToken.ts
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export const generateTokenAndSetCookie = (userId: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  // Explicitly define payload structure
  const payload = {
    userId: userId.toString() // Ensure it's a string
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  const response = NextResponse.json(
    { message: "Authentication successful" },
    { status: 200 }
  );

  response.cookies.set({
    name: "jwt",
    value: token,
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60, // 15 days in seconds
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV !== "development",
  });

  return response;
};