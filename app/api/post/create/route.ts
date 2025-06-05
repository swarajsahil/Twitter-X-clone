import cloudinary from "@/app/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { Post } from "../../models/post";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import { User } from "../../models/user";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    const contentType = request.headers.get("content-type");
    let body: any = {};

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      body.text = formData.get("text");
      body.img = formData.get("img");
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

    const { text } = body;
    let { img } = body;

    const userId = authUser._id.toString();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

    if (!text && !img) {
      return NextResponse.json({ error: "Post must have text or image" }, { status: 400 });
    }

    let imageUrl = null;

    if (img && typeof img === "string" && img.startsWith("data:image/")) {
      // base64 string
      const uploadRes = await cloudinary.uploader.upload(img, {
        folder: "posts",
      });
      imageUrl = uploadRes.secure_url;
    }

    const newPost = new Post({
      user: userId,
      text,
      img: imageUrl,
    });

    await newPost.save();
    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    console.log("Error in createPost controller:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}