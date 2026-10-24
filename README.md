# 🦥 SlothTriage — The Async Cognitive Buffer That Eliminates Communication Dread

> **The Intelligent 3-Bucket Communication Buffer for Developers & Remote Workers**  
> _Drop unformatted Slack threads, email backlogs, and noisy chat dumps into a zero-effort triage canvas. Automatically separate high-priority actions with pre-drafted replies from parked references and composted noise._

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/Ankit-Kum-ar/slothtriage)
[![Next.js](https://img.shields.io/badge/Next.js-16.4_Turbopack-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Google Gemma AI](https://img.shields.io/badge/Google_Gemma-2_27B_--_Open_Weights-4285F4?style=flat&logo=google)](https://ai.google.dev/gemma)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat&logo=shadcnui)](https://ui.shadcn.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🚀 Repository & Live Application

- **💻 GitHub Source:** [https://github.com/Ankit-Kum-ar/slothtriage](https://github.com/Ankit-Kum-ar/slothtriage)
- **🌐 Deployed Demo:** _(Add your deployed Vercel URL here)_

---

## 📌 Problem Statement: The Communication Dread Dilemma

Remote engineers, tech leads, and freelancers experience chronic cognitive fatigue from accumulating unread communications. Returning from deep work or a weekend to 60 unread Slack messages, 25 email chains, and CI/CD alert spam induces genuine **communication dread**:

- **Signal Buried in Fluff:** Urgent staging incident reports sit right next to food truck chatter and bot pings.
- **Context Switching Paralysis:** Reviewing raw backlogs drains valuable focus before writing a single line of code.
- **The Drafting Tax:** The hardest part of communication isn't reading—it's formulating polite, professional replies under cognitive fatigue, leading to delayed decisions and procrastination.

---

## 💡 The Core Innovation: The 3-Bucket Async Cognitive Buffer

Inspired by nature's ultimate energy conservation champion (the sloth 🦥), **SlothTriage** rejects the culture of frantic real-time reactivity. Instead, you dump messy backlog text into a single triage canvas. Powered by **Google Gemma 2 (27B & 9B open-weight models)** and stored in **MongoDB Atlas**, SlothTriage instantly separates all messages into three strict buckets:

```text
                                 [ Raw Backlog Dump ]
                      (Slack threads, email digests, Discord chats)
                                         │
                                         ▼
                     ┌───────────────────────────────────────┐
                     │ Google Gemma 2 Cognitive Triage Engine│
                     └───────────────────────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
         🔴 [ ACT BUCKET ]       🟡 [ PARK BUCKET ]     🟢 [ COMPOST BUCKET ]
         Critical decisions only   Informational updates   Noise, banter & bot alerts
         with pre-drafted,         with 1-line summaries   pruned completely with
         1-click copy replies.     and hashtag badges.     audit reasons.
                 │                       │                       │
                 └───────────────────────┼───────────────────────┘
                                         ▼
                    ┌─────────────────────────────────────────┐
                    │      MongoDB Atlas Operational Store    │
                    │   Indexed Sessions, Search & Analytics  │
                    └─────────────────────────────────────────┘
```

1. **🔴 Act (High Priority):** Critical decisions requiring human approval. For every item, Gemma drafts a concise, professional reply ready to copy with a single click.
2. **🟡 Park (Informational):** Low-urgency notices (e.g., AWS S3 pricing updates, scheduled database maintenance). Summarized in one sentence, tagged with hashtags (`#aws`, `#billing`), and archived into MongoDB Atlas.
3. **🟢 Compost (Noise):** Casual banter, coffee plans, bot greetings, and noise pruned so you never waste attention reading them.
4. **⚡ The "Lazy Payoff" Metric:** Quantifies exact time saved (`Reading Time Reclaimed = Raw Words Avoided ÷ 200 wpm` + `Drafting Time Saved = Action Items × 3.0 min`).

---

## ✨ Key Features

- **⚡ Zero-Effort Triage Canvas (`/`):** Paste messy text or click 1-click test scenarios (`🚨 Staging Outage`, `📧 S3 Pricing & Security Digest`) to triage in seconds.
- **🧠 Google Gemma Open-Weights Engine:** Structured schema generation via OpenRouter with multi-model fallback (`google/gemma-2-27b-it`, `google/gemma-2-9b-it:free`, `google/gemma-3-12b-it:free`).
- **📋 1-Click Copy Suggested Replies:** Ready-to-send responses pre-drafted for each action item with visual checkmark feedback.
- **🗄️ Searchable Triage Archive (`/archive`):** Dedicated archive page with full-text search, channel filters (`Slack Thread`, `Email Digest`, `Discord`, `GitHub`), and expandable session cards with 1-click copy buttons.
- **📊 Cognitive Analytics & ROI Dashboard (`/analytics`):** Interactive Recharts dashboards visualizing cumulative minutes reclaimed, information density distribution (donut chart), and backlog source comparisons.
- **ℹ️ Philosophy & About Page (`/about`):** Detailed breakdown of the International Sloth Day theme, why slowing down speeds up output, and the productivity formula.
- **🌓 Light / Dark Mode Toggle:** Seamless theme switcher with zero-flash layout head script and persistent `localStorage` support.
- **📱 100% Mobile Responsive:** Built with DashStack design tokens and a **shadcn Sheet navigation drawer** for smartphones and tablets.

---

## 🏗️ Architectural Flow

```text
[ 1. User Drops Backlog ]
Selects channel (Slack / Email / Discord / GitHub) or clicks 1-Click Sample Preset
                       │
                       ▼ User clicks "Perform Sloth Triage"
POST /api/triage
  ├── Google Gemma 2 (OpenRouter): Analyzes text, extracts buckets, drafts replies
  ├── Metrics Engine: Computes raw words, compressed words, reduction ratio, time saved
  └── MongoDB Atlas: Persists complete triage session document with unique ObjectId
                       │
                       ▼
[ 2. Interactive Triage Board (/) ]
Celebration confetti fires! Displays Lazy Payoff Card:
  ├── ~X.Xm Time Saved (Reading + Drafting)
  ├── Words Avoided (Fluff bypassed)
  ├── Noise Reduction % (Density ratio)
  └── Executive Summary
Plus 3 Interactive Tabs:
  ├── Act: Urgency badge, context & 1-click "Copy Suggested Reply"
  ├── Park: Subject, summary & hashtag badges
  └── Compost: Filtered noise with strikethrough & pruning reasons
                       │
                       ▼
[ 3. Dedicated Triage Archive (/archive) ]
Full-text search & channel filters to inspect any past session,
view historical action items, and copy pre-drafted replies anytime.
                       │
                       ▼
[ 4. Cognitive Analytics Dashboard (/analytics) ]
Recharts visualizations tracking cumulative time reclaimed over time,
3-bucket ratio distribution, and backlog channel volume.
```

---

## 🛠️ Tech Stack & Dependencies

- **Frontend Framework:** [Next.js 16.4](https://nextjs.org/) (Turbopack, App Router, React 19, TypeScript)
- **Styling & Design System:** [Tailwind CSS v4](https://tailwindcss.com/) with DashStack theme tokens (`#4880ff` primary, `#f5f6fa` light background, `#1b2431` dark background)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) (`sheet`, `tabs`, `badge`, `card`, `button`, `textarea`)
- **Database:** [MongoDB Atlas](https://www.mongodb.com/atlas) with cached global connection pool
- **AI Inference Engine:** [OpenRouter API](https://openrouter.ai/) (Primary: `google/gemma-2-27b-it`, Fallback: `google/gemma-2-9b-it:free`, `google/gemma-3-12b-it:free`)
- **Data Visualization:** [Recharts 3](https://recharts.org/) (`AreaChart`, `BarChart`, `PieChart`, `ResponsiveContainer`)
- **Icons & Polish:** `lucide-react`, `canvas-confetti`

## 🚀 Getting Started Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Ankit-Kum-ar/slothtriage.git
cd slothtriage
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env` or `.env.local` file in the project root:

```env
# MongoDB Atlas Connection
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/slothtriage?retryWrites=true&w=majority"

# OpenRouter API Key (Gemma 2 27B / Gemma 2 9B)
OPENROUTER_API_KEY="your_openrouter_api_key"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
