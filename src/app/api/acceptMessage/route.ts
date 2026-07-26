import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as user } from "next-auth";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "erorr finding user... in the sessions",
      },
      { status: 500 },
    );
  }

  const userid = user._id;
  const acceptMessages = await request.json();

  try {
    const actualuser = await User.findByIdAndUpdate(
      userid,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );
    if (!actualuser) {
      return Response.json(
        {
          success: false,
          message: "user not found ",
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message: "User accepting message is flipped ",
        actualuser,
      },
      { status: 201 },
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "there was a error updating user's message accepting status ",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "erorr finding user... in the sessions",
      },
      { status: 500 },
    );
  }

  const userid = user._id;
  //   const status = await request.json;

  try {
    const actualuser = await User.findById(userid);
    if (!actualuser) {
      return Response.json(
        { success: false, message: "no user found with the user id " },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        isAcceptingMessage: actualuser.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (err) {
    return Response.json(
      {
        success: false,
        message: "there was a error fetching the user's message accepting status ",
      },
      { status: 500 },
    );
  }
}
