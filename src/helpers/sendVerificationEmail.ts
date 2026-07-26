import nodemailer from 'nodemailer';

export async function sendVerificationEmail(email: string, username: string, verifyCode: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Ghostline" <${process.env.NODEMAILER_EMAIL}>`,
      to: email,
      subject: 'Ghostline Verification Code',
      html: `
        <h1>Welcome, ${username}!</h1>
        <p>Your verification code is: <strong>${verifyCode}</strong></p>
      `,
    });
    return { success: true, message: "Verification email sent successfully" };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: "Failed to send verification email" };
  }
}