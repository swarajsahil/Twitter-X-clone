import { Post } from "@/app/api/models/post";
import { User } from "@/app/api/models/user";
import { NextRequest ,NextResponse} from "next/server";

type Params=Promise<{ username: string }>;
export async function GET(request:NextRequest, { params }: { params: Params }) {
    try {
        const { username } = await params;

		const user = await User.findOne({ username });
		if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

		const posts = await Post.find({ user: user._id })
			.sort({ createdAt: -1 })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		return NextResponse.json(posts, { status: 200 });
    } catch (error) {
        console.log("Error in getUserPosts controller: ", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
        
    }
}