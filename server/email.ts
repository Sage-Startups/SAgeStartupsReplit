import type { User } from "../shared/schema.js";

const FROM = process.env.SENDGRID_FROM_EMAIL ?? "hello@sage-startups.com";
const isAvailable = !!process.env.SENDGRID_API_KEY;

let _sgMail: typeof import("@sendgrid/mail") | null = null;

async function getSgMail() {
  if (!_sgMail) {
    const sgMail = await import("@sendgrid/mail");
    sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);
    _sgMail = sgMail.default as unknown as typeof import("@sendgrid/mail");
  }
  return _sgMail;
}

export async function sendWelcomeEmail(user: User): Promise<void> {
  if (!isAvailable) {
    console.log(`[email] welcome → ${user.email} (skipped — no SENDGRID_API_KEY)`);
    return;
  }
  try {
    const sg = await getSgMail();
    await (sg as any).send({
      to: user.email,
      from: FROM,
      subject: "Welcome to Sage Startups 🚀",
      text: `Hi ${user.firstName ?? "there"},\n\nWelcome to Sage Startups! Your 7-day free trial is now active.\n\nStart building your brand at https://sage-startups.com/dashboard\n\nThe Sage Startups Team`,
      html: `<p>Hi ${user.firstName ?? "there"},</p><p>Welcome to <strong>Sage Startups</strong>! Your 7-day free trial is now active.</p><p><a href="https://sage-startups.com/dashboard">Start building your brand →</a></p><p>The Sage Startups Team</p>`,
    });
  } catch (err) {
    console.error("[email] sendWelcomeEmail failed:", (err as Error).message);
  }
}

export async function sendWaitlistConfirmation(email: string): Promise<void> {
  if (!isAvailable) {
    console.log(`[email] waitlist confirmation → ${email} (skipped — no SENDGRID_API_KEY)`);
    return;
  }
  try {
    const sg = await getSgMail();
    await (sg as any).send({
      to: email,
      from: FROM,
      subject: "You're on the Sage Startups waitlist ✅",
      text: `You're on the list!\n\nWe'll let you know the moment your spot opens up. In the meantime, follow us for updates.\n\nThe Sage Startups Team`,
      html: `<p>You're on the list!</p><p>We'll let you know the moment your spot opens up.</p><p>The Sage Startups Team</p>`,
    });
  } catch (err) {
    console.error("[email] sendWaitlistConfirmation failed:", (err as Error).message);
  }
}
