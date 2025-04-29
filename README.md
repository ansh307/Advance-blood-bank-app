# 🩸 BloodBank Management App

A full-stack **MERN application** integrated with powerful **Python microservices** for chatbot support, PDF generation, and automated email communication. Designed to streamline blood donation processes, connect donors and recipients, and simplify operational tasks.

---

## 📦 Tech Stack

### Frontend
- **React.js** with modern UI components
- Fully responsive and user-friendly design

### Backend (MERN)
- **Node.js**, **Express.js**, **MongoDB**
- RESTful API architecture

### Python Microservices
| Service         | Description                                                      |
|----------------|------------------------------------------------------------------|
| 🤖 Chatbot      | NLP-based chatbot using FastAPI, spaCy, and Scikit-learn         |
| 🧾 PDF Service  | Dynamically generates PDFs (e.g. donation certificates, reports) |
| 📧 Email Service| Sends confirmation, notification, and follow-up emails          |

---

## 🚀 Features

- 🩸 Donor and recipient registration
- 🔍 Search for donor
- 🤖 Smart chatbot with context-aware responses and entity recognition
- 📄 Auto-generated PDF summaries and certificates
- 📧 Email notifications for donations, reminders, and receipts

---

## ⚙️ Architecture

```
React (Frontend) 
     ↓
Node.js + Express (Backend API)
     ↓
[Python Microservices]
 ├── Chatbot (FastAPI)
 ├── PDF Generator (Flask/FastAPI)
 └── Email Sender (SMTP/FastAPI)
```

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bloodbank-app.git
cd bloodbank-app
```

### 2. Start MERN frontend and backend and all the microservices

```bash
npm install
npm run dev
```

---

## 📁 Project Structure

```
bloodbank-app/
├── frontend/               # React frontend
├── services/
│   ├── chatbot/            # FastAPI-based NLP chatbot
│   ├── pdf_service/        # PDF generation logic
│   └── email_service/      # Email sending logic
├── server.js
└── README.md
```


## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.


---

## 🙌 Acknowledgements

- [spaCy](https://spacy.io/)
- [scikit-learn](https://scikit-learn.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [MongoDB](https://www.mongodb.com/)
```

---

Would you like me to generate a second version with deployment details (Docker, NGINX, etc.) as well?
