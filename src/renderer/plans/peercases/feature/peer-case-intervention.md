## Use case 2: intervention (creatine)

## Overview
- Peer goal: improve body mass composition with creatine intervention and observe network effects over time.
- Primary signal: Withings smart scale body composition (weight, body fat %, muscle/lean mass).
- Context (cue space / environment): cue space includes Intervention entry for creatine; related spaces include Swimming, Recovery/HRV, Movement.
- Devices / data sources: Withings smart scale; optional HRV wearables for context.
- Expected outcome: statistically significant change in body composition after intervention start; secondary correlations in HRV and swim performance.

## Besearch cycle framing
- Cycle name: Creatine Intervention — Body Composition
- Hypothesis / question: Does starting creatine monohydrate (3g daily) improve body composition vs baseline, and do related besearch cycles show correlated changes (HRV, swim times)?
- Marker(s) / biomarker(s): weight, body fat %, muscle/lean mass, HRV (context), swim time (context).
- Network experiment (NXP) contract: Withings Body Composition NXP (time‑series) linked to intervention events.
- Compute contract(s):
  - Pre/Post change analysis around intervention start/stop/restart.
  - Trend change detection (slope before vs after).
  - Significance testing / effect size on body composition metrics.
  - Contextual correlation with HRV and swim performance.
- Frequency / cadence: daily weigh‑ins; weekly review summaries.
- Baseline window: 4–6 weeks prior to intervention start.
- Evaluation metrics: mean change, % change, confidence intervals, p‑value/effect size, time to stabilization.

## Bentobox linkage
- Bentobox ID: (to be assigned)
- Contract ID: Withings body composition NXP + Intervention event contract
- Cue space ID: Intervention / Body Composition
- Visualization focus (now / future / network now / network future):
  - Now: body composition trends + intervention timeline
  - Network now: peers notified of intervention and contextual changes

## Workflow steps
1. Create Intervention entry in cue space (creatine monohydrate 3g daily) with product link and metadata.
2. Record start date: 2026-02-01. Allow stop/restart entries when applicable.
3. Connect Withings scale data to the Body Composition NXP.
4. Select/add computation module for pre/post significance testing.
5. Notify related besearch cycles (HRV, Swimming, Movement) that intervention started.
6. Review results at weekly cadence; adjust intervention status if needed.

## Full flow (Data → Library → NXP → Bentobox)
- **Data import**: ingest from app or wearable device (sqlite/csv/json).
- **Library reference contracts**:
  - Datatypes
  - Data packaging
  - Computation
  - Visualisation
- **Network experiment (NXP)**: built from module contracts composed of reference contracts (see [`src/components/library/contracts/viewer/referenceModule.vue`](src/components/library/contracts/viewer/referenceModule.vue)).
- **Genesis contract**: one peer contributes the genesis contract.
- **Private instances**: each peer creates their own private instance and connects their data.
- **Cue spaces**: add the NXP to one or more cue spaces (e.g., Movement, Swimming).
- **Bentobox**: becomes the cellular container showing context‑filtered data per space.
- **Computation choice**:
  - Option A: create a new NXP named Body Composition (Withings).
  - Option B: reuse an existing Body Composition NXP and add a computation module for intervention significance.
- **Besearch**: select or attach computation as part of the cycle.

## Intervention documentation (cue space)
- Type: supplement
- Product: creatine monohydrate
- Dose: 3g daily
- Start date: 2026-02-01
- Stop date: (if paused)
- Restart date: (if resumed)
- Link: product or evidence page (URL)
- Notes: hydration, training load, other concurrent changes

## Holistic notifications
- On intervention start/stop/restart, notify:
  - HRV / Recovery besearch cycles
  - Swimming performance besearch cycles
  - Movement / training load cycles
- Rationale: detect confounders or co‑occurring improvements.

## Notes / open questions
- Preferred statistical test for significance (t‑test, Bayesian change‑point, non‑parametric)?
- Minimum data window required before declaring effect?
- How to attribute changes when multiple interventions overlap?
