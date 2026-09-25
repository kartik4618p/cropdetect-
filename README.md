# 🌾 CropCareAI — AI-Powered Farming Assistant

> **An intelligent AI-powered agricultural assistant designed to help Indian farmers with crop-related queries, disease identification, farming guidance, and voice-based interaction.**

CropCareAI is a full-stack agricultural assistance platform that combines **Artificial Intelligence, Computer Vision, Speech Processing, and a modern web application** to provide farmers with accessible and practical farming support.

The system allows users to interact with an AI agricultural assistant using **text, voice, and images**, making technology more accessible to farmers who may not be comfortable with traditional text-based applications.

---

## 🚀 Key Features

### 🤖 AI Agricultural Assistant

* AI-powered conversational assistant for farming-related queries
* Provides crop and agriculture-related recommendations
* Understands natural-language questions
* Designed with Indian farming scenarios in mind
* Supports contextual conversations

### 🌱 Crop & Plant Disease Assistance

* Upload crop/plant images for AI-based analysis
* Helps identify potential plant diseases
* Provides possible causes and recommended actions
* Useful for early identification of crop problems

### 🎙️ Voice Interaction

* Speech-to-Text support using **Groq Whisper**
* Allows users to ask questions using their voice
* Text-to-Speech support for AI responses
* Designed to make the system easier to use for farmers

### 🗣️ Multimodal Interaction

Users can interact with the assistant through:

```text
💬 Text
🎙️ Voice
📷 Images
```

This makes CropCareAI more flexible than a traditional text-only chatbot.

### ⚡ Fast AI Processing

The AI service is built using lightweight Python services and modern AI APIs to provide responsive interactions.

### 🔐 Backend API

A separate Django backend handles application-level backend functionality and communication between the frontend and AI service.

### 📱 Responsive Interface

The frontend is designed to provide a clean and accessible interface across desktop and mobile devices.

---

# 🏗️ System Architecture

CropCareAI consists of three major components:

```text
                   ┌─────────────────────┐
                   │      Frontend       │
                   │   Web Application   │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │    Django Backend   │
                   │      REST APIs      │
                   └──────────┬──────────┘
                              │
                              ▼
                   ┌─────────────────────┐
                   │     AI Service      │
                   │   Flask + Python    │
                   └──────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             ▼                ▼                ▼
        ┌─────────┐      ┌─────────┐      ┌─────────┐
        │   LLM   │      │ Whisper │      │   TTS   │
        │   AI    │      │   STT   │      │  Voice  │
        └─────────┘      └─────────┘      └─────────┘
```

### Request Flow

```text
User
 │
 ▼
Frontend
 │
 ▼
Django Backend
 │
 ▼
AI Service
 │
 ├──► LLM → Generates response
 │
 ├──► Whisper → Converts speech to text
 │
 └──► TTS → Converts response to speech
 │
 ▼
Frontend
 │
 ▼
User
```

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3

## Backend

* Python
* Django
* Django REST Framework

## AI Service

* Python
* Flask
* Groq API
* LLM
* Whisper
* Text-to-Speech

## AI / ML

| Component      | Technology                      |
| -------------- | ------------------------------- |
| Language Model | `openai/gpt-oss-120b`           |
| Speech-to-Text | `whisper-large-v3-turbo`        |
| Text-to-Speech | `canopylabs/orpheus-v1-english` |
| AI API         | Groq                            |

## Infrastructure

* Redis
* REST APIs
* Environment Variables
* `uv` Python package manager

---

# 📂 Project Structure

```text
CropCareAi/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── package.json
│   ├── src/
│   └── ...
│
├── CropCareAI-Bot/
│   ├── run.py
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── ...
│
└── README.md
```

### `frontend/`

Contains the user-facing web application.

### `backend/`

Contains the Django backend and application APIs.

### `CropCareAI-Bot/`

Contains the AI-powered conversational service responsible for processing user queries, speech, and AI responses.

---

# ⚙️ Installation & Setup

## 1. Clone the Repository

```bash
git clone https://github.com/Harshdubey04/CropCareAi.git
```

Move into the project:

```bash
cd CropCareAi
```

---

# 🔧 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create and activate a virtual environment if required:

### Windows

```powershell
python -m venv venv
.\venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run migrations:

```bash
python manage.py migrate
```

Start the Django server:

```bash
python manage.py runserver
```

Backend will normally be available at:

```text
http://127.0.0.1:8000
```

---

# 🤖 AI Service Setup

Open a **new terminal**.

Navigate to:

```bash
cd CropCareAi/CropCareAI-Bot
```

Install dependencies if they haven't already been installed:

```bash
uv sync
```

Create a `.env` file inside `CropCareAI-Bot`:

```env
GROQ_API_KEY=your_groq_api_key
```

Start the AI service:

```bash
uv run python run.py
```

The AI service will start on its configured Flask port.

> ⚠️ Never commit your `.env` file or API keys to GitHub.

---

# 🌐 Frontend Setup

Open another terminal:

```bash
cd CropCareAi/frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will provide a local URL, typically:

```text
http://localhost:5173
```

---

# ▶️ Running the Complete Application

CropCareAI requires the frontend, backend, and AI service to run simultaneously.

### Terminal 1 — Django Backend

```powershell
cd CropCareAi\backend
.\venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 — AI Service

```powershell
cd CropCareAi\CropCareAI-Bot
uv run python run.py
```

### Terminal 3 — Frontend

```powershell
cd CropCareAi\frontend
npm run dev
```

Then open the frontend URL provided by Vite.

---

# 🔑 Environment Variables

The AI service requires API credentials.

Example:

```env
GROQ_API_KEY=your_groq_api_key
```

Depending on the configuration of the backend/frontend, additional environment variables may be required.

### Recommended `.gitignore`

```gitignore
.env
.env.*
venv/
__pycache__/
node_modules/
*.pyc
```

---

# 🧠 AI Pipeline

CropCareAI uses multiple AI components to create a multimodal farming assistant.

### Text Query

```text
User Question
      ↓
AI Service
      ↓
Language Model
      ↓
Agricultural Response
      ↓
User
```

### Voice Query

```text
User Voice
     ↓
Whisper STT
     ↓
Text
     ↓
Language Model
     ↓
AI Response
     ↓
Text-to-Speech
     ↓
Audio Response
```

### Image Query

```text
Crop Image
     ↓
AI Vision Processing
     ↓
Disease / Crop Analysis
     ↓
AI Recommendation
     ↓
User
```

---

# 🌾 Example Use Cases

CropCareAI can assist farmers with questions such as:

```text
"What fertilizer should I use for wheat?"

"My tomato leaves are turning yellow. What could be the reason?"

"How often should I irrigate my crop?"

"What are the symptoms of this plant disease?"

"How can I prevent pests from damaging my crop?"
```

The assistant can provide general agricultural guidance based on the information supplied by the user.

> **Note:** AI-generated recommendations should be treated as guidance and verified with local agricultural experts before making high-impact farming decisions.

---

# 🔮 Future Improvements

Some potential improvements include:

* 🌐 Support for more Indian languages
* 🗣️ Improved regional-language voice interaction
* 📷 Better crop disease detection
* 🌦️ Weather-based recommendations
* 🌱 Personalized crop recommendations
* 📍 Location-aware agricultural advice
* 💰 Market-price information
* 🧑‍🌾 Farmer profile and crop history
* 📊 Crop monitoring dashboard
* 📱 Progressive Web App / mobile application
* 🔔 Farming reminders and notifications
* 🛰️ Satellite-based crop monitoring

---

# 🔒 Security

The project uses environment variables for sensitive API credentials.

**Never expose API keys in:**

* Source code
* GitHub repositories
* Frontend JavaScript
* Screenshots
* README files

Use `.env` files for local development and proper secret management for production deployments.

---

# 🧪 Development

For development, run all three services simultaneously:

```text
Frontend     → localhost:5173
Django       → localhost:8000
AI Service   → configured Flask port
```

Each service can be developed and tested independently.

---

# 📸 Screenshots

Add screenshots of the application here:

```text
screenshots/
├── home.png
├── chatbot.png
├── voice-assistant.png
├── image-analysis.png
└── mobile.png
```

Example:

```markdown
## 📸 Screenshots

### Home

![CropCareAI Home](screenshots/home.png)

### AI Assistant

![AI Assistant](screenshots/chatbot.png)

### Voice Assistant

![Voice Assistant](screenshots/voice-assistant.png)
```

---

# 🎯 Project Goal

The goal of **CropCareAI** is to make modern AI technology more accessible to farmers by providing an easy-to-use assistant capable of understanding **text, voice, and visual inputs**.

Instead of requiring users to navigate complex agricultural resources, CropCareAI aims to provide useful farming information through a simple conversational interface.

---

# 👨‍💻 Authors

**Harsh Dubey,Kartik Sharma**

Computer Science Engineering Student
Full-Stack & AI Developer

GitHub:
https://github.com/Harshdubey04

---

# ⭐ Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch

```bash
git checkout -b feature/your-feature
```

3. Make your changes
4. Commit your changes

```bash
git commit -m "Add your feature"
```

5. Push the branch

```bash
git push origin feature/your-feature
```

6. Open a Pull Request

---

# 📄 License

This project is intended for educational and development purposes.

---

## ⭐ Support

If you find **CropCareAI** useful, consider giving the repository a ⭐ on GitHub.

**Built with ❤️ and AI for Indian Agriculture. 🌾🤖**
