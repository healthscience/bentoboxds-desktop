# Besearch experience plan (concept + UX + architecture)

## Concept summary (HOP + Gaia framing)
- Besearch is a peer-driven scientific cycle that connects context, research, computation, and consilience to evolve shared intelligence across the HOP network.
- It is not bound to a single domain; human/body, built environment, and nature are connected, and the same cycle structure applies across contexts.
- The goal in BentoBoxDS is to assemble the right tools in any starting context, so peers can create, inspect, and evolve besearch cycles “on the fly.”

### Four-stage besearch cycle
1. **Peer data in context**: peers identify markers/biomarkers in context (body, place, behavior, environment).
2. **Learn from best research**: attach research cues, relevant sources, and peer-notes to contextualize the cycle.
3. **Compute + DML + evolution**: run computations (stats, ML, heuristics) on the cue data to evolve the solution space.
4. **Simulation + consilience**: test predictions, cross-check against other besearch cycles, and converge on shared meaning.

## UX flows (three entry points, shared destination)
All entry points must converge on the same besearch cycle creation and tooling, with world-flip navigation to move between canvas worlds.

### Entry point A: Besearch button/modal
1. Peer opens besearch tools (dedicated button).
2. Peer creates a cycle via the form.
3. Peer jumps to relevant world (body, cue space, or besearch canvas) to attach context and markers.
4. Peer views summary + evolution state in toolbar.

### Entry point B: Beebee agent setup
1. Peer asks Beebee to set up a besearch.
2. Beebee guides selection of context, markers, and research cues.
3. Beebee launches or routes to the correct world with prefilled data.
4. Peer completes cycle details and initiates computation.

### Entry point C: CueSpace modal (spaceTemplate)
1. Peer is in a cue space and opens the besearch modal from the space toolbar.
2. Peer attaches local cues (marker, research, media, product) to the cycle.
3. Peer switches worlds if needed (body diagram or besearch canvas) to finish the cycle.

## World-flip navigation (core UX primitive)
- Universal tools should allow peers to move between canvas worlds in response to context:
  - **Body → CueSpace** (e.g., tagging heart → create HRV cue space)
  - **CueSpace → Besearch** (attach cues to besearch cycle)
  - **Besearch → Body or Place** (return to context for refinement)
- Default assumption: all worlds are connected and can participate in a single besearch cycle.

## Architecture plan (current components + next structure)
### Key components and roles
- Besearch modal + form: `src/components/besearch/lifetools/besearchCreateForm.vue`
- Besearch canvas world: `src/components/besearch/besearchCycle.vue` + canvas managers
- CueSpace entry: `src/components/bentospace/spaceTemplate.vue`
- Beebee agent entry: `src/components/beebeeView/beebeeView.vue`
- Body diagram tagging target: `src/components/beebeeView/diagrams/bodyDiagram.vue`

### Store/data responsibilities
- Central state and HOP I/O: `src/stores/besearchStore.js`
- Required shared payload (from existing plan): cycles, interventions, markers, network experiments, canvas state.
- Computed lists for forms: experiments, markers, interventions by category.

### Proposed shared “world navigation” capability
- Add a shared action API (store or composable) to switch worlds and pass context:
  - `navigateToWorld({ world, context })`
  - Context payload includes: `cueId`, `markerId`, `bodyPartId`, `besearchCycleId`, `experimentId`
- This API should be invoked from:
  - Beebee actions
  - Besearch toolbar actions
  - CueSpace tools

### Body-part tagging flow (first task focus)
- Peer identifies a body part location and tags it (e.g., heart cue).
- From that tag, peer can launch:
  - Cue space (context-building)
  - BentoBox (data exploration)
  - Besearch cycle (full compute workflow)
- This flow should work regardless of starting world or entry point.

## Example peer cases (shared across entry points)
Any case can begin from the besearch modal, Beebee, or cueSpace.
1. Daily average heart rate computation (statistical baseline for advanced models).
2. Creatine intervention with body composition markers twice weekly.
3. Mindfulness practice as preventative hayfever treatment.
4. Compare HRV during training vs resting states.
5. Indoor/outdoor air quality linked to sleep; photos for moss/lichen assessment.
6. Rainfall vs river water levels; include water color photos.

## Near-term planning assumptions
- Start with universal tools that support world-flip navigation.
- Prioritize body-part tagging as the earliest cross-world action.
- Keep three initial cases for implementation later (to be selected).

## Stage 0 decision: initial three peer cases
- Case 1: daily average heart rate computation.
- Case 2: creatine intervention with body composition tracking.
- Case 3: machine learning case (autoregression prediction + genetic algorithm tuning; start with one peer then 2–3 peer network; later explore neural network weight aggregation).
- Case 1 and 2 are immediate focus; ML case is experimental and later.

## NXP genesis + instance notes (for cases 1 and 2)
- Define device inputs (e.g., heart rate sensor, body composition scale).
- Define data structure and marker bindings (heart rate, body fat, muscle mass, water weight).
- Create NXP genesis contract and instantiate per peer.

## Universal besearch tools (three depths of navigation)
Goal: a single toolset that brings together besearch creation regardless of starting world.

### Depth 1: World mode + routing
- Select current world or target world (body, cue space, besearch canvas).
- Provide explicit world-flip actions to keep context intact.
- Keep Beebee access available at all times.

### Depth 2: Context building
- Cue tools + library access (markers, research cues, media, products).
- Create or attach a cue space to the cycle.
- Allow tagging of body parts into cues (e.g., heart cue).

### Depth 3: Devices, data, network
- Source devices and datasets (local + network).
- Bind markers/biomarkers to data streams.
- Initiate or schedule besearch computation.

## Besearch cycle → bentobox detail ladder
When a cycle item is clicked in a world (e.g., cue world), it should reveal a bentobox at increasing levels of detail:
1. **Preview**: compact summary tile (key signals + status).
2. **Expanded**: quadrant view with now/future + network now/future.
3. **Full**: full bentobox workspace with tools, modules, and share actions.

## Bentobox quadrant description
- **Bottom-left (now)**: peer present data view.
- **Bottom-right (future)**: prediction/simulation for the peer.
- **Top-left (network now)**: aggregated peer results (charts/simulations).
- **Top-right (network future)**: aggregated future prediction.
- Quadrants are draggable to resize their focus area.
- Each quadrant can show its own map and social graph view.
- Map view uses the same OpenStreetMap UI as the besearch earth world for continuity.
- Tools: date selection, open data selection, tables/charts/simulation.
- Module drawer: shows HOPquery, device/data/computation, coherence ledger history, ML.
- Sharing: HTML view or HOPquery share for peers to add data.
- Evolution: each bentobox has its own evolution algorithm.

## Peer-to-peer networking (bbNexus surface)
- Goal: make peer add/share/manage flows minimal and accessible from bbNexus.
- Entry point: account tabs peer list view for invite generation, receive, and social peer list.
- HOP handles peer-to-peer crypto and transport; UI should abstract complexity.
- bbNexus should surface:
  - Quick add peer (paste invite)
  - Generate invite (copy/share)
  - Peer list (status + actions)
  - Share targets for bentobox and besearch cycles

## Peer experience shift (design intent)
- bbNexus is treated as the new interaction grammar: anchor → context → action.
- Prioritize clarity + peer autonomy, while layering novel cue‑cube/rollout mechanics.
- The experience should signal a new paradigm without sacrificing speed or comprehension.

## bbNexus placement + Beebee command feedback
- **Placement**: recommend dual‑presence with a single source of truth:
  - A **home anchor** (start‑like entry) for discoverability.
  - **Context instances** attached to besearch cycles, bentoboxes, and Beebee chats for in‑place work.
  - Avoid multiple conflicting toolbars by treating context instances as “spawned views” of the same bbNexus state.
- **Limiting to context only** is clean and focused, but risks making bbNexus feel hidden/secondary; a lightweight home anchor preserves its “new paradigm” role.
- **Beebee command**: add `@nexus` to switch Beebee into a besearch/bentobox‑building mode where it pre‑fills context, highlights missing ingredients, and can route to the right tool surface.

## @nexus onboarding (education pattern)
- Beebee introduces `@nexus` the first time a peer asks to set up a besearch or bentobox.
- Prompt example: “Want me to open bbNexus so we can assemble the pieces together?”
- If accepted, Beebee opens bbNexus and highlights the next missing ingredient (world → context → data → peers).
- Provide a short tooltip/legend explaining bbNexus as the peer‑experience control surface.

## Open decisions to confirm
- Which three cases to implement first.
- The exact data contract for body-part tagging to feed cue space and besearch.
- The minimum UX for world-flip navigation (toolbar, context menu, or Beebee command).

## Modal system flow map
This documents the modal-first UX and the navigation surface bbNexus must reach.

```mermaid
flowchart TD
  entry[Main shell] --> chat[Main chat view]
  entry --> cues[Cues modal]
  entry --> holistic[Holistic modal]
  entry --> besearch[Besearch modal]
  entry --> graph[Graph modal]
  entry --> diary[Diary modal]
  entry --> cuespace[CueSpace modal]
  entry --> dataspace[Dataspace modal]

  dataspace --> library[Library base ingredients]
  dataspace --> modules[Module contracts]
  dataspace --> experiments[Network experiment tools]

  cuespace --> cuesTools[Cue tools]
  cuespace --> contextTools[Context building]
  cuespace --> besearchEntry[Besearch create form]
  cuespace --> share[Share tools]
  cuespace --> beebee[Beebee chat modal]

  besearch --> canvas[Besearch canvas world]
  besearch --> lifetools[Life tools]
  besearch --> toolbar[Intervention toolbar]
  besearch --> beebee

  cues --> beebee
  holistic --> beebee
  graph --> beebee
  diary --> beebee
```

## Universal tool naming options (B-leaning)
bbNexus

## Hard critique (vision vs web capability)
- **Scope coupling risk**: The plan assumes universal tools + world-flip across three worlds immediately. In practice, cross-world context syncing is the hardest UX problem and will amplify confusion unless a single, minimal shared context contract is locked early. Without that, peers will experience “teleport fatigue” and lose the thread.
- **Cognitive load**: The four-stage cycle, three entry points, three worlds, and Beebee guidance are each heavy. Combining them risks a UX that is too dense to onboard peers. The plan needs a tighter onboarding funnel that hides complexity until the first cycle is complete.
- **Data availability gap**: Besearch depends on markers, experiments, and research cues being reliably available. Current store payloads are partial and HOP integration is still fragile; the plan assumes stable, rich data that the web client may not have.
- **Web runtime constraints**: Canvas-heavy world interactions + real-time updates + DML-like compute aspirations are beyond typical browser performance without strong back-end support and incremental rendering. The plan must assume most computation runs server-side and the UI focuses on summaries.
- **Beebee dependency risk**: Beebee is critical to guiding the peer, but the plan does not define a minimum “Beebee fallback” when the agent is unavailable or wrong. A manual path must be fully usable.
- **Collision-based creation**: Great for embodiment but brittle in web UX today. Collision triggers can feel accidental without a clear affordance. If collision is used, it needs visible targets and confirmation steps.
- **Networked truth**: The vision implies shared intelligence across the HOP network, but the plan does not define how conflicting cycles or inconsistent data are reconciled. Without a resolution model, consilience will feel like a buzzword rather than a capability.
