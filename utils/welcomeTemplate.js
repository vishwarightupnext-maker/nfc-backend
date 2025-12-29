// utils/welcomeTemplate.js
export const welcomeTemplate = ({ name, route, cardId }) => {
  const editUrl = `https://www.happytap.in/a/${cardId}`;

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Welcome to Happy Tap</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 15px;">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">
              
              <!-- HEADER -->
              <tr>
                <td style="background:#6d28d9;color:#ffffff;padding:25px;text-align:center;">
                  <h1 style="margin:0;font-size:26px;">Welcome to Happy Tap 🎉</h1>
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding:30px;color:#333333;">
                  <p style="font-size:16px;margin:0 0 15px;">
                    Hi <strong>${name || "there"}</strong>,
                  </p>

                  <p style="font-size:15px;line-height:1.6;margin:0 0 15px;">
                    Your digital visiting card has been successfully created.
                  </p>

                  <!-- EDIT CARD BUTTON -->
                  <p style="text-align:center;margin:25px 0;">
                    <a
                      href="${editUrl}"
                      style="
                        background:#0f172a;
                        color:#ffffff;
                        text-decoration:none;
                        padding:12px 22px;
                        border-radius:8px;
                        font-size:15px;
                        display:inline-block;
                      "
                    >
                      ✏️ Edit My Card
                    </a>
                  </p>

                  <p style="font-size:14px;color:#555;margin-top:25px;text-align:center;">
                    Card ID: <strong>${cardId}</strong>
                  </p>

                  <p style="font-size:15px;line-height:1.6;margin:25px 0 20px;">
                    You can view and share your card using the link below:
                  </p>

                  <p style="text-align:center;">
                    <a
                      href="${route}"
                      style="
                        background:#6d28d9;
                        color:#ffffff;
                        text-decoration:none;
                        padding:12px 22px;
                        border-radius:6px;
                        font-size:15px;
                        display:inline-block;
                      "
                    >
                      View My Card
                    </a>
                  </p>

                  <p style="font-size:14px;color:#555;margin-top:30px;">
                    Keep your Card ID safe for future reference and support.
                  </p>

                  <p style="font-size:14px;margin-top:10px;">
                    — Team <strong>Happy Tap</strong>
                  </p>
                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="background:#f1f1f1;text-align:center;padding:15px;font-size:12px;color:#777;">
                  © ${new Date().getFullYear()} Happy Tap. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
};
