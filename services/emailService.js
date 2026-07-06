import { Resend } from "resend";

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
};

const getFromEmail = () => {
  return process.env.EMAIL_FROM || "QR Studio <onboarding@resend.dev>";
};

export const sendVerificationEmail = async (email, verificationLink) => {
  const resend = getResendClient();

  if (!resend) {
    console.log("Verification link:", verificationLink);
    return;
  }

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Verify your QR Studio account",
    html: `
      <div style="font-family: Georgia, serif; line-height: 1.6; color: #111827;">
        <h1>Verify your QR Studio account</h1>
        <p>Thank you for registering. Click the button below to verify your email address.</p>
        <p>
          <a
            href="${verificationLink}"
            style="display: inline-block; padding: 12px 18px; border-radius: 999px; background: #111827; color: #ffffff; text-decoration: none; font-weight: 700;"
          >
            Verify email
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${verificationLink}</p>
      </div>
    `,
  });
};

export const sendQrCodeEmail = async (email, qrCode) => {
  const resend = getResendClient();

  if (!resend) {
    console.log("QR code email requested for:", email);
    return;
  }

  await resend.emails.send({
    from: getFromEmail(),
    to: email,
    subject: "Your QR Studio code",
    html: `
      <div style="font-family: Georgia, serif; line-height: 1.6; color: #111827;">
        <h1>Your QR code is ready</h1>
        <p>Here is the QR code you generated for:</p>
        <p><strong>${qrCode.url}</strong></p>
        <p>
          <img src="${qrCode.qrImage}" alt="QR code" style="width: 220px; height: 220px;" />
        </p>
      </div>
    `,
  });
};