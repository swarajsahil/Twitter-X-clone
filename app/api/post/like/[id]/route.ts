import { Notification } from "@/app/api/models/notification";
import { Post } from "@/app/api/models/post";
import { User } from "@/app/api/models/user";
import { getAuthUserFromRequest } from "@/app/api/utils/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>

export async function POST(request:NextRequest, { params }: { params: Params }) {
    try {
		const authUser=await getAuthUserFromRequest(request);
        const {id} = await params;
        const userId = authUser._id;

        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
			// Unlike post
			await Post.updateOne({ _id: id }, { $pull: { likes: userId } });
			await User.updateOne({ _id: userId }, { $pull: { likedPosts: id } });

			const updatedLikes = post.likes.filter((id:string) => id.toString() !== userId.toString());
			return NextResponse.json(updatedLikes, { status: 200 });
		} else {
			// Like post
			post.likes.push(userId);
			await User.updateOne({ _id: userId }, { $push: { likedPosts: id } });
			await post.save();

			const notification = new Notification({
				from: userId,
				to: post.user,
				type: "like",
			});
			await notification.save();

			const updatedLikes = post.likes;
			return NextResponse.json(updatedLikes, { status: 200 });
		}
    } catch (error:any) {
		console.error("Error in liking/unliking post: ", error.message);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
    }
}