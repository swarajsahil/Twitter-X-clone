import { Post } from "@/app/api/models/post";
import { User } from "@/app/api/models/user";
import { NextRequest,NextResponse } from "next/server";

type Params = Promise<{ id: string }>;
export async function GET(request:NextRequest, { params }: { params: Params }) {
	const {id:userId} = await params;

	try {
		const user = await User.findById(userId);
		if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

		const likedPosts = await Post.find({ likes: userId })
			.populate("user", "-password")
			.populate("comments.user", "-password");

		return NextResponse.json(likedPosts,{ status: 200 });
	} catch (error:any) {
		console.log("Error in getLikedPosts controller: ", error);
		return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
	}
};