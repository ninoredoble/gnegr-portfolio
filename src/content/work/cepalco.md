---
title: CEPALCO
summary: A complaint ticketing system an electric utility ran in production, and a fuel analytics tool for its staff.
kind: production
featured: 3
role: UI/UX and system development intern
period: February to May 2026
stack: [FastAPI, PostgreSQL, SQLAlchemy, Tailwind CSS, Nginx, React, pandas, Docker]
status: "Ticketing: deployed in production in 2026. FuelTrack: deployed to the utility's server in May 2026."
credit: Ticketing was a team project at the utility.
org:
  name: CEPALCO
  logo: ../../assets/brands/cepalco-logo.png
cover:
  src: ../../assets/work/cepalco/portal-home.jpg
  alt: "The CEPALCO help center home: How can we help?, with search and buttons for service availability, creating a ticket and tracking one."
shots:
  - src: ../../assets/work/cepalco/submit-ticket.jpg
    alt: "The support ticket request form: reason, ticket type, subcategory, account number, account name and barangay."
    caption: "Submitting a ticket: each choice narrows the next, so the ticket arrives already sorted."
  - src: ../../assets/work/cepalco/track-ticket.jpg
    alt: "The track-your-ticket page: search by ticket number or by email."
    caption: "Customers track a ticket by its number or their email, with no account needed."
sensitive: true
thumb: ../../assets/work/cepalco/portal-home.jpg
---

## Ticketing

Customers of Cagayan de Oro's electric utility report outages, billing and metering problems through a public portal with a library of help articles, and track their ticket by number. Staff work the tickets in a dashboard: routing to the right team, priorities with response deadlines, work orders, notes, notifications and an audit log.

### Routing without a model

Each new ticket is classified by a rule-based scorer, not a language model. It weighs keywords for each team and priority and uses fuzzy matching so spelling variants still match, including Cebuano spellings like *kuryente* and *koryente*. It returns a confidence and the words that matched, so every decision can be explained, and staff can override it.

### Fixes that mattered

- Power-outage tickets were going to the wrong team.
- Urgent alert emails were never sent: an `await` on a function that wasn't async.
- Email failed silently when its sign-in token expired and the office network blocked the fallback.
- Over 150 broken links made pages render three times through the web server's fallback.
- Login let in users who hadn't been approved yet.

### Speed

Eight database indexes, built without locking the live tables, and a ticket list that filters and pages on the server instead of loading a thousand records into the browser.

## FuelTrack

A dashboard for fuel use. It reads the utility's Excel records, spotting the header row and mapping the columns, then shows volume and spend from the whole company down to a single section. It also exports the official monthly report template.

- Totals and exports are computed on the server with the active filters, so a number never depends on what page of a table you're on.
- Deployment on the corporate network: Docker's default network range collided with the office LAN, so the deploy defines its own range and routes through the company proxy.

## What I'd do differently

Tests were thin: the ticketing system had about one unit test and neither project had CI. That's the gap I've closed since: on Kivora nothing merges without passing a full check. [How I ship →](/work/how-i-ship/)
