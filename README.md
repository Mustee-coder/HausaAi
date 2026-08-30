# HausaAI

**AI that speaks your language.**

HausaAI is an AI assistant built specifically for Hausa-speaking Nigerians, powered by Meta's Llama 3.3 70B model. It helps people chat, translate between Hausa and English, understand job postings, and learn new topics — all in natural, modern Hausa.

🔗 **Live app:** [hausa-ai-two.vercel.app](https://hausa-ai-two.vercel.app)
🔗 **API:** [hausaai.onrender.com](https://hausaai.onrender.com)

> Built for the **AI Academy Nigeria Pitchathon** (Meta × 3MTT × RAIN).

---

## The Problem

Millions of Hausa-speaking Nigerians use the internet and AI tools every day, but English still remains the main gateway to these technologies. Many people have smartphones and internet access, but language remains a barrier to fully benefiting from AI — especially in education, job access, and everyday information. Existing AI tools were not designed with Hausa speakers or the Nigerian context as a primary focus.

## The Solution

HausaAI is an AI assistant built specifically for Hausa-speaking Nigerians, powered by Meta's Llama model. It helps people chat, translate between Hausa and English, understand job postings, and learn new topics — all in natural Hausa. It's built around a simple framework: **Learn → Communicate → Work.**

## Features

| Mode | Description |
|------|-------------|
| 💬 **Chat** | General conversation with real-time web search for current events |
| 🌍 **Translate** | Strict, accurate Hausa ↔ English translation — no added commentary |
| 💼 **Job Assistant** | Extracts job details without inventing skills, salary, or requirements |
| 📚 **Learn** | AI tutor covering programming and everyday topics, in natural Hausa |

Every mode is powered by the same underlying AI service, guided by mode-specific prompts that keep responses accurate and natural. Chat mode also supports persistent conversation history — users can revisit or delete past conversations at any time.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** MongoDB Atlas
- **AI:** Meta Llama 3.3 70B Instruct, via Hugging Face Inference Providers
- **Search:** Tavily (real-time web search for Chat mode)
- **Auth:** JWT with secure HTTP-only cookies
- **Deployment:** Vercel (frontend), Render (backend)

## Architecture

```
Frontend (React) → Backend API (Express) → AI Service Layer → Meta Llama (Hugging Face) → Response
```

The AI provider is isolated in a single service layer, making it easy to swap providers without touching the rest of the application.

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string
- Hugging Face API token (for Llama access)
- Tavily API key (for web search)

### Backend
```bash
cd backend
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, HF_TOKEN, TAVILY_API_KEY, CLIENT_URL
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Status

HausaAI is a working MVP — fully deployed, tested, and live. Current focus is onboarding real Hausa-speaking users for feedback ahead of wider release.

**Roadmap:** voice input, WhatsApp integration, local business assistant, personalized AI tutoring at scale.

---

Built by **Mujittapha Magaji** · Mustee Digital Labs · Kano, Nigeria
