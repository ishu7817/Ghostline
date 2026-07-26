import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { User as user } from "next-auth";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import mongoose from "mongoose";
import { _discriminatedUnion } from "zod/v4/core";

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user as any;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      { status: 500 },
    );
  }

  const userid = new mongoose.Types.ObjectId(user._id);

  try {
    const actualUser = await User.aggregate([
      { $match: { _id: userid } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!actualUser || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "erorr finding user... in the sessions",
        },
        { status: 500 },
      );
    }
    return Response.json({
      success: true,
      messages: actualUser.length > 0 ? actualUser[0].messages : [],
    }, {status: 200});
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "there was some error while getting your messages...",
      },
      { status: 500 },
    );
  }
}
