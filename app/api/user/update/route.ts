import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import { User } from "../../models/user";
import bcrypt from "bcryptjs";
import cloudinary from "@/app/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    let body: any;
    let profileImgFile: File | null = null;
    let coverImgFile: File | null = null;

    const contentType = request.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      body = {
        fullName: formData.get("fullName"),
        username: formData.get("username"),
        email: formData.get("email"),
        newPassword: formData.get("newPassword"),
        currentPassword: formData.get("currentPassword"),
        bio: formData.get("bio"),
        link: formData.get("link"),
      };
      profileImgFile = formData.get("profileImg") as File | null;
      coverImgFile = formData.get("coverImg") as File | null;
    } else if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      return NextResponse.json(
        { error: "Unsupported content type" },
        { status: 400 }
      );
    }

    const {
      username,
      fullName,
      email,
      currentPassword,
      newPassword,
      bio,
      link,
    } = body;
    const userId = authUser._id;
    let user = await User.findById(userId);
    if (!user)
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );

    // Handle password changes
    if (currentPassword || newPassword) {
      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          {
            error: "Please provide both current password and new password",
          },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch)
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        );
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    // Handle profile image upload
    if (profileImgFile && profileImgFile.size > 0) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop()?.split(".")[0] || ""
        );
      }

      const arrayBuffer = await profileImgFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString("base64");
      const uploadedResponse = await cloudinary.uploader.upload(
        `data:${profileImgFile.type};base64,${base64String}`,
        { folder: "profile_images" }
      );
      user.profileImg = uploadedResponse.secure_url;
    }

    // Handle cover image upload
    if (coverImgFile && coverImgFile.size > 0) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop()?.split(".")[0] || ""
        );
      }

      const arrayBuffer = await coverImgFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64String = buffer.toString("base64");
      const uploadedResponse = await cloudinary.uploader.upload(
        `data:${coverImgFile.type};base64,${base64String}`,
        { folder: "cover_images" }
      );
      user.coverImg = uploadedResponse.secure_url;
    }

    // Update other fields
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (username !== undefined) user.username = username;
    if (bio !== undefined) user.bio = bio;
    if (link !== undefined) user.link = link;

    user = await user.save();
    user.password = null;

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    console.log("Error in updateUser: ", error.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}