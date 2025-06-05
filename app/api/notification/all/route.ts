import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import { Notification } from "../../models/notification";

export async function GET(request:NextRequest) {
    try {
        const authUser=await getAuthUserFromRequest(request);
        const userId=authUser._id;
        console.log(userId);
        
        const notifications = await Notification.find({ to: userId })
            .populate({
                path: "from",
                select:"username profilePic"
            });
            await Notification.updateMany({ to: userId }, { read: true });
        return NextResponse.json({
            success: true,
            message: "Notifications fetched successfully",
            notifications,
        }, { status: 200 });
    }
    catch (error:any) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}