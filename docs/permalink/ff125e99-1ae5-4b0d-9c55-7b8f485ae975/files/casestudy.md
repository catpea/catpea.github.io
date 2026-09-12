# Case Study: Pastebin Security Audit

**Project:** `/home/meow/AI/mind-server-projects/pastebin`
**Date:** 2026-03-17
**AI:** Local model (`gpt-oss-20b-q4_k_m.gguf`) via llama.cpp on `http://0.0.0.0:8191`
**mind-server version:** 1.0.0 (15 agents)

---

## The Project

A single-file Node.js pastebin server (`server.js`, ~300 lines). It accepts text via HTTP POST, stores it as a SHA-256-named `.txt` file, and streams the last paste to all connected clients via SSE. No package.json, no tests, no README — raw prototype code.

---

## What Happened

### 1. Start mind-server

```bash
mind-server /home/meow/AI/mind-server-projects/pastebin \
  --ai-provider local \
  --ai-base-url http://0.0.0.0:8191 \
  --ai-model gpt-oss-20b-q4_k_m.gguf \
  --port 3002
```

mind-server created `.mind-server/` inside the project, initialised the board with default subreddits (`requests`, `todo`, `quality`, `dispatch`, `general`), and confirmed the local AI was reachable.

### 2. Vera dispatches → Sandra scans

```bash
curl -X POST http://localhost:3002/agents/vera/run
# → { "outcome": "dispatched", "dispatch": "sandra" }

curl -X POST http://localhost:3002/agents/sandra/run
# → { "outcome": "findings-posted", "count": 3 }
```

Sandra posted three findings to `r/quality`:

| Finding | Severity |
|---|---|
| Missing `package.json` | warning |
| Missing `README.md` | warning |
| No test files found | warning |

### 3. Security audit (parallel)

```bash
curl -X POST http://localhost:3002/agents/bobby/run   &
curl -X POST http://localhost:3002/agents/mallory/run &
curl -X POST http://localhost:3002/agents/danielle/run &
wait
```

**Bobby** (injection specialist) found:
- `[PATH-TRV]` Path traversal in `server.js:271` — `path.basename(req.url)` can be bypassed with encoded slashes

**Mallory** (pentester) found 5 issues in `r/security`:
- `[HEADERS]` Missing HTTP security headers (X-Frame-Options, CSP, X-Content-Type-Options)
- Unescaped `title` in `listItem()` → XSS via `innerHTML`
- SSE stream missing explicit `Content-Type` header
- Mtime disclosure: file modification times exposed in the listing
- Duplicate path traversal note (corroborating Bobby)

**Danielle** (DevOps/SRE) found in `r/ops`:
- No container configuration (Dockerfile)
- No `.env.example`

### 4. UX + defensive security

```bash
curl -X POST http://localhost:3002/agents/lauren/run  &
curl -X POST http://localhost:3002/agents/angela/run  &
wait
```

**Lauren** (UX): clean — simple form UI, no a11y issues triggered.
**Angela** (security engineer): `[POLICY]` No `SECURITY.md` — missing vulnerability disclosure policy.

**Board total: 14 open posts across 4 subreddits.**

### 5. Fix request → full pipeline

```bash
# Post a request
curl -X POST http://localhost:3002/r/requests \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Fix XSS and security issues found by audit",
    "body": "Mallory and Bobby found: (1) Unescaped title in listItem() → XSS via innerHTML, (2) Path traversal in GET /:hash.txt, (3) Missing HTTP security headers, (4) SSE stream missing Content-Type.",
    "author": "user",
    "type": "request"
  }'

# Pipeline: vera → monica → erica → rita
curl -X POST http://localhost:3002/agents/vera/run
# → dispatched to monica

curl -X POST http://localhost:3002/agents/monica/run
# → planned (1 todo created)

curl -X POST http://localhost:3002/agents/erica/run
# → implemented, server.js rewritten

curl -X POST http://localhost:3002/agents/rita/run
# → approved
```

Erica rewrote `server.js` with all four fixes applied. Rita approved on first review.

---

## Board at End of Session

```
r/quality  (3 posts)  — sandra
r/security (8 posts)  — bobby, mallory, angela
r/ops      (2 posts)  — danielle
r/requests (1 post)   — user → done
r/todo     (1 post)   — done
```

---

## Total Time

| Step | Duration |
|---|---|
| Vera → Sandra dispatch | ~5s |
| Sandra QA scan | ~12s |
| Bobby + Mallory + Danielle (parallel) | ~17s |
| Lauren + Angela (parallel) | ~9s |
| Full fix pipeline (vera→monica→erica→rita) | ~17s |
| **Total** | **~60s** |

---

## The Manual Problem

Every step above required a separate `curl -X POST`. The pipeline is deterministic — Vera always knows who to run next — but we had to babysit it. This is what `--auto` was built to solve.

---

## Automating the Process

### `--auto` flag

```bash
mind-server /path/to/project \
  --ai-provider local \
  --ai-base-url http://0.0.0.0:8191 \
  --ai-model gpt-oss-20b-q4_k_m.gguf \
  --auto
```

This starts two background loops:

**Dispatch loop** (every 30s by default)
1. Runs Vera — she reads the board and names the next agent
2. Immediately runs that agent
3. Repeats until Vera says "nothing to do"

**Scan loop** (every 5 min by default)
- Runs Sandra, Bobby, Mallory, Angela, Danielle, Lauren in sequence
- Each agent posts new findings or returns instantly if nothing changed

The entire pastebin session above would have run automatically within ~2 minutes of startup, with no `curl` commands needed.

### Tuning the intervals

```bash
# Faster dispatch (10s), more frequent scans (2 min)
mind-server /path/to/project --auto --cycle 10 --scan 120

# Slow and cheap (only dispatch every 2 min, scan once an hour)
mind-server /path/to/project --auto --cycle 120 --scan 3600
```

### What you still do manually

- **Post requests** — describe what you want in `r/requests`
- **Review Erica's output** — read `r/todo` posts to see what was written
- **Close won't-fix findings** — `PATCH /r/security/:id` with `{ "status": "done" }` to silence false positives

Everything else — triage, planning, implementation, review, QA, security scanning — runs on its own.

---

## Lessons

1. **A single-file project gets a full security audit in under 60 seconds.** The XSS in `listItem()` was a real bug.

2. **Agents are composable.** Bobby and Mallory found the same path traversal independently — that's redundancy, not waste. Different agents have different heuristics; overlap increases confidence.

3. **Lauren came back clean in 2ms.** Lightweight UI → no a11y issues. Fast agents don't hurt.

4. **The board is the memory.** Restart mind-server against the same project and all findings persist. Agents won't re-report issues that are already open.

5. **`--auto` removes the operator.** The only reason to `curl` is to submit a new request or mark something done.
