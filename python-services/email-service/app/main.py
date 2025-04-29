from fastapi import FastAPI
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

class AlertRequest(BaseModel):
    bloodGroup: str
    availableQuantity: int
    requestedQuantity: int
    organisationId: str
    to_email: str

@app.post("/send-alert")
async def send_alert(alert: AlertRequest):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    smtp_email = os.getenv("SMTP_EMAIL")
    smtp_password = os.getenv("SMTP_PASSWORD")

    # ✅ Make sure this is indented correctly
    html_content = f"""
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body {{
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 20px;
          }}
          .container {{
            max-width: 600px;
            background-color: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: auto;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
          }}
          .header {{
            color: #d00000;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
          }}
          .details p {{
            font-size: 16px;
            margin: 8px 0;
            line-height: 1.5;
          }}
          .urgent {{
            color: #0033cc;
            font-weight: bold;
            text-align: center;
            margin-top: 20px;
          }}
          .footer {{
            margin-top: 30px;
            text-align: center;
            font-size: 13px;
            color: #777;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }}
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">🚨 Low Blood Stock Alert!</div>
          <div class="details">
            <p><strong>Organisation ID:</strong> {alert.organisationId}</p>
            <p><strong>Blood Group:</strong> {alert.bloodGroup}</p>
            <p><strong>Available Quantity:</strong> {alert.availableQuantity} ML</p>
            <p><strong>Requested Quantity:</strong> {alert.requestedQuantity} ML</p>
          </div>
          <p class="urgent">Please arrange additional donors urgently. Thank you!</p>
          <div class="footer">Blood Bank Management System</div>
        </div>
      </body>
    </html>
    """

    try:
        msg = MIMEText(html_content, "html")
        msg["Subject"] = f"⚠️ Low Blood Stock Alert: {alert.bloodGroup}"
        msg["From"] = smtp_email
        msg["To"] = alert.to_email

        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(smtp_email, smtp_password)
            server.sendmail(smtp_email, [alert.to_email], msg.as_string())

        return {"success": True, "message": "HTML Email sent successfully!"}
    except Exception as e:
        return {"success": False, "message": str(e)}
