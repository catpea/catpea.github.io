# Music Label Game
## Foundation 01 — The world is the product

*September 11, 2026 · Implementation contract; commands and files below are proposed.*

A portable, prompt-driven management game. **Load a meaningful world, let capable AI develop it, and save its successor.** The first result is a browsable company—not a plan for building one.

The player owns the world. Models and providers are replaceable resources.

## The rules

1. **Show the whole first.** Begin with named artists, albums, songs, descriptions, and future dates. The default seed contains three artists and ten albums each. There must be something meaningful to explore before any media is rendered.

2. **Keep one precious text save.** MLML contains the selected identities, memories, intentions, writing, schedules, decisions, production briefs, and selected instruction text with its versions needed to continue. No essential memory may exist only inside an agent or proxy.

3. **Distill; do not empty.** Short descriptions inherit meaning from their surroundings: label → artist → album → song. Add structure only when it expresses a real distinction. A missing recording is not a missing song.

4. **Prompt the imagination; code the container.** Put creative development, taste, and semantic review in instructions. Keep parsing, permissions, identities, arithmetic, budgets, and safe saving in ordinary code. Good prose replaces bespoke behavior—not enforced boundaries.

5. **Give AI tools, not ownership.** Models inspect scoped context and propose changes through named world operations. The engine validates and commits them. A request to add an artist should produce the artist and her initial catalog, not a new task list for the player.

6. **Regenerate attempts; preserve the world.** A separate reviewer accepts or rejects a candidate against its source context. Rejection starts a fresh attempt with concise feedback, not an endless repair conversation. Bound retries; retain accepted work and continue elsewhere when necessary.

7. **Time belongs to the save.** Store world time and event dates as Unix seconds; display human dates. Advance explicitly. Keep intended dates, fictional events, and actual production facts distinct. A date passing never fabricates a recording or approval.

8. **Advance meaning; render media separately.** `play` develops the text world. `produce` realizes selected audio and image briefs without advancing its clock. Missing generators leave visible pending work; they do not block the world's development.

9. **Let people exercise taste, not supervise repairs.** Likes and dislikes on future ideas guide direction. Approval of a recording belongs to that exact retained audio, not its title or brief. Rejection requests regeneration; routine production does not request permission to retry.

10. **Make the future visible.** The same save supplies the next-30-days calendar, workload charts, generation backlog, listening queue, upcoming artists, journal, and media gallery. Count meaningful deliverables, not retries. Opening a view requires no AI and changes nothing.

11. **Keep game actions inside the game.** Personas cannot deploy, purchase, email, browse arbitrarily, run shell commands, or grant permissions. Generation is an explicitly budgeted external capability. Public websites and feeds are selected local exports; deployment is another application's responsibility.

12. **Make every session useful.** Use a capable text model for progression, with explicit time and inference limits. Save the last coherent result when access ends. Do not silently downgrade the model or pretend the requested future was reached. Previous saves remain untouched.

## What lives inside the world

The world contains a label; artists with voices, histories, relationships, and creative eras; albums and songs; scenes, comments, and journal posts; future intentions; and requests for recordings and images. Personas are persistent characters, not continuously running processes.

**Characters know their past and selected intentions—not an omniscient account of their future.** Fictional scenes may inspire real work; they do not become fabricated sales, audience praise, or owner decisions. Public presentation identifies virtual artists and generated imagery.

A small illustrative fragment:

```xml
<label name="Star Records" now="1789166572">
  <artist id="poppy" name="Poppy Paradox" at="1789771372">
    <bio>A virtual singer who makes questioning feel joyful.</bio>
    <style>Female lead; bubblegum pop; bright hooks, playful wit.</style>
    <album id="ask-why" name="Ask Me Why" at="1791585772">
      <description>Catchy invitations to think for yourself.</description>
      <song id="who-says" name="Who Says?">
        A borrowed certainty becomes an honest question;
        make changing your mind sound like freedom.
        <audio>Warm lead, buoyant rhythm, a chorus worth sharing.</audio>
      </song>
      <image>Pastel question marks orbit a homemade telescope.</image>
    </album>
  </artist>
</label>
```

An unresolved `<audio>` or `<image>` is already a production request. The engine derives work from the world; there is no second task database to maintain. Production binds to a specific version of its brief and inherited context.

The complete text travels in one MLML file. Binary assets are optional companions, referenced by identity and digest. Keep valued recordings and visual references: generating a replacement is not recovering the identical original. Timestamp filenames are convenient; distinct revisions still need distinct identities.

## Talk to the world

```bash
music-label-game ask \
  --load world-1789166572.mlml \
  --save expanded.mlml \
  "Add a female bubblegum-pop artist whose songs introduce \
   philosophers and help young people think independently."
```

The inner AI can use `world.read`, `world.propose`, `world.schedule`, and `world.requestMedia`. Mutations are staged for review and committed by the engine. Owner approval is a separate player operation, never an agent-granted permission.

Start with an author and reviewer sharing one small harness. Artist, lyricist, manager, and editorial roles are instruction sets; add separate workers only for a concrete need. Models request tool calls; application code executes authorized ones—the separation used in documented function-calling workflows.[1]

**Command meanings:** `view` browses; `ask` expands; `play` progresses with AI; `advance` moves the clock without inventing events; `schedule` changes dates; `produce --list` reveals pending media; `produce` renders it; `like`/`dislike` records taste; `export` builds selected local outputs. State-changing commands load one save and write its successor.

## The code we actually need

Node.js, ESM, `.js` files, no third-party npm packages in the game. These are responsibilities, not invitations to build a framework.

```text
music-label-game/
  cli.js             Commands and conversational entry
  mlml.js            Bounded XML subset; parsing and serialization
  world.js           Objects, explicit time, scoped changes, work discovery
  agents.js          Context → prompt → tool calls → author/reviewer loop
  tools.js           Allowed world operations; no host tools
  ai.js              Provider-neutral client for the separate proxy
  media.js           Pending briefs and imported asset receipts
  views.js           Terminal/HTML, calendar, listening, public exports
  save.js            Read-only input, checkpoints, successor commits
  prompts/           Versioned author, reviewer, and specialist instructions
  tests/game.test.js Boundary, recovery, scheduling, and approval tests
  build/sea.js       Later: packaging, never world behavior
```

Keep the XML subset small and reject external entities and executable content. Models return scoped changes, not rewritten copies of the entire company. Serialize accepted changes with code.

Keep modules easy to bundle and avoid dynamic plugin loading. Node's current SEA documentation supports an embedded ESM entry script, but ordinary filesystem module loading is not the default inside it: packaging must deliberately bundle the application and its prompt assets. Build for each supported platform. SEA is a later distribution step, not an architectural prerequisite.[2]

## The AI proxy is a different program

```text
MLML → game / agent harness → capability request → AI proxy
                                                   ↓
                                          API or isolated CLI
                                                   ↓
Next MLML ← accepted changes ← normalized result ← output
```

**The game asks for a capability. The proxy chooses how to supply it.** Text reasoning, music, images, transcription, and audio assessment are different advertised capabilities. Missing capability means deferred work—not a silent substitute or a text model pretending to have listened.

Keep one small, versioned protocol: discover capabilities, submit a bounded request, collect its result, and cancel when supported. A request carries an ID, capability/profile, relevant input, permitted tool descriptions, and limits. A result carries structured content or tool requests, artifact descriptors, actual provider/model identity, and usage when available. Reconnects reconcile the same request; they do not blindly create another paid generation.

The proxy must not execute world tools. Tool requests return to `tools.js`. Adapters may use approved local executables, but model-produced arguments never become unrestricted shell commands.

### A personal proxy can stay personal

A suggested four-file implementation:

```text
ai-proxy/
  server.js          Authentication, limits, request lifecycle
  routes.js          Capability routing and normalized responses
  openai.js          Selected text/API adapter
  elevenmusic.js     Selected music/API adapter
```

No adapter is required merely because a provider exists. Eleven Music documents a music-generation API; choosing it does not require the game to know its request format.[3] Other adapters may call a CLI, a local service, or a containerized worker. Vercel's AI SDK is a possible multi-provider implementation **behind** this boundary—not a game dependency.[4]

The proxy may retain credentials, caches, provider sessions, tickets, and usage records. It must return every result and relevant receipt needed by the world. Export accepted text into MLML and retain identifiers for outstanding work. No artist memory or essential continuation state is allowed to live only in the proxy.

A hosted proxy should require only an endpoint and scoped access token in local configuration—not in MLML. Use authenticated TLS, per-user isolation, explicit capability/spending limits, and a stated retention policy. Send the relevant context, not the whole world by default. Changing providers or hosts must not change the save format.

**Containerization contains risk; it does not prove dependencies safe.** Isolate adapter workers with restricted mounts and egress, non-root execution, pinned dependencies, limited credentials, and no host-control socket. Docker's security documentation explicitly notes that mounts, capabilities, and kernel vulnerabilities can leave isolation incomplete.[5]

With remote inference, this is a **closed game with declared external generation**, not strictly offline or fully hermetic computation. The proxy boundary controls that exception; it does not make it disappear.

## Borrow mechanisms, not frameworks

| Reference | Mechanism worth retaining |
|---|---|
| **pi** | A small harness, prompt/skill extension points, and process/RPC integration.[6] |
| **Hermes** | Separate durable facts from reusable procedures; load detailed skills when relevant.[7] |
| **OpenCode** | Separate the interface from a programmatically accessible engine.[8] |
| **OpenClaw** | Centralize connection ownership and make requests, capabilities, and events explicit.[9] |

None is a required dependency. Do not import their general filesystem, shell, messaging, or device authority into the game.

## The first playable result

Deliver the populated label and offline reader first. Then demonstrate one real `ask` that adds the requested artist, her initial albums, song briefs, introduction date, and future post. Show her immediately on the calendar. Advance the text world, expose pending media, produce one recording when a generator is available, and record a listening decision.

Reload the successor save in a fresh process. The company must still be there without the previous model conversation or proxy cache. Deterministic tests protect that boundary; real model runs establish creative capability. A fixture is not an AI demonstration.

Other kinds of company can come later. Preserve the reusable load/play/save and proxy boundaries; do not build a universal company framework now.

**The world is durable. Attempts are disposable. Intelligence is borrowed. The result belongs to the player.**

---

## Reference notes

These references support the borrowed mechanisms and current packaging/provider details, not a claim that this game has already been implemented. Checked September 11, 2026.

[1] [OpenAI — Function calling](https://developers.openai.com/api/docs/guides/function-calling): the model returns tool calls; the application executes tool logic.

[2] [Node.js — Single executable applications](https://nodejs.org/api/single-executable-applications.html): embedded ESM, bundled scripts, assets, and module-loading constraints.

[3] [ElevenLabs — Eleven Music](https://elevenlabs.io/docs/overview/capabilities/music): music API availability and generation capabilities.

[4] [Vercel — AI SDK repository](https://github.com/vercel/ai): a provider-agnostic toolkit that can be isolated behind the proxy.

[5] [Docker — Engine security](https://docs.docker.com/engine/security/): isolation, capabilities, mounts, and host risks.

[6] [pi — Coding agent](https://github.com/earendil-works/pi/tree/main/packages/coding-agent): minimal harness, skills, prompt templates, and RPC mode.

[7] [Hermes — Skills system](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/): reusable procedural knowledge and its distinction from durable factual memory.

[8] [OpenCode — Server](https://opencode.ai/docs/server/): headless server and multiple clients.

[9] [OpenClaw — Gateway architecture](https://docs.openclaw.ai/concepts/architecture): connection ownership, typed requests, capability declarations, and request deduplication.
