import sgMail from "@sendgrid/mail";
import { MARKETING_CONFIG } from "./config";

function initSendGrid() {
  sgMail.setApiKey(MARKETING_CONFIG.sendgrid.apiKey());
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string
) {
  initSendGrid();

  await sgMail.send({
    to,
    from: {
      email: MARKETING_CONFIG.sendgrid.fromEmail(),
      name: MARKETING_CONFIG.sendgrid.fromName(),
    },
    subject,
    html,
  });

  return { to, subject, status: "sent" as const };
}
