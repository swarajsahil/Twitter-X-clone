import { Post } from "@/app/api/models/post";
import { getAuthUserFromRequest } from "@/app/api/utils/getAuthUser";
import { NextRequest, NextResponse } from "next/server";

type Params = Promise<{ id: string }>

export async function POST(request:NextRequest, { params }: { params: Params }) {
    try {
		const {id} = await params;
		const authUser =await  getAuthUserFromRequest(request);
        let body: any;

    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      body = {
        text: formData.get("text"),
      };
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
    }

        
        const { text } = body;
        const userId = authUser._id;
		
		
        if (!text) {
			return NextResponse.json({ error: "Text field is required" }, { status: 400 });
		}
		
        const post = await Post.findById(id);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        post.comments.push({ text, user: userId });
        await post.save();

        return NextResponse.json(post, { status: 200 });
    } catch (error:any) {
		console.error("Error in adding comment to post: ", error.message);
        return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
    }
}