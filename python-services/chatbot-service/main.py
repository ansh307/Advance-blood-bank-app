from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from pydantic import BaseModel
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load and preprocess intents
with open("intents.json", "r", encoding="utf-8") as f:
    intents = json.load(f)

patterns, tags = [], []
for intent in intents:
    for pattern in intent["patterns"]:
        patterns.append(pattern)
        tags.append(intent["tag"])

vectorizer = TfidfVectorizer()
x = vectorizer.fit_transform(patterns)
clf = LogisticRegression()
clf.fit(x, tags)

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    text: str

session_context = {}

@app.post("/chat")
def get_response(msg: Message):
    user_input = msg.text
    user_id = "default_user"  # Placeholder; in real use, pass user ID
    vec = vectorizer.transform([user_input])
    tag = clf.predict(vec)[0]

    context = session_context.get(user_id, None)

    for intent in intents:
        if intent["tag"] == tag:
            # Handle context filtering
            if "context_filter" in intent:
                if not context or context not in intent["context_filter"]:
                    continue

            # Set new context if any
            if intent.get("context_set"):
                session_context[user_id] = intent["context_set"]

            responses = intent.get("responses", [])
            return {"response": random.choice(responses)}

    return {"response": "I didn't understand that. Can you rephrase?"}


