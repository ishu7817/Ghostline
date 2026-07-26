import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, verifycode } = await request.json();
    if (!username || !verifycode) {
      return Response.json(
        {
          success: false,
          message:
            "nah, nah ,,....we need hte whole data to sign you in..don't do that",
        },
        { status: 400 },
      );
    }
    const decodedusername = decodeURIComponent(username);

    const user = await User.findOne({ username: decodedusername });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: " a user doesn't exist with this username",
        },
        { status: 400 },
      );
    }
    const iscodevalid = user.verifyCode === verifycode;
    const iscodenotexpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log("DB Code:", user.verifyCode, "| Type:", typeof user.verifyCode);
    console.log("Postman Code:", verifycode, "| Type:", typeof verifycode);

    if (iscodevalid && iscodenotexpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user verification successfull",
        },
        { status: 201 },
      );
    }

    if (!iscodevalid) {
      return Response.json(
        {
          success: false,
          message: "wrong verification code",
        },
        { status: 400 },
      );
    }

    if (!iscodenotexpired) {
      return Response.json(
        {
          success: false,
          message: "verification code time out...",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "error verifying the user",
      },
      { status: 400 },
    );
  }
}
