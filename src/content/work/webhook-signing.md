---
title: Webhook signing
summary: HMAC signing, idempotency and retry backoff you can poke at in the browser.
kind: systems
featured: 4
role: Solo. Design and code
period: "2026"
stack: [HTML, CSS, JavaScript, Web Crypto API]
status: "Study: sample events, no server"
live: https://ninoredoble.github.io/webhook-signing-simulator/
repo: https://github.com/ninoredoble/webhook-signing-simulator
---

## What it shows

Two things a webhook sender has to get right: signing every request so the receiver can trust it, and retrying failures without stampeding the receiver.

1. **Sign** a payload with HMAC-SHA256 over `timestamp.body`, and watch which signature characters change as you type.
2. **Verify** as the receiver: read the header, reject stale timestamps, recompute and compare.
3. **Retry** with exponential backoff, comparing four strategies: none, full, equal and decorrelated jitter.
4. **See the pile-up**: a histogram of 200 subscribers retrying at once under each strategy.

## Details

- Real HMAC through the browser's Web Crypto API, with a button that checks it against the RFC 4231 test vector.
- A seeded random number generator, so the same seed replays the same run.
- A constant-time comparison, with the honest caveat that JavaScript can't promise timing.
- Respects reduced-motion settings.

## Limits, stated on the page

The signature header name is made up for the study, the events and secret are fake, and there's no server, queue or database behind it. Don't paste a real secret into it.
