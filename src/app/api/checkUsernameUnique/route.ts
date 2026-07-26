import z from "zod";
import { userValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

const usernameQuerySchema = z.object({
  username: userValidation,
});

export async function GET(request: Request) {
  
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const queryparam = { username: searchParams.get("username") };

    const result = usernameQuerySchema.safeParse(queryparam);
    if (!result.success) {
      console.log(result);

      const userNameErrors = result.error.format().username?._errors || [];
      return Response.json({
        success: false,
        message:
          userNameErrors?.length > 0
            ? userNameErrors.join(",")
            : "invalid Query parameters",
      });
      console.log(userNameErrors);
    }
    const { username } = result.data;

    const userexistscheck = await User.findOne({ username, isVerified: true });

    if (userexistscheck) {
      return Response.json({
        success: false,
        message: "ummm...A user already exists with the username...try another one",
      });
    }
    return Response.json({
      success: true,
      message: "Username is available",
    });
  } catch (error) {
    console.error(
      "error checking username...see the file inside checkusernameunique ",
      error,
    );
    return Response.json({
      success: false,
      message: "there was a problem connecting to ZOD",
    });
  }
}
