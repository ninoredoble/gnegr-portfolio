---
title: Kivora
summary: Menu and storefront software for small restaurants. I designed it, built the app and the backend, and I run it.
kind: product
featured: 1
role: Co-founder. Product design, app and backend engineering, operations [[confirm split with co-founder]]
period: October 2026 to now
stack: [Flutter, Riverpod, Supabase, PostgreSQL RLS, Edge Functions, Flutter web, Cloudflare Pages]
status: In pilot [[confirm what can be said]]
live: https://menu.mixcortex.com/?demo=1
credit: Built at MixCortex with my co-founder [[confirm wording]]
sensitive: true
---

## What it does

A restaurant's staff run their menu from a phone app on iOS and Android. They edit dishes, mark something sold out, set the store as open or closed, theme and arrange their guest page, and press Publish.

Guests tap an NFC tag on the table and the menu opens on their phone. They can build a short list of what they want to show their server. Kivora does not take orders or payments in this first version. That was a deliberate scope cut, not a gap.

## Decisions I'd defend

**The preview is the real page.** One renderer draws both the guest page and the editor's preview, so what the owner sees while editing is exactly what guests get.

**Some changes are instant, the rest wait for Publish.** Sold out and open or closed go live at once, because a guest ordering a dish that's gone is worse than a stale photo. Everything else waits for Publish, which keeps a history and can't double-apply.

**Any brand colour, always readable.** Owners can pick any colour they like. The app solves the derived colours so text still meets WCAG AA contrast (4.5:1) and shows a small "Adjusted for readability" note when it had to step in.

**Permissions live in one place.** One permission table decides what each staff role can do, and the database enforces the same rules with row-level security. A bug in the app still can't show one restaurant another's data.

## The AI assistant

Owners can hand Kivora a photo of a paper menu, a spreadsheet or plain text, and an assistant proposes the menu. It only ever proposes; a person reviews and applies it through the same checked writes as any other edit.

- It runs on the server. The app never holds a model key.
- The model can only answer in a closed vocabulary: no IDs, URLs or table names.
- A validator checks every proposal. The validator is the guard, not the prompt, and prompt injection is treated as normal input.

## How it's built

- 17 architecture decision records and 28 specs, written before the code they govern.
- 544 test files in the app. The same data tests run against the real backend, a REST backend and an in-memory fake.
- A local quality gate on every push: analyzer with zero warnings, the full test suite, and checkers for architecture and API contracts.
- 48 px touch targets, text that scales to 200%, colour never used alone, and right-to-left layouts.
- 336 merged pull requests in the app between October and November 2026 [[confirm OK to publish]].

Most of this was built with a crew of AI agents under strict rules. [How that works →](/work/agent-crew/)

## Where it stands

In pilot [[confirm]]. The iOS and Android store releases are [[confirm status]]. If you run a restaurant, the product page is at [mixcortex.com/kivora](https://mixcortex.com/kivora/).
