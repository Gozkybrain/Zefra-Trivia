import nodemailer from "nodemailer";
import { WelcomeUser } from "@/emails/welcomeUser";
import { NotifyAdmin } from "@/emails/notifyAdmin";


export async function POST(req) {
  try {
    // * Parse and validate body
    const { username, email } = await req.json();
    if (!username || !email) {
      return new Response(
        JSON.stringify({ ok: false, error: "Missing username or email" }),
        { status: 400 }
      );
    }

    // * Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // * Send welcome email to user
    let welcomeMailResult;
    try {
      welcomeMailResult = await transporter.sendMail({
        from: process.env.EMAIL_USER,
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
        to: process.env.ADMIN_EMAIL,
        subject: "📢 New User Registered",
        html: NotifyAdmin({ name: username, email }),
      });
      console.log("✅ Admin notified:", adminMailResult.messageId);
    } catch (err) {
      console.error("❌ Failed to notify admin:", err);
      throw new Error("Failed to notify admin");
    }

    // * All good
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error) {
    console.error("❌ Email sending failed (outer):", error);
    return new Response(
      JSON.stringify({ ok: false, error: error.message || "Unknown error" }),
      { status: 500 }
    );
  }
}
