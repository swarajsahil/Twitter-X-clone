import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/app/api/models/user";
import { generateTokenAndSetCookie } from "@/app/lib/generateToken";

export async function POST(request: NextRequest) {
  try {
    let body: any;

    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = {
        fullName: formData.get("fullName"),
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
      };
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const { fullName, username, email, password } = body;

    console.log('Request Body:', username, email,fullName);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    const existingUserByUsername = await User.findOne({ username });
    const existingUserByEmail = await User.findOne({ email });

      if (existingUserByUsername || existingUserByEmail) {
          return NextResponse.json({ error: "Username or Email already taken" }, { status: 400 });
      }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const response = generateTokenAndSetCookie(newUser._id.toString());

    // Add your JSON data to the same response
    return NextResponse.json({
      message: "Signup successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    }, {
      status: 200,
      headers: response.headers // Include the cookie headers
    });

  } catch (error: any) {
    console.error("Signup error:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}