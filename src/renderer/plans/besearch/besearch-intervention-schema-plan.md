# Besearch intervention data structure plan

## Goals
- Align the create form data with intervention sample fields and prepare for HOP-backed data.
- Define a single data shape that can populate the intervention toolbar and drive form dropdowns.
- Prepare computed lists from besearch store data for network experiments and markers.

## Stage 1: form fields to capture
Minimum fields to add or keep for stage 1:
- name (existing)
- description (new)
- category (enum: prevention, repair, rejuvenation, experimental, custom)
- networkExperiment (from store, required)
- marker (from store, required)
- frequency (existing)
- status (enum: pending, working, experimentation, no effect)

Deferred for stage 2 (set to defaults in saved payload):
- consilience (default empty array)
- besearchCycles (default empty array; used for cycle counts)
- linked cycles summary (derived)

## Proposed HOP-returned data structure
HOP reply payload shape to support toolbar grouping and form dropdowns:

```
{
  data: {
    besearchCycles: [
      {
        id,
        name,
        besearchid,
        networkExperimentId,
        frequency,
        createdAt,
        linkedInterventions: [interventionId]
      }
    ],
    interventions: [
      {
        id,
        name,
        description,
        category,  // prevention | repair | rejuvenation | experimental | custom
        domain,    // human | built | nature
        status,    // pending | working | experimentation | no effect
        networkExperimentId,
        markerIds: [markerId],
        consilience: [cueId],
        besearchCycles: [cycleId],
        createdAt,
        updatedAt
      }
    ],
    markers: [
      {
        id,
        name,
        cueId,
        datatype
      }
    ],
    networkExperiments: [
      {
        id,
        name,
        cueId,
        status
      }
    ],
    canvasState: { ...existing }
  }
}
```

Notes:
- Store HOP payload under besearchStore state to avoid duplicating data in components.
- If HOP does not return markers or networkExperiments yet, derive them via store-level computed mapping from existing library data or leave as empty arrays.

## Store computed outputs
Computed properties to build lists for the form:
- activeNetworkExperiments: [{ id, name, cueId, status }]
- availableMarkers: [{ id, name, cueId, datatype }]
- interventionsByCategory: { prevention: [], repair: [], rejuvenation: [], experimental: [], custom: [] }

Derived fields for UI:
- cycleCount per intervention = besearchCycles.length
- status label + color class based on enum

## Form payload mapping
When saving from form:
- Convert form fields into intervention payload with default arrays for consilience and besearchCycles.
- Add createdAt timestamp.
- Store via besearchStore action, then send to HOP.

## Next steps for implementation mode
- Update besearchCreateForm to include description + category + status.
- Bind dropdown options to computed lists from besearchStore.
- Update besearchStore.processReply to hydrate interventions, markers, networkExperiments.
- Update interventionToolbar to read interventions from store rather than local sample data.

