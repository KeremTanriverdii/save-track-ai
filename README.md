# SaveTrack AI 💸📊  
**AI-powered Personal Finance & Expense Tracking Application**

SaveTrack AI is a modern personal finance management application that helps users track expenses, manage monthly budgets, analyze spending behavior, and receive AI-powered financial insights.

Built with **Next.js App Router**, **Firebase**, and **Google Gemini AI**, the project focuses on clean architecture, real-world financial workflows, and scalable analytics.

---

## 🚀 Features

### 🔐 Authentication & Sessions
- Firebase Authentication (Email/Password, Google, Apple)
- Secure **session-based auth** using HTTP-only cookies
- Server-side user verification with Firebase Admin SDK

### 💳 Expense Management
- Add, update, and delete expenses
- Monthly-based expense filtering
- Subscription expense detection (lazy background check)
- Category-based tracking

### 📅 Budget System
- Monthly budget definition
- Remaining budget calculation
- Overspending detection per category
- Currency support (₺, $, €)

### 📈 Analytics Dashboard
- Daily spending charts
- Monthly totals & averages
- Top spending categories
- Budget vs expense comparison
- Visual insights with charts

### 🤖 AI Coach (Gemini AI)
- Monthly financial behavior analysis
- Risky category detection
- Spending pattern interpretation
- Exactly **3 actionable suggestions**
- AI results stored & printable as PDF

### 🧾 Reports
- AI analysis saved per month
- Detailed AI insight view
- Export AI reports as PDF

---

## 🧠 AI Insight Flow

1. User navigates to **Analytics**
2. Monthly data is aggregated:
   - Totals
   - Averages
   - Daily distribution
   - Category breakdown
   - Overspend areas
3. Data is sent to **Gemini AI**
4. AI responds in a **strict JSON schema**
5. Result is stored in Firestore
6. UI revalidated via `revalidateTag`

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 14 (App Router)**
- React Server & Client Components
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer-ready architecture

### Backend
- Next.js API Routes
- Firebase Admin SDK
- Firestore
- Secure session cookies

### AI
- Google Gemini (`gemini-2.0-flash`)
- Structured JSON response schema
- Prompt-engineered financial analysis

## 🔐 Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
GEMINI_API_KEY="your api key"
VERTEX_API_KEY="your api key"
FIREBASE_TYPE='...'
FIREBASE_PROJECT_ID="..."
FIREBASE_PRIVATE_KEY_ID="..."
FIREBASE_PRIVATE_KEY="" /// Firebase private key must be properly escaped (\n).
FIREBASE_CLIENT_ID="..."
FIREBASE_AUTH_URI="..."
FIREBASE_TOKEN_URI="..."
FIREBASE_AUTH_PROVIDER_X509_CERT_URL="..."
FIREBASE_CLIENT_X509_CERT_URL= "..."
FIREBASE_UNIVERSE_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="...."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
```

## Getting Started

First, run the development server:

```bash
npm install and 
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
## Check the site: https://savetrackai.keremtanriverdi.com
