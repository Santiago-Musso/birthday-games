## Birthday Games

A modern, mobile‑first web app to organize and score multi‑game team competitions.

### Tech stack
- Next.js 14 (App Router) with static export
- TypeScript, React 18
- Tailwind CSS
- React Query for data fetching/caching
- Chart.js (radar skills)

### Live deployment
This repo is configured to deploy to GitHub Pages via Actions.

1) In GitHub → Settings → Pages → Source: select “GitHub Actions”.
2) If the repo is published under a subpath (e.g. `/birthday-games`), set a repository variable:
   - `NEXT_PUBLIC_BASE_PATH` = `/birthday-games`
   The app already reads this in `next.config.mjs` for `basePath` and `assetPrefix`.

The workflow builds with `next build` and exports static HTML to `dist/`, then publishes to Pages.

### Environments
The app reads these environment variables at build/runtime:

- `NEXT_PUBLIC_API_BASE` (optional): Base URL for the API. Defaults to MockAPI used by the project.
- `NEXT_PUBLIC_ENABLE_PLAYER_SCORES` (optional): Set to `true` to enable per-user scoring endpoints. Leave unset/false if your API doesn't provide `/playerScores` to avoid 404s.
- `NEXT_PUBLIC_BASE_PATH` (optional but recommended for GitHub Pages): Subpath where the site is hosted (e.g., `/birthday-games`).

You can set these locally in `.env.local` and on GitHub as “Repository variables” or “Actions secrets & variables”.

### Development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Build & preview

```bash
# Production build
npm run build

# Static export → dist/
npm run export

# Preview static output (one option)
npx serve dist
```

### Scripts
- `dev`: Run the dev server (Next.js turbo)
- `build`: Build the app (Next.js)
- `export`: Static export to `dist/` (required for GitHub Pages)
- `start`: Start the production server (not needed for GitHub Pages)

### Project structure (high level)
- `app/`
  - `page.tsx`: Home (scoreboard, teams/participants)
  - `create-player/`: Player creation with avatar & phrase
  - `players/`: Player detail (skills radar, team info)
  - `admin/` and `[adminPath]/`: Admin tools (teams, assignments)
  - `scores/`: Per‑user scoring UI (admin editable, read‑only for others)
- `components/`: UI components, avatars, charts
- `lib/`: API clients and utilities
- `types/`: Domain types
- `styles/`: Tailwind and global CSS (design tokens, dark mode)

### Design system highlights
- Dark/light mode with CSS variables
- Glassmorphism cards, soft shadows, fluid type scale
- Skeleton loaders for async states
- Accessible focus styles and reduced‑motion support

### Data model (summary)
- Teams, Players, Assignments, Scores (team‑level) and PlayerScores (per‑user)
- The home scoreboard aggregates from `PlayerScores` when available; otherwise falls back to team scores.

### Admin
- Create/randomize teams
- Assign players to single‑player games
- Manage scores on the dedicated Scores page (admin only)

### GitHub Actions
Workflow at `.github/workflows/deploy.yml`:
- On push to `main`: build, export, and deploy to GitHub Pages
- On PR: build and upload artifact (deployment job runs only on `main` pushes by default)

### Notes
- For GitHub Pages under a subpath, ensure `NEXT_PUBLIC_BASE_PATH` matches your repo name (e.g., `/birthday-games`).
- Images are unoptimized in static export mode.


