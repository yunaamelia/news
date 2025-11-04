import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface PriceAlertEmail {
  to: string;
  userName: string;
  symbol: string;
  assetType: "SAHAM" | "KRIPTO";
  condition: "ABOVE" | "BELOW" | "EQUALS";
  targetPrice: number;
  currentPrice: number;
}

export async function sendPriceAlertEmail({
  to,
  userName,
  symbol,
  assetType,
  condition,
  targetPrice,
  currentPrice,
}: PriceAlertEmail) {
  if (!resend) {
    console.warn("[EMAIL] Resend API key not configured. Skipping email.");
    return { success: false, error: "Email service not configured" };
  }

  try {
    const conditionText = {
      ABOVE: "di atas",
      BELOW: "di bawah",
      EQUALS: "sama dengan",
    }[condition];

    const assetText = assetType === "SAHAM" ? "Saham" : "Kripto";
    const formattedTarget = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(targetPrice);

    const formattedCurrent = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(currentPrice);

    const subject = `🔔 Alert Harga: ${symbol} ${conditionText} ${formattedTarget}`;

    const baseUrl = process.env.NEXTAUTH_URL || "https://berita-finansial.vercel.app";

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Price Alert</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; border-radius: 8px 8px 0 0; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">🔔 Alert Harga Tercapai!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                Hai <strong>${userName}</strong>,
              </p>
              <p style="margin: 0 0 30px 0; color: #333333; font-size: 16px; line-height: 1.5;">
                Alert harga Anda untuk <strong>${assetText} ${symbol}</strong> telah tercapai!
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 20px;">
                    <table width="100%" cellpadding="8" cellspacing="0">
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding: 8px 0;">Simbol:</td>
                        <td style="color: #212529; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">${symbol}</td>
                      </tr>
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding: 8px 0;">Kondisi:</td>
                        <td style="color: #212529; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">Harga ${conditionText}</td>
                      </tr>
                      <tr>
                        <td style="color: #6c757d; font-size: 14px; padding: 8px 0;">Target:</td>
                        <td style="color: #212529; font-size: 16px; font-weight: 600; text-align: right; padding: 8px 0;">${formattedTarget}</td>
                      </tr>
                      <tr style="border-top: 2px solid #dee2e6;">
                        <td style="color: #6c757d; font-size: 14px; padding: 12px 0 8px 0;">Harga Saat Ini:</td>
                        <td style="color: #28a745; font-size: 20px; font-weight: 700; text-align: right; padding: 12px 0 8px 0;">${formattedCurrent}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 10px 0 20px 0;">
                    <a href="${baseUrl}/market" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 600;">Lihat Detail Market</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; color: #6c757d; font-size: 14px; line-height: 1.6;">
                Alert ini akan otomatis dinonaktifkan. Anda dapat mengatur alert baru kapan saja di halaman watchlist.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8f9fa; padding: 20px 40px; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 12px; line-height: 1.5;">
                Email ini dikirim oleh <strong>Berita Finansial</strong>
              </p>
              <p style="margin: 0; color: #6c757d; font-size: 12px; line-height: 1.5;">
                <a href="${baseUrl}/alerts" style="color: #667eea; text-decoration: none;">Kelola Alerts</a> · <a href="${baseUrl}" style="color: #667eea; text-decoration: none;">Beranda</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Berita Finansial <alerts@berita-finansial.com>",
      to,
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in sendPriceAlertEmail:", error);
    return { success: false, error };
  }
}
