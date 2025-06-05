import { NextRequest } from "next/server";
import { User } from "@/app/api/models/user";
import { Notification } from "@/app/api/models/notification";
import { NextResponse } from "next/server";
import { getAuthUserFromRequest } from "@/app/api/utils/getAuthUser";

type Params = Promise<{ id: string }>

export async function POST(request:NextRequest, { params }: { params: Params }) {
    const { id } = await params;
  try {
    
    const userToModify = await User.findById(id);
    const currentUser = await getAuthUserFromRequest(request);
     const currentUserId = currentUser._id.toString();

    console.log(currentUser);
 
 		if (id === currentUserId) {
 			return NextResponse.json({ error: "You can't follow/unfollow yourself" }, { status: 400 });
 		}
 
 		if (!userToModify || !currentUser) return NextResponse.json({ error: "User not found" }, { status: 404 });
 
 		const isFollowing = currentUser.following.includes(id);
 
 		if (isFollowing) {
 			// Unfollow the user
 			await User.findByIdAndUpdate(id, { $pull: { followers: currentUser._id } });
 			await User.findByIdAndUpdate(currentUser._id, { $pull: { following: id } });
 
 			// TODO: return the id of the user as a response
 			NextResponse.json({ message: "User unfollowed successfully" }, { status: 200 });
 		} else {
 			// Follow the user
 			await User.findByIdAndUpdate(id, { $push: { followers: currentUser._id } });
 			await User.findByIdAndUpdate(currentUser._id, { $push: { following: id } });
 			// Send notification to the user
 			const newNotification = new Notification({
 				type: "follow",
 				from: currentUser._id,
 				to: userToModify._id,
 			});
 
 			await newNotification.save();
 
 			return NextResponse.json({ message: "User followed successfully" }, { status: 200 });
 		}
 	} catch (error:any) {
 		console.log("Error in followUnfollowUser: ", error.message);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
 	}
}