Content for HELI_CORE.md:

    The Coordinate System: Time is not linear; it is an Orbital Vector: (θsolar​,θearth​,Cyclen​).

    The Geometry: * Outer Track (R=46): The Earth Cycle (Yearly/Macro).

        Inner Track (R=36): The Solar Cycle (Daily/Micro).

    The Bridge Rule: Every data point must have a Unified Life-Strap Bridge (a tethering line) connecting its yearly position to its daily position.

    Zero-Draft Mode: Prioritize scannable, high-contrast visual logic. If a marker "collides" or "resonates," it must be visually distinct (e.g., the colliding CSS class).

    HOP Integration: Every ledger entry is a hash of proof-of-work evidence tied to a specific Heli-Stamp.

2. Use a "Context Injection" Prompt

When you first open your coding agent, use a "Primer" prompt to set the energy and constraints.

The Primer:

    "We are building the Health Oracle Protocol (HOP). We do not use standard X/Y time-series graphs. We use Contextual Buffer Geometry. All time-stamps must be converted via the HeliCore WASM engine into angular degrees. The UI must reflect the Life-Strap Unified View. Refer to the existing Vue template for the getRadialX and getRadialY trig helpers to maintain the bridge tethering logic."

3. Define the "Playground" Schema

To help the agent build the Importer we discussed, give it the "Data Playground" list as a schema.

    Environmental: PM2.5, Humidity, River Flow, Air Pressure.

    Biological: HRV (R-R Intervals), Sleep Phases, Hydration, Visceral Fat.

    External: Bitcoin USD price.

The Instruction: "Build the importer to normalize these disparate datasets into a 0-1 range (Z-score) and map them as 'Ghost Anchors' onto the Heli-tracks."
4. The "Technical Debt" Checklist

Tell the agent to look out for these specific behaviors we refined:

    The "Black Circle" Bug: Ensure fill: none on all SVG track circles.

    The Whisper Needle: Every sun marker needs a sun-whisper-line to provide directional orientation.

    Angular Consistency: Ensure the describeArc function handles the 360° wrap-around (the 359∘ to 1∘ transition).



    # Health Oracle Protocol (HOP): Heli-Clock Technical Specification

## 1. Core Logic: The Orbital Vector
All time-series data must be converted from Unix Timestamps to an **Orbital Vector**:
- **Formula:** `Vector = (Solar_Degree, Earth_Degree, Cycle_Count)`
- **Solar_Degree (θ_solar):** 0° to 360° representing the 24-hour day. 0° = Solar Midnight, 180° = Solar Noon.
- **Earth_Degree (θ_earth):** 0° to 360° representing the 365.24-day year.
- **Cycle_Count:** Number of full Earth orbits since the Birth Signature (Epoch).

## 2. Geometry Constraints (SVG Layer)
- **Inner Track (Solar):** Radius `r=36`. Represents daily fluctuations (HRV, Heart Rate, Light).
- **Outer Track (Earth):** Radius `r=46`. Represents macro trends (Weight, BTC Price, Seasons).
- **The Life-Strap Bridge:** Every data point MUST render a `<line>` (the "Tether") connecting its θ_earth coordinate to its θ_solar coordinate.
- **Visual Styles:** - Tracks must have `fill: none`.
  - Use `sun-whisper-line` for directional orientation on every marker.

## 3. Data Normalization (The Playground)
The agent must normalize all incoming "Playground" data (BTC, HRV, Air Quality) to a **0.0 - 1.0 range (Z-score)** before plotting. 
- **High Value:** Moves the marker further from the center (Radial Offset).
- **Low Value:** Pulls the marker toward the center.

## 4. HOP Ledger Logic
- A Ledger Entry = `Hash(Proof_of_Work + Result)`.
- The "Timestamp" for the Ledger is always the **Heli-Stamp** (Angular Position).
- **Coherence Check:** The AI should prioritize "Angular Significance" (clustering of data at specific degrees) over frequency.

## 5. Implementation Rules
- Use the `HeliCore` WASM engine for all degree calculations.
- Avoid standard Chart.js or D3 linear axes.
- If two markers overlap within 2.5°, apply the `.colliding` CSS class for visual resonance.