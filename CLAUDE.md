# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start the Next.js dev server (localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`)

There is no test suite configured in this repo.

### ADK agent CLI

Agents under `src/agents/` are run through the `adk` CLI from `@google/adk-devtools` (not wired into `package.json` scripts — invoke via `npx adk ...`):

- `npx adk web` — start the ADK web UI/server to interactively chat with agents (serves the whole `src/agents/` tree by default)
- `npx adk run src/agents/<name>/agent.ts` — run a single agent from the terminal
- `npx adk create <name> --language ts` — scaffold a new agent

## Architecture

This is a Next.js 16 (App Router) app whose real subject is a set of **Google ADK (Agent Development Kit) JS agents**, not the web UI — `src/app/` is currently just the unmodified `create-next-app` scaffold.

- **`src/agents/<agent-name>/agent.ts`** — one directory per agent. Each file exports a `rootAgent`, an instance of `LlmAgent` (or a `Workflow`) from `@google/adk`. This is the structure the `adk` CLI expects (`agents_dir/{agentName}/agent.ts`).
- Agents are composed from:
  - `LlmAgent` — the agent itself (`name`, `model`, `description`, `instruction`, `tools`)
  - `FunctionTool` — wraps a plain function as a callable tool, with a `zod` schema for `parameters` and an `execute` implementation
- `src/app/` is the Next.js frontend shell (App Router: `layout.tsx`, `page.tsx`, `globals.css`) — no agent integration is wired into it yet, and no API routes exist. If asked to expose an agent through the web app, that wiring doesn't currently exist and needs to be built (e.g. an API route calling into `@google/adk`'s runner, or the ADK API server).
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` (no `tailwind.config` — v4 uses CSS-based config in `globals.css`).
- Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

## Working in this repo

- **Next.js version note**: this project pins a pre-release/breaking Next.js version (16.3.2). Before writing App Router code, check `node_modules/next/dist/docs/` (resolved relative to the repo, since in a monorepo it may not be visible from elsewhere) for the current API — training data on Next.js conventions may be stale or wrong for this version.
- A `PostToolUse` hook runs `npx prettier --write .` after every `Write`/`Edit`, so manual formatting passes are unnecessary.
