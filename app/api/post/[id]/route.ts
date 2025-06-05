import { NextRequest, NextResponse } from "next/server";
import { Post } from "../../models/post";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import cloudinary from "@/app/lib/cloudinary";

type Params = Promise<{ id: string }>

export async function GET(request:NextRequest, { params }: { params: Params }) {
	try {
		const {id} = await params;
		const posts = await Post.findById(id)
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
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Delete a specific post
export async function DELETE(request: NextRequest, { params }: { params: Params }) {
  try {
    const authUser = await getAuthUserFromRequest(request);
        const {id:postId} = await params;
        const userId = authUser._id;

        const post = await Post.findById(postId);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        if (post.user.toString() !== userId.toString()) {
            return NextResponse.json({ message: "You are not authorized to delete this post" }, { status: 403 });
        }

        if (post.img) {
			const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
		}

		await Post.findByIdAndDelete(postId);
        return NextResponse.json({ message: "Post deleted successfully" }, { status: 200 });
    }  catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}