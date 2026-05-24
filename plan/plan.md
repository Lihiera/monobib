# Monobib Interview Showcase Plan

## Goal

Turn Monobib into a clear interview showcase for a three-part restaurant data product:

- React frontend in `monobib`
- Go backend in `mono_back`
- Go crawler in `Restaurants_detials_crawl`

The target is a solid interview version, not a fully polished production rewrite. The frontend should be the main demo surface. The backend and crawler should be available in the same workspace so future sessions can inspect the whole system before making frontend changes.

## Target Scope

- Time budget: approximately 2-4 focused days.
- Prioritize: runnable setup, clear docs, demo reliability, API configurability, visible error handling, map quality, and interview explanation.
- Defer: full redesign, exhaustive test coverage, authentication, backend/crawler rewrites, advanced observability, and large refactors.

## Working Rules

- Read `AGENT.md` and this file before starting each session.
- Work on only one TODO step at a time.
- Every step must leave the frontend runnable.
- If a task would temporarily break the app, split it into smaller runnable substeps first.
- Update this TODO list whenever a plan item starts, completes, changes, or is blocked.
- Update related documentation in the same session whenever implementation details change.

## TODO List

### 1. Create a Multi-Repo Workspace

- [ ] Create a VS Code multi-root workspace at `C:\Users\lgj46\Documents\web_dev\monobib-showcase.code-workspace`.
- [ ] Include these folders:
  - `monobib`
  - `mono_back`
  - `Restaurants_detials_crawl`
- [ ] Keep the repos separate. Do not merge them into a monorepo yet.
- [ ] Document how to open the workspace.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Open or inspect the workspace file to confirm all three repos are listed.

### 2. Establish Docs and Test Script Baseline

- [ ] Replace the root README's one-line description with a useful project overview.
- [ ] Document the current three-repo system at a high level:
  - frontend: `monobib`
  - backend: `mono_back`
  - crawler: `Restaurants_detials_crawl`
- [ ] Document the current frontend setup commands:
  - install dependencies
  - run dev server
  - build production bundle
  - run tests
- [ ] Add or fix frontend test scripts so there is a reliable non-watch test command.
- [ ] Add or fix the minimal frontend test setup needed for the existing Vite/React app.
- [ ] Replace the default CRA-style test with a real smoke test for the current app.
- [ ] Document which checks should be run before each interview/demo change.
- Runnable checkpoint:
  - [ ] Run dependency install only if needed.
  - [ ] Run the frontend non-watch test command in `front/test-app`.
  - [ ] Run `npm run build` in `front/test-app`.

### 3. Make the Frontend Configurable

- [ ] Replace hardcoded backend URLs such as `https://mono-back.onrender.com`.
- [ ] Add `VITE_API_BASE_URL`.
- [ ] Add `front/test-app/.env.example`.
- [ ] Use the deployed backend as the default demo backend.
- [ ] Allow local backend testing by changing only the environment variable.
- [ ] Update related README/setup docs for the new environment variable.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Confirm the app still works with the deployed backend.

### 4. Stabilize Result and Map States

- [ ] Add a clear loading state.
- [ ] Add API error state with a useful message.
- [ ] Add empty result state.
- [ ] Add missing image fallback.
- [ ] Handle missing or invalid latitude/longitude without crashing the map.
- [ ] Skip invalid coordinates safely in map rendering.
- [ ] Update docs if user-visible behavior changes.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Manually check result list and map for at least one region.

### 5. Improve the Map Demo

- [ ] Fit map bounds to the returned restaurant markers.
- [ ] Improve popup content:
  - restaurant name
  - cuisines
  - image if available
  - external link
- [ ] Add marker clustering if compatible with the current React Leaflet version.
- [ ] If clustering is not compatible, document the reason and keep the non-clustered map stable.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Manually check that map markers and popups work.

### 6. Clean Up the Demo Flow

- [ ] Remove or disable unfinished login/account links.
- [ ] Make the home page clearly route users into the search/results flow.
- [ ] Improve user-facing wording for interview/demo use.
- [ ] Keep the frontend focused on the restaurant discovery experience.
- [ ] Update README screenshots or descriptions if the flow changes.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Manually check home page, search page, and result navigation.

### 7. Polish Search and Pagination

- [ ] Keep URL query parameters consistent for:
  - region
  - source
  - page
- [ ] Reset page to `0` when region or source changes.
- [ ] Make region/source selection easier to understand.
- [ ] Ensure pagination disables correctly at the beginning and end.
- [ ] Update docs if query parameter behavior changes.
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Manually check source switching and pagination.

### 8. Expand Full System Documentation

- [ ] Expand the README architecture section after the frontend behavior is stable.
- [ ] Explain each repo's responsibility in more detail:
  - crawler collects Michelin/Tabelog restaurant data
  - backend exposes restaurant search APIs
  - frontend renders search results and map visualization
- [ ] Add API contract documentation:
  - `POST /metadata?region=...&source=...`
  - `POST /result?region=...&source=...&page=...`
- [ ] Add environment variable documentation:
  - frontend: `VITE_API_BASE_URL`
  - backend: `SUPABASE_DB_URL`, `PORT`
- [ ] Add known limitations:
  - crawler is manually run
  - backend depends on Supabase/Postgres data
  - frontend focuses on browsing/search visualization
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Confirm README setup still matches the actual app.

### 9. Add Focused Frontend Tests

- [ ] Test result list rendering.
- [ ] Test empty state rendering.
- [ ] Test API error rendering.
- [ ] Test missing image fallback.
- [ ] Test map behavior with invalid coordinates.
- [ ] Update test instructions in README or frontend docs.
- Runnable checkpoint:
  - [ ] Run the frontend test command in `front/test-app`.
  - [ ] Run `npm run build` in `front/test-app`.

### 10. Final Local Verification

- [ ] Run `npm run build` in `front/test-app`.
- [ ] Verify frontend works with deployed backend.
- [ ] Verify frontend can point to local backend through `VITE_API_BASE_URL`.
- [ ] Manually check:
  - home page
  - search page
  - result list
  - map
  - source switching
  - pagination
- [ ] Record any verified commands or remaining limitations in README or this plan.

### 11. Final Interview Packaging

- [ ] Add screenshots or GIFs to the README if time allows.
- [ ] Add a "What I Built" section.
- [ ] Add technical highlights:
  - React/Vite frontend
  - Go/Gin backend
  - Supabase/Postgres data source
  - Go crawler
  - Leaflet map visualization
  - URL-driven search state
- [ ] Add interview talking points:
  - why the system is split into crawler/backend/frontend
  - how data flows from crawling to API to UI
  - how pagination and metadata are separated
  - how map visualization improves restaurant discovery
  - future improvements and tradeoffs
- Runnable checkpoint:
  - [ ] Run `npm run build` in `front/test-app`.
  - [ ] Confirm README and screenshots describe the current app.

## Recommended Order

Follow the numbered TODO list from top to bottom. The order is arranged by implementation dependency and interview impact:

1. Add workspace integration so future sessions can inspect all repos.
2. Establish docs and reliable test/build scripts.
3. Make the app configurable and demo-safe.
4. Prevent visible crashes and broken states.
5. Improve the map, because it is the strongest visual feature.
6. Clean up unfinished product surfaces.
7. Polish query-driven search behavior.
8. Expand the full multi-repo system docs.
9. Add focused tests around the polished behavior.
10. Verify locally.
11. Package the final interview story.
