# City-Oriented Agent Runtime — SPECIFICATION.md

Status: Draft specification  
Audience: implementers of the XML language runtime, local LLM orchestration tools, generated Bootstrap dashboards, and project-specific AI cities  
Primary constraint: **a city is not the language itself**. A city is a project-local environment directory that uses the language.

---

## 1. Purpose

This specification defines a staged implementation plan for a multi-agent XML language runtime based on the concept of a city.

The goal is to create a runtime where:

- each user project may contain its own `City/` directory;
- each `City/` directory is a local orchestration environment for that project;
- locations are represented by folders;
- XML files inside those folders describe local state, knowledge, actions, agents, questions, artifacts, and generated views;
- humans and LLM agents interact with the same public action surface;
- generated Bootstrap pages act as dashboards, debuggers, and human control panels;
- LLMs do not directly mutate arbitrary XML;
- LLMs inspect environments and call legal public methods exposed by those environments.

The system should feel like a MOO/MUD because objects live in environments and expose verbs. It should feel like a city because companies, departments, developers, projects, shipments, boards, and offices give humans and LLMs an immediately understandable mental model.

---

## 2. Critical Distinction

### 2.1 The language is not the city

The XML language is the general runtime language.

A `City/` directory is one project-local environment that uses the language.

Correct:

```text
my-audio-editor/
  src/
  package.json
  City/
    lobby/
    corporations/
    developers/
    projects/
```

Also correct:

```text
my-css-framework/
  City/
    lobby/
    corporations/
    knowledge/
```

Also correct:

```text
my-game-engine/
  City/
    lobby/
    studios/
    projects/
```

Incorrect:

```text
The XML language itself is a city.
```

The language must remain general enough to implement many environments. The city is a powerful default orchestration pattern, not the only possible use of the language.

### 2.2 A city is a project-local orchestration environment

Each project may have its own `City/` directory.

The project owner configures that city for that project’s purpose.

Examples:

```text
bootstrap-ui-kit-project/
  City/
    lobby/
    corporations/css-framework-company/
    corporations/ui-kit-company/
    projects/default-ui-kit/
```

```text
browser-audio-editor-project/
  City/
    lobby/
    corporations/audio-app-company/
    corporations/ui-kit-company/
    projects/audio-workbench/
```

```text
pixel-art-game-project/
  City/
    lobby/
    corporations/gameplay-studio/
    corporations/pixel-art-studio/
    projects/side-view-walk-cycle/
```

A city may contain companies, departments, developers, boards, artifacts, and agents, but those belong to the user project.

---

## 3. Design Principles

### 3.1 Directory-first source of truth

The source of truth is the local directory tree.

An XML document may exist, but no single XML file is expected to contain the entire city.

Each location is a folder. XML files inside that folder describe local state.

```text
City/
  lobby/
    location.xml
    actions.xml
    view.xml
    questions.xml
    events.xml
    index.html
```

`index.html` is generated. It is a projection, not the source of truth.

### 3.2 Universal lobby

Every city starts at:

```text
City/lobby/
```

The lobby is the universal central point for every city.

It lists nearby locations, corporations, projects, available actions, active questions, and recent events.

The runtime may always assume:

```text
City/lobby
```

exists or can be created.

### 3.3 Environment before document

An LLM should not ingest the entire city XML.

An LLM receives an environment view:

- current location;
- current actor;
- local objects;
- available actions;
- nearby knowledge;
- current task;
- relevant project/artifact;
- recent local events;
- human questions if relevant.

This is MOO-like locality.

### 3.4 Legal verbs over freehand mutation

LLMs must not directly rewrite arbitrary XML state.

LLMs may:

- inspect the environment;
- list available actions;
- call legal actions;
- propose changes;
- ask humans questions;
- generate artifacts for review.

The runtime performs mutations through public methods.

### 3.5 Same actions for humans and LLMs

A Bootstrap button and an LLM tool call must invoke the same action.

```text
Human clicks "Build Corporation"
LLM calls buildCorporation
Both become:
ACT /lobby buildCorporation
```

### 3.6 Generated UI is a debugger

Every location must render, even when incomplete.

The generated HTML page is:

- a dashboard;
- a debugger;
- a control panel;
- a human inbox surface;
- a status display;
- an XML/source inspector.

Incomplete locations render as stubs.

---

## 4. Existing Element Inventory

The implementation must respect the current language inventory.

### 4.1 Core elements

Implemented:

```text
document, group, start, every, on, filter, map, take,
distinct, scan, delay, debounce, throttle, set, emit, append,
log, call, assert, signal, computed, if, else, match, case,
each, machine, state, go, define
```

These support:

- event streams;
- state machines;
- reactive signals;
- derived projections;
- assertions;
- custom tags via `define`;
- runtime calls;
- conditional logic;
- looping over local collections.

### 4.2 DOM feature elements

Implemented:

```text
click, dblclick, submit, change, input, focus, blur, keydown,
keyup, pointerdown, pointermove, pointerup, mousemove, wheel,
scroll, prevent, addclass, removeclass, text, drag, draw,
start, move, end, pointer
```

These bridge generated HTML dashboards to runtime actions.

### 4.3 AI feature elements

Implemented:

```text
send, conversation, system, prompt, evaluate, user, message,
token, connect, error, tool, param, persona, identity, task,
goal, step, rule, constraint, example, format, output, context,
skill, knowledge, criterion, check
```

These describe:

- agents;
- local LLM connections;
- prompts;
- personalities;
- tasks;
- tools;
- tool parameters;
- messages;
- evaluation criteria;
- local context.

### 4.4 GOFAI feature elements

Implemented:

```text
knowledge, fact, rule, concept, topic, branch
```

These describe civic law, company standards, department knowledge, and artifact acceptance criteria.

### 4.5 Strategy feature elements

Implemented:

```text
strategy, phase, step, call, gate, repeat, map, note
```

These describe workflows, management styles, project movement, and construction strategies.

### 4.6 Spec-only names not yet implemented

Mentioned but not implemented:

```text
sequence, parallel, race, try, catch, retry, slot, use,
channel, open, close, feed, receive, complete, projection, can
```

These should be implemented in stages, not all at once.

---

## 5. Project Directory Contract

### 5.1 City directory location

A city directory lives inside the user’s own project.

```text
user-project/
  City/
```

The runtime must not assume a global city outside the project.

### 5.2 Minimum city tree

Minimum viable city:

```text
City/
  lobby/
    location.xml
    actions.xml
    index.html

  events/
    journal.xml

  templates/
    shell.html

  runtime/
    config.xml
```

### 5.3 Recommended city tree

```text
City/
  lobby/
    location.xml
    actions.xml
    view.xml
    questions.xml
    events.xml
    index.html

  corporations/
    index.xml

  developers/
    index.xml

  humans/
    index.xml

  projects/
    index.xml

  artifacts/
    index.xml

  events/
    journal.xml

  knowledge/
    city.xml
    runtime.xml
    bootstrap.xml

  templates/
    shell.html
    location-dashboard.html
    action-form.html
    question-card.html
    event-log.html
    xml-inspector.html

  runtime/
    config.xml
    permissions.xml
    generators.xml
    prototypes/
      location.xml
      corporation.xml
      department.xml
      developer.xml
      project.xml
      artifact.xml
```

---

## 6. Location Contract

A location is any folder that represents an addressable environment.

A location may contain:

```text
location.xml
actions.xml
agents.xml
knowledge.xml
questions.xml
events.xml
view.xml
index.html
```

Only `location.xml` is required for a full location.

### 6.1 `location.xml`

Purpose: local identity and summary.

Example:

```xml
<location path="/lobby" name="Lobby" kind="public-room">
  <identity>
    <title>Lobby</title>
    <summary>The central starting point for this project city.</summary>
  </identity>

  <knowledge>
    <topic name="purpose">
      <fact subject="lobby" predicate="is" object="the universal starting point"/>
      <fact subject="lobby" predicate="lists" object="nearby locations, corporations, projects, humans, questions, and actions"/>
    </topic>
  </knowledge>
</location>
```

If `location` is not a built-in tag, it must be introduced with:

```xml
<define name="location"/>
```

### 6.2 `actions.xml`

Purpose: public methods exposed by this location.

Use existing `tool` and `param`.

Example:

```xml
<group name="actions" path="/lobby">
  <tool name="buildCorporation">
    <identity>
      <title>Build Corporation</title>
      <summary>Create a new project-local corporation stub.</summary>
    </identity>

    <param name="purpose" type="text" required="false"/>
    <param name="managementStyle" type="choice" values="kanban,stage-gate,spiral,research-lab" required="false"/>

    <rule when="called" then="create corporation directory and stub files" because="corporations are environments"/>
    <rule when="complete" then="render the new corporation dashboard" because="humans need immediate feedback"/>
  </tool>

  <tool name="inspectLocation">
    <identity>
      <title>Inspect Location</title>
      <summary>Open this location's dashboard and source inspector.</summary>
    </identity>
  </tool>
</group>
```

### 6.3 `agents.xml`

Purpose: local conversations and LLM workers.

Example:

```xml
<group name="agents">
  <conversation ai="lobby-guide">
    <system>
      <persona>You are the lobby guide for a project-local XML city.</persona>
      <task>Explain the current environment and list legal actions.</task>
      <rule>Never edit arbitrary XML directly. Use available tools.</rule>
      <rule>Ask narrow human questions when judgment is required.</rule>
    </system>
  </conversation>
</group>
```

### 6.4 `questions.xml`

Purpose: human/agent questions waiting for answers.

Example:

```xml
<group name="questions">
  <message id="q001" to="/humans/founder" kind="yes-no">
    <prompt>Should this corporation create starter departments automatically?</prompt>
    <output name="answer" values="yes,no"/>
  </message>
</group>
```

### 6.5 `events.xml`

Purpose: local event view or cache.

Local files may contain recent events, but the global journal remains authoritative.

### 6.6 `view.xml`

Purpose: optional local UI declaration.

If absent, fallback dashboard rendering is used.

---

## 7. Universal Environment Operations

The runtime must expose five universal operations.

### 7.1 LOOK

```text
LOOK path
```

Returns a compact description of a location.

Must include:

- title;
- summary;
- child locations;
- nearby objects;
- local projects;
- pending questions;
- available high-level status.

### 7.2 ACTIONS

```text
ACTIONS path actor
```

Returns legal actions available to the actor at this path.

Must include:

- action name;
- human label;
- summary;
- parameters;
- risk level if known;
- permission status;
- whether dry-run is supported.

### 7.3 ACT

```text
ACT path action args actor
```

Runs one legal action.

Must:

- validate location exists;
- validate action exists;
- validate actor permission;
- validate arguments;
- perform mutation through runtime code;
- emit event;
- regenerate affected indexes and HTML;
- return a result.

### 7.4 EVENTS

```text
EVENTS path filter
```

Returns event history relevant to the location.

### 7.5 RENDER

```text
RENDER path
```

Generates or refreshes `index.html` for a location.

Must use:

- global shell template;
- local view if present;
- fallback dashboard if no view exists;
- Bootstrap-compatible output;
- XML/source inspector.

---

## 8. Runtime Public Method Model

### 8.1 Tools are public methods

For the first implementation, `tool` is the public method element.

An environment object exposes tools.

```xml
<tool name="createDepartment">
  <param name="name" type="text" required="true"/>
  <param name="purpose" type="text" required="false"/>
</tool>
```

### 8.2 Tool discovery

The LLM must be able to list public methods the way it lists files.

Example LLM context:

```xml
<context path="/lobby">
  <tool name="buildCorporation"/>
  <tool name="inspectLocation"/>
  <tool name="openInbox"/>
</context>
```

### 8.3 Tool execution

The LLM does not change XML directly.

It calls:

```text
ACT /lobby buildCorporation { purpose: "Build Bootstrap-compatible UI kits." }
```

The runtime changes files.

---

## 9. Human Dashboard Model

Every location renders to a human dashboard.

### 9.1 Fallback dashboard

The fallback dashboard must include:

- navbar;
- breadcrumb path;
- location summary;
- child locations;
- local objects;
- available actions;
- pending questions;
- projects;
- artifacts;
- recent events;
- XML inspector;
- construction/stub status if incomplete.

### 9.2 Bootstrap shell

Generated pages use plain Bootstrap.

Required base shell:

```html
<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{title}}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css">
</head>
<body>
  <main id="app">
    {{content}}
  </main>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="{{runtimeScript}}"></script>
</body>
</html>
```

### 9.3 Generated `index.html`

Each location may have generated `index.html`.

Generated HTML should contain a marker:

```html
<!-- Generated by City-Oriented Agent Runtime. Source of truth is local XML files. -->
```

---

## 10. Stub Environments

A location may start as a stub.

This is a feature, not a failure.

### 10.1 Stub meaning

A stub means:

- the environment exists;
- its dashboard can render;
- its purpose is known or being discovered;
- local actions may be incomplete;
- local LLM agents may be constructing it;
- humans may be asked questions.

### 10.2 Standard stub message

```text
This environment/UI is a stub. The local LLM crew is hard at work assembling the user interface and actions.
```

### 10.3 Stub XML

```xml
<stub path="/corporations/ui-kit-works">
  <identity>
    <title>UI-Kit Works is being assembled</title>
    <summary>This environment/UI is a stub. The local LLM crew is creating departments, hiring developers, and generating actions.</summary>
  </identity>

  <state value="under-construction"/>
  <goal>Create a corporation that builds UI kits from Bootstrap-compatible CSS frameworks.</goal>
  <progress value="35"/>
</stub>
```

If `stub` is not a built-in element, define it with `define`.

---

## 11. City Objects

The city pattern uses environment objects.

These are not necessarily built into the core language. They may be custom tags created with `define`.

Recommended city object vocabulary:

```text
city
lobby
location
corporation
department
developer
human
project
artifact
shipment
board
ticket
question
stub
```

These belong to the city environment profile.

They are not the foundation of the language runtime itself.

---

## 12. Corporations

A corporation is a location that owns knowledge, departments, projects, and production standards.

Example directory:

```text
City/corporations/ui-kit-works/
  location.xml
  corporation.xml
  departments.xml
  developers.xml
  actions.xml
  agents.xml
  projects.xml
  events.xml
  index.html
```

Example:

```xml
<corporation name="UI-Kit Works" path="/corporations/ui-kit-works">
  <identity>
    <summary>Builds reusable UI kits from approved CSS frameworks.</summary>
  </identity>

  <knowledge>
    <topic name="production">
      <fact subject="company" predicate="accepts" object="CSSFramework"/>
      <fact subject="company" predicate="produces" object="UIKit"/>
      <rule when="a component has no story" then="send it to Story Lab" because="components need realistic simulations"/>
    </topic>
  </knowledge>
</corporation>
```

---

## 13. Departments

A department is a specialist work location inside a corporation.

Example directory:

```text
City/corporations/ui-kit-works/departments/story-lab/
  location.xml
  department.xml
  board.xml
  actions.xml
  agents.xml
  index.html
```

Example:

```xml
<department name="Story Lab" path="/corporations/ui-kit-works/departments/story-lab">
  <identity>
    <summary>Creates realistic component simulations and usage stories.</summary>
  </identity>

  <knowledge>
    <topic name="stories">
      <rule when="a component is demonstrated" then="show realistic data" because="real content reveals layout problems"/>
    </topic>
  </knowledge>
</department>
```

---

## 14. Developers

A developer is an agent-like object that may be human, LLM-driven, scripted, or hybrid.

Example:

```xml
<developer name="Mina" path="/developers/mina">
  <identity>
    <persona>Bootstrap token specialist and CSS framework developer.</persona>
  </identity>

  <skill name="Bootstrap tokens"/>
  <skill name="CSS variables"/>
  <skill name="semantic color"/>
  <skill name="dark mode"/>

  <knowledge>
    <topic name="tokens">
      <rule when="a size repeats across components" then="promote it to an app token" because="centralized sizing keeps layouts stable"/>
    </topic>
  </knowledge>
</developer>
```

---

## 15. Humans

A human is an agent with a dashboard, inbox, permissions, and approval powers.

Example:

```xml
<human name="Founder" path="/humans/founder">
  <identity>
    <summary>Primary human operator of this project city.</summary>
  </identity>

  <can action="answerQuestion"/>
  <can action="approveShipment"/>
  <can action="rejectKnowledge"/>
  <can action="buildCorporation"/>
</human>
```

If `can` is not implemented, this becomes a Stage 15 priority.

---

## 16. Projects

A project is a moving work object.

It may travel through corporations and departments.

Example:

```xml
<project name="Audio Workbench" path="/projects/audio-workbench">
  <goal>Create a browser-based audio editing application using generated UI kits.</goal>
  <state value="intake"/>
</project>
```

Project route may initially be represented as `strategy`:

```xml
<strategy name="audio-workbench-route">
  <phase name="framework">
    <step agent="css-framework-company" in="goal" out="frameworkArtifact"/>
  </phase>

  <phase name="ui-kit">
    <step agent="ui-kit-company" in="frameworkArtifact" out="uiKitArtifact"/>
  </phase>

  <phase name="application-template">
    <step agent="app-template-company" in="uiKitArtifact" out="applicationTemplate"/>
  </phase>
</strategy>
```

---

## 17. Artifacts and Shipments

### 17.1 Artifact

An artifact is produced work.

```xml
<artifact name="Bootstrap-Compatible Theme Contract" type="CSSFramework">
  <state value="partial"/>
  <fact subject="artifact" predicate="complete" object="semantic color tokens"/>
  <fact subject="artifact" predicate="incomplete" object="motion tokens"/>
</artifact>
```

### 17.2 Shipment

A shipment moves partial or complete work between locations.

```xml
<shipment from="/corporations/css-framework-company" to="/corporations/ui-kit-works" project="/projects/audio-workbench">
  <artifact path="/artifacts/audio-workbench/theme-contract"/>
  <state value="partial"/>
  <fact subject="shipment" predicate="complete" object="color tokens"/>
  <fact subject="shipment" predicate="incomplete" object="motion tokens"/>
  <rule when="received" then="validate compatibility" because="partial work must not be blindly trusted"/>
</shipment>
```

If `shipment` is not implemented, use `define`.

---

## 18. Events

Every mutation must emit an event.

Events make the city replayable and debuggable.

Example:

```xml
<message id="e001">
  <emit event="corporation.created"/>
  <append to="events" value="{ kind:'corporation.created', actor:'/humans/founder', target:'/corporations/ui-kit-works' }"/>
</message>
```

Minimum event fields:

- id;
- kind;
- actor;
- target;
- location;
- timestamp;
- action;
- result.

---

## 19. Permissions

Permissions should be affordance-based, not heavy static typing.

The actor sees only actions they may run.

The spec-only `can` element should be implemented.

Example:

```xml
<can actor="/humans/founder" action="buildCorporation" path="/lobby"/>
<can actor="/corporations/system" action="createDepartment" path="/corporations"/>
<can actor="/developers/mina" action="shipArtifact" path="/projects/audio-workbench"/>
```

Before `can` is implemented, permissions may be runtime configuration.

---

## 20. Local LLM Context

An LLM context is built from the environment.

Example:

```xml
<context path="/corporations/ui-kit-works/departments/story-lab">
  <identity>
    <developer ref="/developers/lina"/>
    <project ref="/projects/audio-workbench"/>
  </identity>

  <knowledge from="/knowledge/bootstrap.xml"/>
  <knowledge from="/corporations/ui-kit-works/knowledge.xml"/>

  <tool name="createStory"/>
  <tool name="requestReview"/>
  <tool name="askHuman"/>

  <message kind="instruction">
    <prompt>You are inside the Story Lab. Use only listed tools.</prompt>
  </message>
</context>
```

The LLM must not receive the full city unless explicitly debugging the whole city.

---

## 21. Human Questions

Human questions are first-class objects.

Question types:

- yes/no;
- choose-one;
- choose-many;
- approve/reject;
- short text;
- rank options.

Example:

```xml
<message id="q102" to="/humans/founder" kind="choose-one">
  <prompt>Which management style should this corporation use?</prompt>
  <output name="answer" values="kanban,stage-gate,spiral,research-lab"/>
</message>
```

Rules:

- Ask narrow questions.
- Prefer options over open-ended prompts.
- Store every answer as an event.
- Resume blocked strategies from answer events.

---

## 22. Static Site Generation

The runtime should be able to generate a static dashboard site.

Command concept:

```text
generate City/
```

Generated outputs:

```text
City/lobby/index.html
City/corporations/*/index.html
City/projects/*/index.html
City/developers/*/index.html
```

Regeneration steps:

1. Walk city directories.
2. Detect locations.
3. Parse local XML files.
4. Generate indexes.
5. Render fallback or custom views.
6. Write `index.html`.
7. Record generation event or timestamp.

---

## 23. Implementation Stages

### Stage 0 — Specification and terminology

Goal: make the language direction clear.

Tasks:

- [ ] Create `SPECIFICATION.md`.
- [ ] State clearly that `City/` is project-local.
- [ ] State clearly that city is an environment profile, not the language itself.
- [ ] Preserve existing element inventory.
- [ ] Define directory-first source of truth.
- [ ] Define `City/lobby` as universal entry point.
- [ ] Define legal verbs as environment public methods.

Done when:

- [ ] Implementers understand the separation between language runtime and city environment.
- [ ] The specification can guide implementation without relying on hidden conversation context.

### Stage 1 — Directory MOO foundation

Goal: make a city folder readable.

Tasks:

- [ ] Create `City/lobby/`.
- [ ] Create `City/lobby/location.xml`.
- [ ] Create `City/lobby/actions.xml`.
- [ ] Create `City/events/journal.xml`.
- [ ] Implement city root discovery.
- [ ] Implement location discovery.
- [ ] Implement XML loading per directory.
- [ ] Implement path normalization:
  - `/lobby`
  - `/corporations/system`
  - `/projects/audio-workbench`
- [ ] Implement `LOOK`.

Done when:

- [ ] Runtime can load `City/lobby`.
- [ ] Runtime can print a compact environment summary.

### Stage 2 — Actions as public methods

Goal: expose legal verbs.

Tasks:

- [ ] Treat `tool` as an environment action.
- [ ] Treat `param` as action argument schema.
- [ ] Implement `ACTIONS path actor`.
- [ ] Implement `ACT path action args actor`.
- [ ] Validate action existence.
- [ ] Validate required params.
- [ ] Emit event on action execution.
- [ ] Prevent freehand LLM XML mutation.

Done when:

- [ ] Runtime can list lobby actions.
- [ ] Runtime can execute `buildCorporation` through a legal action.

### Stage 3 — Event journal

Goal: make mutation replayable.

Tasks:

- [ ] Implement append-only `City/events/journal.xml`.
- [ ] Add event ids.
- [ ] Add actor, action, target, location, timestamp.
- [ ] Implement local event views.
- [ ] Implement `EVENTS path`.
- [ ] Show recent events in console output.

Done when:

- [ ] Every action emits an event.
- [ ] A city action can be traced after execution.

### Stage 4 — Bootstrap fallback renderer

Goal: every location renders as a human dashboard.

Tasks:

- [ ] Create `City/templates/shell.html`.
- [ ] Implement `RENDER path`.
- [ ] Generate `City/lobby/index.html`.
- [ ] Render title, summary, child locations, actions, questions, events.
- [ ] Add XML inspector panel.
- [ ] Use Bootstrap 5.3.8 and Bootstrap Icons.
- [ ] Add generated file marker.

Done when:

- [ ] Opening `City/lobby/index.html` shows a usable dashboard.
- [ ] The dashboard has a Build Corporation button.

### Stage 5 — Shared human/LLM action surface

Goal: make dashboard buttons call the same actions as LLM tools.

Tasks:

- [ ] Generate Bootstrap forms from `tool`/`param`.
- [ ] Map button submit to `ACT`.
- [ ] Render action results.
- [ ] Regenerate affected pages after action.
- [ ] Ensure LLM and human action paths are identical.

Done when:

- [ ] Human clicks Build Corporation.
- [ ] Runtime executes the same action an LLM would call.
- [ ] Event journal records the action.

### Stage 6 — System Corporation

Goal: bootstrap the world with a corporation that maintains the city itself.

Tasks:

- [ ] Create `City/corporations/system/`.
- [ ] Add `corporation.xml`.
- [ ] Add Runtime Department.
- [ ] Add Worldbuilding Department.
- [ ] Add Interface Department.
- [ ] Add Safety and Integrity Department.
- [ ] Add System Corporation dashboard.
- [ ] Add actions:
  - `createCorporation`
  - `createDepartment`
  - `hireDeveloper`
  - `generateLocation`
  - `inspectLocation`
  - `repairLocation`

Done when:

- [ ] Lobby lists System Corporation.
- [ ] System Corporation can create a corporation stub.

### Stage 7 — Stub environments

Goal: make incomplete environments visible and useful.

Tasks:

- [ ] Add `stub.xml` support.
- [ ] Render standard stub message.
- [ ] Render progress bar.
- [ ] Render construction tasks.
- [ ] Render waiting human questions.
- [ ] Add `continueConstruction` action.
- [ ] Let local LLM crew propose missing pieces.
- [ ] Apply proposals only through legal actions.

Done when:

- [ ] New corporation appears as an under-construction location.
- [ ] Stub page is understandable and actionable.

### Stage 8 — Human agents and inbox

Goal: let humans participate as agents.

Tasks:

- [ ] Create `City/humans/`.
- [ ] Create default founder human.
- [ ] Implement human inbox.
- [ ] Render questions in dashboards.
- [ ] Implement answer actions.
- [ ] Store answers as events.
- [ ] Resume strategies after answers.

Done when:

- [ ] A corporation stub can ask the human a yes/no question.
- [ ] Human answer appears in event journal.
- [ ] The construction process continues.

### Stage 9 — LLM local context builder

Goal: feed LLMs environments, not whole cities.

Tasks:

- [ ] Implement `buildContext(actor, path, task)`.
- [ ] Include local identity.
- [ ] Include nearby objects.
- [ ] Include available tools.
- [ ] Include relevant knowledge.
- [ ] Include current project/artifact.
- [ ] Include recent events.
- [ ] Exclude unrelated city data.
- [ ] Render context as XML.

Done when:

- [ ] LLM can inspect a location.
- [ ] LLM can list legal actions.
- [ ] LLM can call actions without seeing the whole city.

### Stage 10 — Departments and developers

Goal: make corporations operational.

Tasks:

- [ ] Add department directories.
- [ ] Add developer directories.
- [ ] Add department boards.
- [ ] Add developer skills.
- [ ] Add assignment actions.
- [ ] Add local department agents.
- [ ] Add developer dashboards.

Done when:

- [ ] A corporation can have departments.
- [ ] Departments can have assigned developers.
- [ ] Developers have local work dashboards.

### Stage 11 — Projects

Goal: create moving work objects.

Tasks:

- [ ] Add project directories.
- [ ] Add project goals.
- [ ] Add project state machine.
- [ ] Add project board.
- [ ] Add project route as strategy.
- [ ] Implement `openProject`.
- [ ] Implement `moveProject`.

Done when:

- [ ] A project can move from one department to another.
- [ ] Movement appears in event log and dashboards.

### Stage 12 — Artifacts and shipments

Goal: move partial work safely.

Tasks:

- [ ] Add artifact directories.
- [ ] Add artifact status.
- [ ] Add completeness/incompleteness facts.
- [ ] Add shipment records.
- [ ] Implement `shipArtifact`.
- [ ] Implement `receiveShipment`.
- [ ] Implement `rejectShipment`.
- [ ] Record assumptions and open questions.

Done when:

- [ ] CSS Framework Corporation can ship partial framework data to UI-Kit Corporation.
- [ ] Receiving corporation sees exactly what is complete and incomplete.

### Stage 13 — Management styles

Goal: allow different development styles per corporation/project.

Initial implementation:

- [ ] Kanban using `machine`, `state`, and `go`.

Later:

- [ ] Stage-gate.
- [ ] Spiral.
- [ ] Scrum.
- [ ] Research lab.
- [ ] Incident response.
- [ ] Studio model.
- [ ] Guild model.
- [ ] Bazaar model.
- [ ] Review board.

Done when:

- [ ] A project can choose a management style.
- [ ] The dashboard reflects that style.

### Stage 14 — Prototypes and inheritance

Goal: avoid heavy typing while keeping reusable behavior.

Tasks:

- [ ] Implement prototype files in `City/runtime/prototypes/`.
- [ ] Let locations inherit default actions.
- [ ] Let corporations inherit organization actions.
- [ ] Let departments inherit work-queue actions.
- [ ] Keep inheritance shallow.
- [ ] Show inherited actions in debugger.

Done when:

- [ ] A new corporation gets useful default actions without copying XML everywhere.

### Stage 15 — Permissions with `can`

Goal: implement affordance-based permission.

Tasks:

- [ ] Implement `can`.
- [ ] Filter actions by actor.
- [ ] Hide unavailable actions from LLM context.
- [ ] Disable unavailable actions in human dashboard.
- [ ] Log permission failures.

Done when:

- [ ] Different actors see different legal verbs in the same location.

### Stage 16 — Spec-only flow controls

Goal: strengthen runtime workflow.

Prioritize:

```text
sequence, parallel, race, try, catch, retry
```

Use cases:

- `sequence`: project pipelines.
- `parallel`: departments working simultaneously.
- `race`: competing agent proposals.
- `try/catch`: safe runtime actions.
- `retry`: LLM/network/transient failure recovery.

Done when:

- [ ] Project construction workflows can run safely with failure handling.

### Stage 17 — Channels and projections

Goal: support richer runtime communication and generated views.

Implement:

```text
channel, open, close, feed, receive, complete, projection, slot, use
```

Use cases:

- `channel`: human/agent/event communication.
- `open/close`: rooms, panels, projects, boards.
- `feed/receive`: streaming artifacts/messages.
- `complete`: task and artifact completion.
- `projection`: generated views from directory state.
- `slot`: dashboard layout slots.
- `use`: import prototype/template/knowledge.

Done when:

- [ ] Generated dashboards are formal projections of city state.
- [ ] Agents and humans can communicate through channels.

### Stage 18 — Canonical city production chain

Goal: demonstrate the key idea.

Create:

```text
CSS Framework Corporation
  produces CSSFramework

UI-Kit Corporation
  consumes CSSFramework
  produces UIKit

Application Template Corporation
  consumes UIKit
  produces ApplicationTemplate

Specialized App Corporation
  consumes ApplicationTemplate
  produces DomainApplication
```

Tasks:

- [ ] Create all four corporations.
- [ ] Create departments for each.
- [ ] Create one project that travels through them.
- [ ] Ship partial artifacts at each boundary.
- [ ] Render progress in dashboards.
- [ ] Allow human questions at gates.

Done when:

- [ ] The project visibly moves through the city.
- [ ] Every corporation contributes distinct knowledge.

### Stage 19 — Pixel city visualization

Goal: add beauty after the state model works.

Tasks:

- [ ] Add optional city map.
- [ ] Add building cards.
- [ ] Add pixel-art avatars.
- [ ] Add project package movement.
- [ ] Add corporation icons.
- [ ] Keep Bootstrap dashboard/debugger available.

Done when:

- [ ] The city feels alive without hiding operational state.

### Stage 20 — Hardening

Goal: make the runtime dependable.

Tasks:

- [ ] Strict XML parse errors visible in dashboard.
- [ ] Broken links visible.
- [ ] Missing files visible.
- [ ] Unknown actions visible.
- [ ] Failed LLM calls visible.
- [ ] Failed permissions visible.
- [ ] Regeneration errors visible.
- [ ] Recovery actions available.
- [ ] Event replay test.
- [ ] Static generation test.
- [ ] LLM local context size test.

Done when:

- [ ] The city can be debugged from its generated dashboards.

---

## 24. Non-Goals

Do not do these early:

- Do not create a giant global XML document.
- Do not make the city the core language.
- Do not require every project to use a city.
- Do not feed whole city state to every LLM call.
- Do not let LLMs mutate arbitrary XML.
- Do not build pixel-art simulation before actions/events/rendering work.
- Do not implement every management style before Kanban works.
- Do not type everything rigidly up front.
- Do not hide generated state from humans.
- Do not make custom UI mandatory.

---

## 25. Implementation Motto

```text
The language is the runtime.
The city is a project-local environment.
Folders are places.
XML files are object records.
Tools are public methods.
Events are memory.
Bootstrap pages are dashboards.
Humans and LLMs are both agents.
The lobby is always the beginning.
```

---

## 26. Definition of Done for First Complete Prototype

The first complete prototype is done when:

- [ ] A user project can contain `City/`.
- [ ] `City/lobby/` exists.
- [ ] The runtime can `LOOK /lobby`.
- [ ] The runtime can list `ACTIONS /lobby`.
- [ ] The runtime can `ACT /lobby buildCorporation`.
- [ ] The action creates a corporation folder.
- [ ] The action writes local XML files.
- [ ] The action emits an event.
- [ ] The action regenerates affected `index.html` files.
- [ ] The lobby dashboard lists the new corporation.
- [ ] The new corporation dashboard renders as a stub.
- [ ] The stub can ask a human a yes/no question.
- [ ] The human answer is stored as an event.
- [ ] The local LLM receives only environment context.
- [ ] The local LLM can list and call legal actions.
- [ ] The entire system remains understandable by browsing the `City/` directory.

---

## 27. Final Summary

City-Oriented Agent Runtime is not a monolithic city application.

It is a staged XML runtime profile for project-local AI orchestration.

Each user project may contain its own `City/` directory. That directory contains local environments, public methods, agents, humans, corporations, departments, projects, artifacts, shipments, events, and generated dashboards.

The language runtime provides the general machinery:

- XML parsing;
- custom tags;
- events;
- calls;
- signals;
- strategies;
- conversations;
- tools;
- knowledge;
- checks;
- generated projections.

The city profile uses that machinery to create a human-readable, LLM-navigable software civilization inside a project.

The strongest implementation rule is:

```text
Never ask an LLM to understand the whole world.
Put the LLM in a place, show it what is nearby, list the legal verbs, and let the world change through actions.
```
