export const sendVerificationEmail = async ({ email, name, verificationLink }) => {
  console.log("====================================");
  console.log(`Verification email for ${name} <${email}>`);
  console.log("Open this link to verify the account:");
  console.log(verificationLink);
  console.log("====================================");
};

export const sendQrCodeEmail = async ({ email, name, url }) => {
  console.log("====================================");
  console.log(`QR code email for ${name} <${email}>`);
  console.log(`The QR code for this URL would be emailed: ${url}`);
  console.log("Real SMTP email will be connected later.");
  console.log("====================================");
};