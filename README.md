🤖 AI Study Assistant

An AI-powered study assistant that helps students learn from their own study materials using AI and Retrieval-Augmented Generation (RAG).

The project is being developed step-by-step, starting with a simple MVP and gradually adding more advanced AI features.

---

🎯 Project Goal

The main goal is to build an AI tutor that can:

- Upload and understand study materials
- Answer questions based on uploaded documents
- Generate quizzes
- Evaluate answers
- Track learning progress
- Identify weak topics
- Create personalized study plans

---

🚀 Current MVP

The first version focuses on:

Upload PDF
    ↓
Extract Text
    ↓
Create Embeddings
    ↓
Store in Vector Database
    ↓
Ask Questions
    ↓
Retrieve Relevant Content
    ↓
Generate AI Answer

The initial target is:

PDF → RAG → AI Study Chat

---

🛠️ Technology Stack

Frontend

- React
- JavaScript
- HTML/CSS

Backend

- Python
- FastAPI

Database

- PostgreSQL

AI

- OpenAI / Gemini API
- Embeddings
- RAG

Vector Database

- ChromaDB

AI Frameworks

- LangChain
- LangGraph (later)

---

📂 Project Structure

ai-study-assistant/
│
├── frontend/
│
├── backend/
│
├── docs/
│
├── .gitignore
├── README.md
└── LICENSE

The structure will evolve as the project grows.

---

🧠 How It Works

The system will process uploaded study materials and make their content searchable.

When a student asks a question:

Student Question
       ↓
Create Query Embedding
       ↓
Search Vector Database
       ↓
Retrieve Relevant Content
       ↓
Send Context + Question to LLM
       ↓
Generate Answer

This allows the AI to answer questions using information from the student's uploaded study material.

---

📌 Current Status

🚧 Currently in development

Current focus:

Frontend → FastAPI Backend → PDF Processing → RAG

More features will be added as the project develops.
