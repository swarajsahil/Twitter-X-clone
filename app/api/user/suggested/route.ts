import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import { User } from "../../models/user";

export async function  GET (request:NextRequest) {
  try {
    const authUser=await getAuthUserFromRequest(request);
    const userId = authUser._id;
    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
        {
            $match: {
                _id: { $ne: userId },
            },
        },
        { $sample: { size: 10 } },
    ]);

    // 1,2,3,4,5,6,
    const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
    const suggestedUsers = filteredUsers.slice(0, 4);

    suggestedUsers.forEach((user) => (user.password = null));

    return NextResponse.json(suggestedUsers, { status: 200 });
} catch (error: any) {
    console.log("Error in getSuggestedUsers: ", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
}   