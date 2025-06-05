import { NextRequest, NextResponse } from "next/server";
import { Post } from "../../models/post";

export async function GET(request:NextRequest) {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

        if (posts.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

        return NextResponse.json(posts, { status: 200 });
    } catch (error:any) {
        console.error("Error fetching posts:", error.message);
       return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}