import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";
import { Notification } from "../../models/notification";

export async function DELETE(request:NextRequest) {
    try {
        const authUser = await getAuthUserFromRequest(request);
        const userId=authUser._id;
        await Notification.deleteMany({ to: userId });
        return NextResponse.json({
            success: true,
            message: "Notifications deleted successfully",
        }, { status: 200 });
    }
    catch (error:any) {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
