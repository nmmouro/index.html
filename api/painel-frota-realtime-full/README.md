# painel-frota-realtime

Painel da frota integrado ao AppSheet.
Frontend (Vite + React) e Backend (Vercel serverless functions).

## Setup (local)

1. Frontend
```
cd frontend
npm install
npm run dev
```

2. Backend (Vercel functions) - test with vercel dev or deploy to Vercel
- Set Environment Variables in Vercel:
  - APPSHEET_APP_ID
  - APPSHEET_API_KEY

## Deploy

- Deploy backend by pushing to Vercel (serverless functions in /api)
- Deploy frontend to Vercel (or build and host on GitHub Pages)
