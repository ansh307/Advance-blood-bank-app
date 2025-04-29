from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from weasyprint import HTML
from jinja2 import Environment, FileSystemLoader
import io
import os
from datetime import datetime
import pytz


app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-pdf")
async def generate_pdf(request: Request):
    try:
        data = await request.json()
        records = data.get("records", [])

        # Format 'createdAt' field
        for record in records:
            try:
                dt = datetime.fromisoformat(record["createdAt"].replace("Z", "+00:00"))  # Handle ISO 8601 format
                local_dt = dt.astimezone(pytz.timezone("Asia/Kolkata"))  # or your preferred timezone
                record["createdAt"] = local_dt.strftime("%B %d, %Y, %I:%M %p")  # e.g., April 29, 2025, 09:15 PM
            except Exception:
                pass  # Skip formatting if 'createdAt' is invalid

        # Load template
        template_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "templates"))
        env = Environment(loader=FileSystemLoader(template_dir))
        template = env.get_template("report.html")

        # Render HTML and generate PDF
        html_content = template.render(records=records)
        pdf_bytes = HTML(string=html_content).write_pdf()

        return StreamingResponse(
            io.BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=blood_inventory_report.pdf"}
        )

    except Exception as e:
        print("Error generating PDF:", str(e))
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )
