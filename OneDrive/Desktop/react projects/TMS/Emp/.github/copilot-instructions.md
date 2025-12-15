# Copilot instructions — Emp (TMS)

Short, practical guidance for AI coding agents working on this repository.

## Quick context ✅
- Framework: **Next.js (App Router)** — top-level app files live in `app/` (e.g. `app/layout.tsx`, `app/page.tsx`).
- Language: **TypeScript** + **React 19** (client/server components used).
- Styling: **Tailwind** is injected at runtime via an inline script in `app/layout.tsx` (nonstandard — be cautious when changing global styling).
- Components live under `Components/` (e.g. `Components/MOM`, `Components/project-module`, `Components/storage`).

## Dev & test commands 🔧
- Start dev server: `npm run dev` (open http://localhost:3000)
- Build: `npm run build`
- Start prod (after build): `npm run start`
- Lint: `npm run lint`

## Key integration to know (Gemini / GenAI) 🤖
- Location: `Components/MOM/services/geminiService.ts` — function `generateMeetingMinutes(...)`.
- What it does: calls `@google/genai` (model: `gemini-2.5-flash`) and requests a strict JSON response using a `responseSchema`.
- Secrets: uses `process.env.API_KEY`. **Do not commit** API keys; use environment variables or your hosting secret manager.
- Local behavior: if `API_KEY` is missing the service returns a safe mock summary (so the app runs without secrets).
- Best practice: Treat GenAI calls as server-side (keep keys secret). If adding new AI endpoints, prefer server functions or server actions.

## Editing & code guidance ✍️
- Tailwind: Because Tailwind is injected at runtime in `app/layout.tsx`, changing global styles may require testing both dev and build outputs — check visual regressions.
- Search & scans: exclude `.next/` and `node_modules/` when searching to avoid noisy results. Example: `git grep --exclude-dir=.next --exclude-dir=node_modules "pattern"`.
- When adding features, follow existing conventions: small, focused components under `Components/`, keep UI logic in client components (`'use client'`) and heavy/backend logic (e.g., API calls, secret use) on the server.

## Quick example (Gemini usage) 💡
(See `Components/MOM/services/geminiService.ts` for full details)

```ts
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });
const result = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  responseMimeType: 'application/json',
  responseSchema: /* strict schema here */,
});
```

## PR & review pointers ✅
- Keep changes small and focused; mention required env vars in the PR description (do not add secrets to the repo).
- If touching global layout (Tailwind injection) or build config, include screenshots or a brief QA checklist (dev and prod builds).
- If you introduce AI-related changes, include sample input/output and note whether real API access is required (env var) or fallback/mock is available.

---
If you'd like, I can now:
- (A) Commit this file and open a draft PR, or
- (B) Run a short, narrower scan (excluding `.next` and `node_modules`) to capture any additional non-obvious patterns before committing.

Reply with A or B (or ask for edits) and I'll proceed.