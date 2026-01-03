# MedInsight AI - Medical Report Analysis Platform

A comprehensive AI-powered platform to help patients understand their medical test reports through automated parsing, analysis, and patient-friendly explanations.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)
![Tech Stack](https://img.shields.io/badge/OpenAI-GPT--4o-412991?logo=openai)
![Tech Stack](https://img.shields.io/badge/Supabase-Storage%20%26%20DB-3ECF8E?logo=supabase)

## ✨ Features

- **📄 Report Upload & Analysis** - Upload PDF or image medical reports for instant AI analysis
- **🔬 Medical Term Simplification** - Complex terminology explained in simple language
- **🚨 Abnormal Value Detection** - Automatic flagging with color-coded indicators (🟢🟡🔴)
- **💡 Health Insights & Alerts** - Clear guidance for values needing attention
- **📊 Visual Analytics** - Interactive charts for understanding health data
- **🏥 Health Score** - Overall health score (0-100) based on test results

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 15, Tailwind CSS, Framer Motion, Recharts |
| Backend | FastAPI (Python) |
| AI | OpenAI GPT-4o Vision |
| Database | Supabase (PostgreSQL) |
| Storage | Supabase Storage |
| Hosting | Vercel (Frontend), Any Python host (Backend) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API Key
- Supabase Account (optional for demo)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your credentials
npm run dev
```

### Backend Setup

```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
# Edit .env with your credentials
uvicorn app.main:app --reload --port 8000
```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Create a storage bucket named `medical-reports`
4. Copy your credentials to the `.env` files

## 📁 Project Structure

```
medicalRepoInterpret/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   │   ├── ui/          # Header, Footer
│   │   │   ├── upload/      # Upload zone
│   │   │   ├── results/     # Test cards, health gauge
│   │   │   └── charts/      # Recharts visualizations
│   │   └── lib/             # API client, Supabase
│   └── public/
│
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py          # Entry point
│   │   ├── routers/         # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── models/          # Pydantic schemas
│   │   └── prompts/         # AI prompts
│   └── requirements.txt
│
└── supabase/
    └── schema.sql           # Database schema
```

## 🎨 UI Features

- **Dark Mode** - Premium dark theme with glassmorphism
- **Responsive** - Works on desktop, tablet, and mobile
- **Animations** - Smooth transitions with Framer Motion
- **Color-coded** - Status indicators for easy reading

## 🔒 Security

- No data stored permanently (optional Supabase storage)
- HIPAA compliance considerations
- Medical disclaimer prominently displayed

## ⚠️ Disclaimer

> **Medical Disclaimer**: This platform does not provide medical diagnosis. The information provided is for educational purposes only and should not be considered medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment.

## 📄 License

MIT License - Built for hackathon demonstration purposes.
