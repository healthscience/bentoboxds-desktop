# Peer case: daily average heart rate + intervention (creatine)

## Use case 1: daily average heart rate (baseline)

The full story.

To perform an average daily heart rate requires data.

So data has to imported into HOP  direct from an app or importing data from a wearable device as a sqlite file or csv file or json file.   

Next all parts of the data need to be described.  data types to data packaging to computation to visualization style.  These are done through the library,  reference contracts and the network experiment is a combination of module contracts containing refer ence contracts.  The tools for those are at  @/src/components/library/contracts/viewer/referenceModule.vue   file  and there are lots and lots of forms, see library folder.

A genesis contract is the formed, one peer contributes this and then all peers including the peer contributing the genesis contract makes their own private instance of the network experiment and connect their data.  A peer can then add the network experiment to a space and that will be a bentobox ceullar container.

In the test setup the  network experiment is added to movement cue space.  This is wearable data, actiivity in step and heart rate in beats per minute.

Now we can add network experiments  (nxp) to many spaces.  For example I have a swimming cue space.   But here the bentobox tools would show the wearable data for swimming only.

Now we have decision to make.  We could create a new network experiment call   average heart rate.  Or just  use the movement network experiment and change the computation.

One network experiment can have many computation attached to it.  So in besearch is selecting  or adding another computation is a key selection being made.


## setup all network experiment contracts and add to spaces

  Use of library tools and connection to device data.  Forming HOPquery to fill a bentobox


  ## average computation used in many cycles?


- Peer goal: understand daily average heart rate trends and stability over time.
- Primary signal: daily average heart rate.
- Context (cue space / environment): Movement / Recovery cue spaces.
- Devices / data sources: wearable heart rate device.
- Expected outcome: stable baseline and detection of meaningful deviations.
- Network experiments across cue spaces:
  - Reuse the same Heart Rate NXP in multiple cue spaces (e.g., Movement, Recovery, Swimming) to compare context-specific baselines.
  - Each cue space acts as a category for the same NXP, enabling filtered views and contextual interpretation.
  - The NXP becomes a shared contract; cue spaces define the lens (category) used to interpret the data.

