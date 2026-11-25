---
title: Grid mesh
summary: Trip a breaker on a small illustrative grid and watch the power reroute.
kind: study
featured: 5
role: Solo. Design and code
period: "2026"
stack: [HTML, CSS, JavaScript, SVG, DC load flow]
status: "Study: real place names, invented figures"
live: https://ninoredoble.github.io/mindanao-grid-mesh/
repo: https://github.com/ninoredoble/mindanao-grid-mesh
thumb: ../../assets/work/grid-mesh/thumb.jpg
---

## What it is

A control-room mimic board for a seven-bus ring. Open or close breakers and a small power-flow model reroutes the load, flags overloads and unserved load, and logs every event. With protection on, it plays cascades out step by step.

Plant and town names are real. Loads, line ratings, reactances and the layout are invented, and none of it is NGCP data.

## The model

The model is a pure function with no access to the page, so it runs the same in the browser and under Node.

1. Find islands: flood-fill over closed breakers. An island with no plant goes dark.
2. Share the load: plants on an island share it in proportion to capacity, and any shortfall is shed in proportion too.
3. Solve the flows: a DC load flow (lossless lines, fixed reactance, one reference bus per island) solved by Gaussian elimination, then each line is checked against its rating.
4. Cascade: with protection on, the most overloaded line trips after a delay and the model solves again.

A contingency column shows what each single outage would add to the current state, as a quick N-1 check.

## Left out on purpose

Voltage, reactive power, frequency, transients, relay timing and synchronism checks. Transformers are drawn but not modelled.
