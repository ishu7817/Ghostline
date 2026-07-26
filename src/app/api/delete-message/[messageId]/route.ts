import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } },
) {
  const { messageId } = params;

  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const userId = session?.user._id;
 if (!session || !session.user) {

      return Response.json({
        success: false,
        message: " something went wrong findign your session... :",
      }, {status: 401});
    }
    const update = await User.updateOne(
      {
        _id: userId,
      },
      { $pull: { messages: { _id: messageId } } },
    );

    if (update.modifiedCount === 0) {
      return Response.json({
        success: false,
        message: " something went wrong deleting the message:",
      },{status: 404});
    }

    return Response.json({
      success: true,
      message: "Message Deleted...🐍🦖",
    });
  } catch (err) {
    return Response.json({
      success: false,
      message: " something went wrong deleting the message:",
      err,
    },{status: 500});
  }
}
