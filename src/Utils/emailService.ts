import nodemailer from "nodemailer";
import { getVerificationEmailHtml } from "./emailTemplates.ts";

const USER_EMAIL = process.env.USER_EMAIL;
const USER_PASSWORD = process.env.USER_PASSWORD;

const DEFAULT_APP_URL = "http://localhost:5500/public";

function getVerifyUrl(rawToken: string): string {
    const baseUrl = (process.env.APP_URL || DEFAULT_APP_URL).replace(/\/$/, "");
    return `${baseUrl}/verify?token=${rawToken}`;
}

function getTransporter() {
    if (!USER_EMAIL || !USER_PASSWORD) {
        throw new Error("USER_EMAIL and USER_PASSWORD must be set in environment");
    }
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: USER_EMAIL,
            pass: USER_PASSWORD,
        },
    });
}

/**
 * Send an email. Uses USER_EMAIL as from address and USER_EMAIL/USER_PASSWORD for auth.
 * Does not normalize the recipient email - sends to the address as provided.
 */
export async function sendMail(to: string, subject: string, html: string): Promise<void> {
    const transport = getTransporter();
    await transport.sendMail({
        from: USER_EMAIL,
        to,
        subject,
        html,
    });
}

export function isEmailConfigured(): boolean {
    return Boolean(USER_EMAIL && USER_PASSWORD);
}

/**
 * Send the Saycret verification email. Builds the verify URL and uses the branded HTML template.
 */
export async function sendVerificationEmail(to: string, rawToken: string): Promise<void> {
    const verifyUrl = getVerifyUrl(rawToken);
    const html = getVerificationEmailHtml(verifyUrl);
    await sendMail(to, "Verify your email – Saycret", html);
}
