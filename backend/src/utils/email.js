// utils/email.js
// Uses Resend (https://resend.com) — HTTP-based, works on Render free tier.
// SMTP (nodemailer + Gmail) is blocked by Render's network on free plans.

const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a 6-digit OTP to the given email address.
 * @param {string} to   - recipient email
 * @param {string} otp  - 6-digit OTP string
 * @param {string} name - recipient's name for personalisation
 */
const sendOtpEmail = async (to, otp, name = "there") => {
  const { error } = await resend.emails.send({
    from: "QuizAI <onboarding@resend.dev>",  // free Resend sandbox address
    to,
    subject: "Your QuizAI Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px;text-align:center;">
                      <div style="display:inline-block;width:48px;height:48px;background:rgba(255,255,255,0.2);border-radius:12px;line-height:48px;margin-bottom:12px;">
                        <span style="font-size:28px;font-weight:800;color:#fff;">Q</span>
                      </div>
                      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">QuizAI</h1>
                      <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">Email Verification</p>
                    </td>
                  </tr>
                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 40px 32px;">
                      <p style="margin:0 0 8px;font-size:16px;color:#374151;">Hi <strong>${name}</strong>,</p>
                      <p style="margin:0 0 28px;font-size:15px;color:#6b7280;line-height:1.6;">
                        Use the verification code below to complete your QuizAI registration.
                        This code expires in <strong>10 minutes</strong>.
                      </p>
                      <!-- OTP Box -->
                      <div style="background:#f0f0ff;border:2px dashed #6366f1;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
                        <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:2px;color:#6366f1;font-weight:600;">Verification Code</p>
                        <p style="margin:0;font-size:42px;font-weight:800;letter-spacing:12px;color:#4338ca;font-family:monospace;">${otp}</p>
                      </div>
                      <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.6;">
                        If you did not request this, you can safely ignore this email.
                      </p>
                    </td>
                  </tr>
                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #f0f0f0;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#9ca3af;">© 2026 QuizAI. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(error.message || "Resend API error");
  }
};

module.exports = { sendOtpEmail };
