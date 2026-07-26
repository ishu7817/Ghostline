import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { Message } from "@/models/user.model";

export async function POST(request: Request) {
  await dbConnect();

  const { username, content } = await request.json();

  if (!content || !username) {
    return Response.json(
      {
        success: false,
        message: "No message or user found",
      },
      { status: 400 },
    );
  }
  try {
  
    const user = await User.findOne({username : username});
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "No user found",
        },
        { status: 400 },
      );
    }

    const userid = user._id;
    if (user.isAcceptingMessages === false) {
      return Response.json(
        {
          success: false,
          message: "The user is not currently accepting messages",
        },
        { status: 403 },
      );
    }
    const sentmessage = await User.updateOne(
      { _id: userid },
      { $push: { messages: {content, createdAt : new Date()} } },
    );

    if (!sentmessage) {
      return Response.json(
        {
          success: false,
          message: "There was an error sending message...",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message Sent Successfully🐍🐢",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log("the error was:", err);
    return Response.json(
      {
        success: false,
        message: "There was an error sending message",
      },
      { status: 500 },
    );
  }
}
