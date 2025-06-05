import { NextRequest, NextResponse } from "next/server";
import { User } from "@/app/api/models/user";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "@/app/lib/generateToken";
// import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    let body: any;

    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = {
        username: formData.get("username"),
        password: formData.get("password"),
      };
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const { username, password } =  body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }

    // Get the response with cookie set
    const response = generateTokenAndSetCookie(existingUser._id.toString());

    // Add your JSON data to the same response
    return NextResponse.json({
      message: "Login successful",
      user: {
        username: existingUser.username,
        email: existingUser.email,
        createdAt: existingUser.createdAt,
      },
    }, {
      status: 200,
      headers: response.headers // Include the cookie headers
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}