export const campaignTemplate = ({
  title,
  message,
  buttonText = "Visit Juzdrop",
  buttonLink = "https://juzdrop.com",
}) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f2f4f7;
      font-family: Arial, Helvetica, sans-serif;
    }

    .email-wrapper {
      width: 100%;
      padding: 40px 0;
    }

    .email-container {
      max-width: 600px;
      margin: auto;
      background: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
    }

    /* HEADER */
    .email-header {
      background: #3f3d56;
      padding: 40px 20px 60px;
      text-align: center;
      position: relative;
    }

    .logo-circle {
      width: 90px;
      height: 90px;
      background: #ff6b4a;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: auto;
    }

    .logo-circle span {
      font-size: 36px;
      color: #ffffff;
    }

    .welcome-text {
      margin-top: 20px;
      font-size: 26px;
      color: #ffffff;
      font-weight: 600;
      font-family: "Comic Sans MS", cursive, sans-serif;
    }

    /* BODY */
    .email-body {
      padding: 40px 30px;
      text-align: left;
    }

    .email-body h1 {
      font-size: 22px;
      color: #111827;
      margin-bottom: 16px;
    }

    .email-body p {
      font-size: 15px;
      color: #4b5563;
      line-height: 1.7;
      margin-bottom: 20px;
    }

    /* BUTTON */
    .btn-wrapper {
      text-align: center;
      margin-top: 30px;
    }

    .btn {
      display: inline-block;
      background: #7ac143;
      color: #ffffff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 15px;
      font-weight: 600;
    }

    .btn:hover {
      opacity: 0.9;
    }

    /* FOOTER */
    .email-footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }

    .brand {
      margin-top: 8px;
      font-weight: 600;
      letter-spacing: 1px;
      color: #6b7280;
    }
  </style>
</head>

<body>
  <div class="email-wrapper">
    <div class="email-container">

      <!-- HEADER -->
      <div class="email-header">
        <div class="logo-circle">
          🤝
        </div>
        <div class="welcome-text">Welcome!</div>
      </div>

      <!-- BODY -->
      <div class="email-body">
        <h1>${title}</h1>

        <p>${message.replace(/\n/g, "<br/>")}</p>

        <div class="btn-wrapper">
          <a href="${buttonLink}" class="btn">
            ${buttonText}
          </a>
        </div>

        <p style="margin-top: 30px;">
          — Team Juzdrop
        </p>
      </div>

      <!-- FOOTER -->
      <div class="email-footer">
        © ${new Date().getFullYear()} Juzdrop. All rights reserved.
        <div class="brand">JUZDROP</div>
      </div>

    </div>
  </div>
</body>
</html>
`;
};
