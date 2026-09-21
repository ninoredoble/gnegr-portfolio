---
title: Kivora
summary: Restaurants publish their menu once; guests tap the table and see it on their phone. I designed it, built it and tested it. It's live on the App Store.
kind: product
featured: 1
role: Co-founder · UI/UX design, development and QA
period: 2026 to now
stack: [Flutter, Riverpod, Supabase, PostgreSQL, Edge Functions, Flutter web, Cloudflare Pages]
status: Live on the App Store (iOS)
links:
  - label: App Store
    href: https://apps.apple.com/ph/app/kivora-digital-touchpoint/id6831002615
    primary: true
  - label: Try the demo café
    href: https://menu.mixcortex.com/kivora-demo-cafe
org:
  name: MixCortex
  href: https://mixcortex.com/
  logo: ../../assets/brands/mixcortex-logo.svg
cover:
  src: ../../assets/work/kivora/cover.jpg
  alt: "Kivora. Live at every table: café dishes and coffee around the Kivora logo."
screens:
  - src: ../../assets/work/kivora/01-guest.jpg
    alt: "The guest page a diner sees after tapping the table: menu search and dishes with prices."
  - src: ../../assets/work/kivora/02-edit.jpg
    alt: "Editing a dish in the staff app: name, price and photo."
  - src: ../../assets/work/kivora/03-today.jpg
    alt: "The staff app's today view."
  - src: ../../assets/work/kivora/05-website.jpg
    alt: "Arranging the restaurant's guest website from the app."
preview:
  src: ../../assets/work/kivora/landing.jpg
  alt: "The Kivora product page: Your menu, live at every table."
  url: mixcortex.com/kivora
sensitive: true
---

## What it does

Restaurant staff run their menu from a phone app. They edit dishes and prices, mark something sold out, open or close the store, theme their guest page and press Publish.

Guests tap the tag on their table and the menu opens on their phone. There's no app to install and no login. Kivora doesn't take orders or payments yet; keeping that out of the first version was on purpose.

## Decisions I'd defend

**The preview is the real page.** The same code draws the guest page and the preview in the editor, so what the owner sees while editing is exactly what guests get.

**Some changes are instant, the rest wait for Publish.** Sold out and open or closed go live at once, because a guest asking for a dish that's gone is worse than an old photo. Everything else waits for Publish.

**Any brand colour stays readable.** Owners can pick any colour they like. The app adjusts the colours around it so text still meets WCAG AA contrast, and says so with a small "Adjusted for readability" note.

**Each restaurant only sees its own data.** One table decides what each staff role can do, and the database enforces the same rules, so a bug in the app still can't show one restaurant another's menu.

## The menu assistant

Owners can hand Kivora a photo of a paper menu, a spreadsheet or plain text, and it drafts the menu for them. It only ever suggests; the owner reviews it and applies it like any other edit. It runs on the server, and every suggestion is checked before it can be applied.

## Quality

- Decisions and specs written down before the code they cover.
- Hundreds of automated tests, and a check that has to pass before any change is merged.
- 48 px touch targets, text that scales to 200%, and colour never used on its own to carry meaning.

[How I ship →](/work/how-i-ship/)
