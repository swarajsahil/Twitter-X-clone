import { NextRequest,NextResponse } from "next/server";
import { Post } from "../../models/post";
import { User } from "../../models/user";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";

export async function GET(request:NextRequest) {
	try {
        const authUser=await getAuthUserFromRequest(request);
		const userId = authUser._id;
		const user = await User.findById(userId);
		if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

		const following = user.following;

		const feedPosts = await Post.find({ user: { $in: following } })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		return NextResponse.json(feedPosts, { status: 200 });
	} catch (error) {
		console.log("Error in getFollowingPosts controller: ", error);
		return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
	}
};