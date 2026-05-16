# Fake News Detector AI

> Production-grade machine learning that classifies news articles as **REAL** or **FAKE** in milliseconds. Polished GitHub-dark SaaS dashboard with auth, history, and analytics.

![status](https://img.shields.io/badge/status-production--ready-3FB950?style=flat-square)
![next.js](https://img.shields.io/badge/Next.js-14-000?style=flat-square&logo=next.js)
![fastapi](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)
![scikit](https://img.shields.io/badge/scikit--learn-1.5-F7931E?style=flat-square&logo=scikit-learn)

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind, Framer Motion, Recharts |
| Auth | NextAuth (credentials) + bcrypt + JWT |
| Database | SQLite via Prisma (Postgres-ready) |
| ML Service | FastAPI · scikit-learn · TF-IDF + Logistic Regression · NLTK |
| Deploy | Vercel (frontend) · Render or Docker (ML) |

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│  Browser        │ ───────▶│  Next.js 14      │ ───────▶│  FastAPI ML    │
│  React UI       │         │  /api/predict    │  HTTP   │  /predict      │
└─────────────────┘         │  Prisma + Auth   │         │  scikit-learn  │
                            └────────┬─────────┘         └────────────────┘
                                     │
                                     ▼
                            ┌──────────────────┐
                            │  SQLite          │
                            │  User · History  │
                            └──────────────────┘
```

## Project layout

```
.
├── frontend/                 # Next.js 14 + TypeScript
│   ├── app/                  # App Router pages, API routes
│   ├── components/           # UI primitives, landing, dashboard
│   ├── lib/                  # auth, prisma, ml-client, rate-limit, utils
│   ├── prisma/               # schema + sqlite db
│   └── types/                # NextAuth augments
│
├── backend-ml/               # FastAPI ML microservice
│   ├── api.py                # FastAPI app  (POST /predict)
│   ├── train.py              # Train TF-IDF + LogReg
│   ├── predict.py            # Inference + insights
│   ├── preprocessing.py      # NLTK cleaning pipeline
│   ├── download_dataset.py   # Optional Kaggle pull
│   ├── data/seed.csv         # Bundled 40-row demo dataset
│   ├── model/                # Generated: vectorizer.pkl + model.pkl
│   ├── requirements.txt
│   └── Dockerfile
│
├── vercel.json               # Frontend deploy config
├── render.yaml               # ML deploy config (Render)
└── .env.example              # Documented environment vars
```

## Quick start (local dev)

You'll run **two services** side-by-side: the FastAPI ML backend and the Next.js frontend.

### 1. Train the model

```bash
cd backend-ml
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python train.py
```

This produces `model/vectorizer.pkl` and `model/model.pkl` from the bundled seed dataset.

### 2. Start the ML API

```bash
# still in backend-ml/
uvicorn api:app --reload --port 8000
```

Sanity check: <http://127.0.0.1:8000/health>

### 3. Start the frontend

```bash
cd ../frontend
npm install
cp ../.env.example .env       # then edit secrets
npx prisma db push            # creates the SQLite db
npm run dev
```

Open <http://localhost:3000>, register an account, drop in a news article, and watch the classifier work.

## Using the full Kaggle dataset

The bundled `data/seed.csv` is a tiny 40-row demo — accuracy on real-world inputs will be limited. For production-grade performance, pull the Kaggle [Fake and Real News Dataset](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset):

```bash
cd backend-ml
pip install kaggle
# Place your kaggle.json at ~/.kaggle/kaggle.json (chmod 600)
python download_dataset.py
python train.py
```

Expected accuracy on the Kaggle benchmark: ~98%.

## API reference

### `POST /api/predict` (Next.js)

Authenticated. Rate-limited to 30 requests/min/user.

```json
// Request
{ "text": "A news article (20–20,000 chars)" }

// Response
{
  "prediction": "FAKE",
  "confidence": 92.34,
  "probabilities": { "real": 0.0766, "fake": 0.9234 },
  "insights": [
    "Model is highly confident this article is fake.",
    "Detected 7 all-caps words — common in sensational headlines."
  ]
}
```

### `POST /predict` (FastAPI)

Public (CORS-restricted). Same shape as above plus `elapsed_ms`.

### `GET /api/history` · `DELETE /api/history/:id`

Authenticated. Returns/deletes the calling user's classification history.

## Environment variables

| Var | Where | Purpose |
|-----|-------|---------|
| `DATABASE_URL` | frontend | Prisma DB URL (defaults to SQLite) |
| `NEXTAUTH_SECRET` | frontend | JWT signing key — generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | frontend | Public URL (e.g. `https://your-app.vercel.app`) |
| `ML_API_URL` | frontend | URL of the FastAPI service |
| `ALLOWED_ORIGINS` | backend-ml | Comma-separated CORS allowlist |
| `PORT` | backend-ml | Port for uvicorn (default 8000) |

See `.env.example` for a copy-pasteable template.

## Deployment

### Frontend → Vercel

1. Push the repo to GitHub.
2. **Import** in Vercel. Set the project root to `frontend/` (matches `vercel.json`).
3. Add env vars in the Vercel dashboard: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ML_API_URL`.
4. Deploy. Prisma migrations run via `prisma generate` in the build command.

For production, swap `DATABASE_URL` to a hosted Postgres (Vercel Postgres, Neon, Supabase) and update `provider = "postgresql"` in `frontend/prisma/schema.prisma`.

### ML Service → Render (or any Docker host)

1. Push the repo to GitHub.
2. In Render, **New Web Service** → select repo → it auto-detects `render.yaml`.
3. Set `ALLOWED_ORIGINS` to your Vercel URL.
4. Render builds the Dockerfile, trains on the seed dataset, and starts uvicorn on port 8000.

Alternative: any Docker host.

```bash
docker build -t fnd-ml ./backend-ml
docker run -p 8000:8000 fnd-ml
```

## Features at a glance

- **Polished dark UI** — GitHub mobile inspired, dark-mode first, Inter font
- **Landing page** — hero, trusted-by, features grid, workflow, analytics preview, testimonials, FAQ, CTA, footer
- **Auth** — email/password with bcrypt + JWT sessions, protected routes
- **Dashboard** — paste-and-analyze, animated confidence bars, AI insights
- **History** — searchable, filterable, deletable, CSV export
- **Analytics** — real/fake distribution, weekly activity, confidence trend (Recharts)
- **Mobile-ready** — bottom nav, responsive layout
- **Production touches** — rate limiting, Zod validation, skeleton loaders, toasts, copy-to-clipboard, error pages

## Security

- Passwords hashed with bcrypt (cost factor 12)
- JWT sessions via NextAuth (30-day expiry)
- Per-route rate limiting (register 5/min/IP, predict 30/min/user)
- Zod schema validation at every API boundary
- CORS whitelist on ML service
- No plaintext secrets — `.env` is gitignored

## Credits

ML approach inspired by [kapilsinghnegi/Fake-News-Detection](https://github.com/kapilsinghnegi/Fake-News-Detection). Dataset by Clement Bisaillon on [Kaggle](https://www.kaggle.com/datasets/clmentbisaillon/fake-and-real-news-dataset).

## License

MIT — use it, ship it, modify it. Just don't use it as the sole arbiter of truth: always verify with primary sources.
