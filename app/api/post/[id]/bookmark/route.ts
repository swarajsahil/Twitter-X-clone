// app/api/post/[id]/bookmark/route.ts

import { NextRequest, NextResponse } from "next/server";
import {Post} from "@/app/api/models/post";
import { getAuthUserFromRequest } from "@/app/api/utils/getAuthUser";
type Params = Promise<{ id: string }>;
export async function PATCH(request: NextRequest, { params }: { params: Params }) {
  try {
    const authUser = await getAuthUserFromRequest(request);
    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = String(authUser?._id); // or session.user.id if stored like that
    
    const { id:postId } = await params;
    
    const post = await Post.findById(postId);
    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    
    console.log( post);
    const isBookmarked = post?.bookmarks.includes(userId);

    if (isBookmarked) {
      // Unbookmark
      post.bookmarks.pull(userId);
    } else {
      // Bookmark
      post.bookmarks.push(userId);
    }

    await post.save();

    return NextResponse.json({
      message: isBookmarked ? "Post unbookmarked" : "Post bookmarked",
      bookmarks: post.bookmarks,
    });

  } catch (error) {
    console.error("Bookmark Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}