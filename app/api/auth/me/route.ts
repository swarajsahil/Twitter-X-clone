// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest } from "../../utils/getAuthUser";

export async function GET(request: NextRequest) {
  try {
    const user =await  getAuthUserFromRequest(request);
    
    console.log(user);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user
    }, { status: 200 });

  } catch (error: any) {
    console.error("GetMe error:", error.message);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



    // const cookieStore = await cookies();
    // const token = cookieStore.get("jwt")?.value;

    // if (!token) {
    //   return NextResponse.json(
    //     { error: "Unauthorized - No token provided" },
    //     { status: 401 }
    //   );
    // }
    
    // // Verify the token using the same secret
    // const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    // // Find user and exclude password
    // const user = await User.findById(decoded.userId).select("-password");