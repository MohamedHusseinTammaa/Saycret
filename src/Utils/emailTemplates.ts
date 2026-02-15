/**
 * Saycret-branded email HTML (same palette: #000, #E67E22, #F39C12, #fff).
 */

export function getVerificationEmailHtml(verifyUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email - Saycret</title>
</head>
<body style="margin:0; padding:0; background:#000000; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000000; min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:400px; margin:0 auto;">
          <tr>
            <td style="text-align:center; padding-bottom:24px;">
              <h1 style="margin:0; font-size:32px; font-weight:700; background:linear-gradient(45deg,#E67E22,#F39C12); -webkit-background-clip:text; color:#E67E22; letter-spacing:-0.5px;">Saycret</h1>
            </td>
          </tr>
          <tr>
            <td style="background:#1a1a1a; border:2px solid #262626; border-radius:24px; padding:32px 24px;">
              <p style="margin:0 0 16px; color:#f5f5f5; font-size:16px; line-height:1.5;">Verify your email to start using Saycret.</p>
              <p style="margin:0 0 24px; color:#8a8a8a; font-size:14px; line-height:1.5;">Click the button below. This link expires in 24 hours.</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${verifyUrl}" style="display:inline-block; padding:16px 32px; background:linear-gradient(45deg,#E67E22,#F39C12); color:#ffffff; text-decoration:none; font-size:15px; font-weight:700; border-radius:28px; box-shadow:0 4px 14px rgba(230,126,34,0.3);">Verify email</a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0; color:#737373; font-size:12px;">If you didn't create an account, you can ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="text-align:center; padding-top:24px;">
              <p style="margin:0; color:#737373; font-size:12px;">Saycret – privacy-first sharing</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
