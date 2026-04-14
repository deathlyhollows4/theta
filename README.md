# AI DSA Copilot

Production-grade MVP scaffold for a coding practice platform with AI-driven DSA feedback.

## Completed so far
- Step 1: Backend base setup with Express + MongoDB bootstrap.
- Step 2: JWT authentication (register/login) with bcrypt password hashing and protected route support.
- Step 3: Problem system with schema, list/detail APIs, and seed dataset.
- Step 4: Safe code execution + submission tracking with per-test-case result details.
- Step 5: AI feedback generation on submit (complexity, mistakes, better approach, skill level, suggestion).
- Step 6: Dashboard analytics API (solved count, accuracy, avg execution, weak topics, recent submissions, trend).
- Step 7: Mistake analysis engine (keyword extraction and categorized mistake tracking from AI feedback).
- Step 8: Personalized roadmap generator API (5–7 day plan based on user weaknesses).
- Step 9: Frontend starter (React + Vite + Tailwind + Monaco) with auth, dashboard, and practice UI.
- Step 10: Practice UX improvements (submission history panel + loading/error handling).
- Step 11: Custom input runner + editor keyboard shortcuts (Cmd/Ctrl run/submit).
- Step 12: Scaled problem seeding to 360 variants + Problem Bank page with filters/pagination.
- Step 13: Public shareable profile endpoint + frontend public profile page.
- Step 14: Production hardening with rate limiting and frontend error boundary.
- Step 15: Health diagnostics endpoint + frontend retry/skeleton states.
- Step 16: Auth/session UX hardening (auth context, protected routes, logout).
- Step 17: UI consistency pass (empty states, retry flows, loading states).
- Step 18: Notification + accessibility polish (toast feedback, ARIA labels).
- Step 19: Release readiness docs cleanup + dynamic service version in health readiness.
- Step 20: Final validation pass (fixed keyboard listener stability and callback consistency).

## Run backend
```bash
cd server
npm install
cp .env.example .env
npm run seed:problems  # seeds ~360 problems
npm run dev
```

### Running from current directory
If your prompt already shows `/workspaces/theta/server`, do **not** run `cd server` again. Use:
```bash
npm install
cp .env.example .env
npm run seed:problems
npm run dev
```


## Run frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Create `client/.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000/api
```

## API endpoints (current)
- `GET /api/health`
- `GET /api/health/ready` (uptime/version readiness metadata)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)
- `GET /api/problems` (supports `difficulty`, `topic`, `search`, `page`, `limit`)
- `GET /api/problems/:slug`
- `POST /api/submit/run` (protected, executes code and returns actual vs expected)
- `POST /api/submit/run-custom` (protected, executes code against custom JSON input)
- `POST /api/submit` (protected, executes code, stores submission, returns AI feedback + mistake analysis)
- `GET /api/submit/history` (protected, recent submissions, supports `problemSlug` + `limit`)
- `GET /api/dashboard` (protected analytics summary + chart-ready data)
- `GET /api/roadmap` (protected personalized roadmap)
- `GET /api/profile/:username` (public shareable profile stats)

## View in GitHub Codespaces
1. Open repository in GitHub and click **Code → Codespaces → Create codespace on branch**.
2. Start backend + frontend in separate terminals.
3. Open forwarded ports for `5173` (client) and `5000` (server).

## Deployment notes
### Frontend (Vercel)
- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Env: `VITE_API_BASE_URL=<deployed_backend_url>/api`

### Backend (Render/Railway)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm run start`
- Required env vars: all keys from `server/.env.example`

## Release readiness checklist
- [ ] Run backend and frontend locally without env warnings.
- [ ] Seed problem bank (`npm run seed:problems`) and verify list pagination.
- [ ] Verify register/login/logout and protected routes.
- [ ] Verify run, run-custom, submit, dashboard, roadmap, public profile.
- [ ] Add production MongoDB URI and OpenAI key in deployment env.

## Known limitations (current MVP)
- JavaScript is the only executable language right now (Python/C++ UI placeholders are non-functional).
- In-memory rate limiting is single-instance only (not distributed).
- Execution sandbox uses Node `vm`; for strict production isolation, move to containerized runners.
- AI output quality depends on OpenAI availability and prompt constraints.

## Suggested next priorities
1. Add robust automated test suites (unit + integration + E2E).
2. Replace in-memory rate limiting with Redis-backed limiter.
3. Move code execution to isolated worker/container service.
4. Add observability (structured logs, metrics, tracing, alerting).
5. Add CI/CD pipeline and staging environment gates.

## Codespaces troubleshooting
If you see:
`connect ECONNREFUSED ::1:27017` or `127.0.0.1:27017`

It means MongoDB is not running in your Codespace container. Fix by:
1. Create a MongoDB Atlas cluster.
2. Put Atlas connection string in `server/.env` as `MONGODB_URI=...`.
3. Re-run:
   ```bash
   cd server
   npm run seed:problems
   npm run dev
   ```

Optional: run local MongoDB inside container only if you explicitly install/start it.

If you see:
`querySrv EBADNAME _mongodb._tcp.<cluster>`

Your Atlas URI still contains placeholders like `<cluster>`, `<user>`, or `<password>`. Replace them with real values (without angle brackets).

If you see:
`querySrv ENOTFOUND _mongodb._tcp.cluster0.xxxxx.mongodb.net`

Your host is still the sample Atlas hostname. Replace it with your **actual** cluster hostname from Atlas (e.g. `cluster0.ab12c.mongodb.net`).
Also verify in Atlas:
- Database user exists
- Network Access allows your current IP (or `0.0.0.0/0` temporarily for dev)


