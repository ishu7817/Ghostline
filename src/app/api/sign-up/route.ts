import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/user.model";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { email, username, password } = await request.json();
    const userExistsAndVerified = await User.findOne({
      username,
      isVerified: true,
    });
    if (userExistsAndVerified) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        { status: 400 },
      );
    }
    // THE FIX: Catch the unverified ghost accounts so MongoDB doesn't crash!
    const existingUnverifiedUserByUsername = await User.findOne({
      username,
      isVerified: false,
    });

    if (existingUnverifiedUserByUsername) {
      return Response.json(
        {
          success: false,
          message:
            "This username is currently reserved by a pending registration. Please try another.",
        },
        { status: 400 },
      );
    }

const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const existingAndVerifiedUserByEmail = await User.findOne({
      email,
      isVerified: true,
    });

    if (existingAndVerifiedUserByEmail) {
      return Response.json(
        {
          success: false,
          message: "someone already registered with this email",
        },
        { status: 400 },
      );
    }

    const existingUserByEmail = await User.findOne({
      email,
      isVerified: false,
    });

    if (existingUserByEmail) {
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUserByEmail.password = hashedPassword;
      existingUserByEmail.username =  username;
      existingUserByEmail.verifyCode = verifyCode;
      existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

      const saver  = await existingUserByEmail.save();
            if (!saver) {
        return Response.json(
          {
            success: false,
            message: "Sorry, We're facing some trouble registering you right now",
          },
          { status: 500 },
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      //   verifyCode: ;
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new User({
        username,
        password: hashedPassword,
        email,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      const shave = await newUser.save();
      if (!shave) {
        return Response.json(
          {
            success: false,
            messsage: " the user wan't saved try again ....",
          },
          { status: 500 },
        );
      }
    }
    // sending verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode,
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: "error while sending the verification email",
        },
        { status: 500 },
      );
    }
    return Response.json(
      {
        success: true,
        message:
          "verification email sent successfully, and the user is registered, just verify your email too...",
      },
      { status: 200 },
    );
  } catch (err) {
    console.error("error while signing up", err);
    return Response.json(
      {
        success: false,
        message: `failed to sign up: ${err}`,
      },
      { status: 500 },
    );
  }
}
