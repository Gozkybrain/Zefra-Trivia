// /app/api/sendEmails/route.js
import nodemailer from "nodemailer";
import { WelcomeUser } from "@/emails/welcomeUser";
import { NotifyAdmin } from "@/emails/notifyAdmin";

export async function POST(req) {
  try {
    // 1️⃣ Parse and validate body
    const { username, email } = await req.json();
    if (!username || !email) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing username or email" }),
        { status: 400 }
      );
    }

    // 2️⃣ Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // e.g. trivib1@gmail.com
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3️⃣ Send welcome email to user
    let welcomeMailResult;
    try {
      welcomeMailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER, // ✅ use the same email you authenticated with
        to: email,
        subject: "👽 Welcome to Trivib!",
        html: WelcomeUser({ username }),
      });
      console.log("✅ Welcome email sent:", welcomeMailResult.messageId);
    } catch (err) {
      console.error("❌ Failed to send welcome email:", err);
      throw new Error("Failed to send welcome email");
    }

    // 4️⃣ Notify admin
    let adminMailResult;
    try {
      adminMailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL, // or your personal admin email
        subject: "📢 New User Registered",
        html: NotifyAdmin({ name: username, email }),
      });
      console.log("✅ Admin notified:", adminMailResult.messageId);
    } catch (err) {
      console.error("❌ Failed to notify admin:", err);
      throw new Error("Failed to notify admin");
    }

    // 5️⃣ All good
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Email sending failed (outer):", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
