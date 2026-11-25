---
title: How I ship
summary: Specs before code, tests before fixes, and a quality check nothing gets past. It's how I work as designer, developer and QA at once.
kind: process
featured: 2
role: Design, development and QA
period: Every project
stack: [Written specs, Automated tests, Git hooks, Code review, Claude Code]
status: How Kivora and this site are built
credit: The review pipeline and task tooling I use are open-source projects by Kun Chen (firstmate, no-mistakes).
sensitive: true
thumb: ../../assets/work/how-i-ship/thumb.jpg
---

## Why it matters to me

When one person designs, builds and tests a product, nobody else catches the mistakes. So I don't rely on remembering to be careful. The process makes careful the default.

## The steps

1. **Write it down first.** A short spec says what the change does and what it doesn't. If there's no agreed spec, there's no code.
2. **Bugs start with a failing test.** Then the root cause, then the smallest fix that makes the test pass.
3. **A check nothing gets past.** Before anything can merge it must pass formatting, a strict analyzer, the full test suite, and checks that the structure and API contracts haven't drifted.
4. **Review.** Every user-facing change goes through a review pass, and screens get checked against the brand and at phone, tablet and desktop widths.
5. **I merge, and I deploy by hand.** Database changes, secrets and releases are never automatic.

## Where AI fits

I use AI coding tools for a lot of the typing: drafting code, writing tests, running reviews. They work inside the same rules as everything else: a written brief, the same checks, and nothing merged until I've read it. The tools change every few months. The checks are what make the work trustworthy.

## This site went through the same steps

It started with a written brief of 38 decisions. Every claim on these pages was checked against the source code or documents behind it, and anything I couldn't verify was left out rather than guessed.
