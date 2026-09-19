---
title: The agent crew
summary: "How Kivora gets built: a crew of AI coding agents, a quality gate none of them can skip, and a person who merges."
kind: ai-workflow
featured: 2
role: Captain. I brief, review and merge [[confirm who the captain is]]
period: October 2026 to now
stack: [firstmate, Claude Code, Claude Haiku / Sonnet / Opus, no-mistakes, git hooks, local quality gates]
status: In daily use
credit: firstmate and no-mistakes are open-source tools by Kun Chen [[confirm credit wording]]
sensitive: true
---

## Why

One person can't design, build, test and ship four repositories at once. A crew of agents can, as long as nothing reaches the main branch without passing the checks a careful engineer would run.

## How a change flows

1. A decision or a backlog item becomes a written brief: which files the agent owns, which spec section it implements, which checks it must pass.
2. The orchestrator picks a model for the job. Small known edits go to Haiku, pattern-following work to Sonnet, and architecture, specs and unknown bugs to Opus.
3. The agent works in its own isolated copy of the repo and opens a draft pull request.
4. The local gate has to end in `PASSED`, and the result is pasted into the pull request. User-facing work also goes through an automated review pipeline, and UI work through a brand and responsiveness check.
5. Only a person merges. Production steps (migrations, secrets, deploys) are run by hand.

## Numbers

Between 19 October and 25 November 2026 the crew ran **784 tasks**. **1,142 events** needed a human decision and **2,339** were handled routinely [[confirm OK to publish]].

## Rules learned the hard way

- **Capacity is a setting, not a hope.** Six full test runs in parallel overloaded the laptop, so each repo has a cap on parallel agents and the reason is written next to it.
- **Route by evidence.** Haiku agents kept stopping before finishing the pipeline, so pipeline work now starts on Sonnet.
- **No code without an approved spec.** Agents may not invent UI copy, fallbacks, pricing or layout rules.
- **Bugs start with a failing test,** then the root cause, then the smallest diff.

## This site was built the same way

The brief behind this portfolio came from a five-round grilling session (38 decisions). An agent then pulled facts from every repo, so every claim on these pages traces back to a file, and anything it couldn't verify was flagged instead of guessed.
