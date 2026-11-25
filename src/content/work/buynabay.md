---
title: BuyNaBay
summary: A campus marketplace where USTP students buy, sell and rent pre-loved items.
excerpt: A mobile app, an admin dashboard and an on-campus kiosk. I led the five-person team, designed the app and built the dashboard.
kind: product
page: true
role: Team lead · Figma design and admin dashboard
period: 2024 to 2026
stack: [React Native, Expo, Supabase, Firebase Auth, Next.js, Figma]
status: "Capstone project: tested with 60 students and faculty"
credit: Built by a five-person capstone team at the University of Science and Technology of Southern Philippines.
cover:
  src: ../../assets/work/buynabay/guide-06.jpg
  alt: "The BuyNaBay mascot, a smiling orange shopping bag, with the logo on dark and light backgrounds."
shots:
  - src: ../../assets/work/buynabay/userflow.jpg
    alt: "The BuyNaBay user flow: splash, welcome, sign in, sign up and recovery screens, then home, cart, messages, profile and listing screens, connected by arrows."
    caption: The user flow I designed in Figma, from the splash screen to listing an item and editing a profile.
    frame: false
    wide: true
  - src: ../../assets/work/buynabay/showcase.jpg
    alt: "The BuyNaBay mobile app screens, the admin dashboard on a laptop, and the on-campus kiosk."
    caption: "The three parts: the mobile app, the admin dashboard I built, and the kiosk for students without mobile data."
    frame: false
    wide: true
  - src: ../../assets/work/buynabay/guide-04.jpg
    alt: "Logo construction: the shopping bag, its swirls and its smile, each labelled with what it stands for."
    caption: From the brand and design system guide, how the logo is built.
    frame: false
  - src: ../../assets/work/buynabay/guide-16.jpg
    alt: "The brand's main colours: midnight navy, marigold and a deep orange."
    caption: The colour system, with dark and light themes for the app.
    frame: false
sensitive: true
---

## The problem

Students at USTP were buying and selling through social media groups. Listings got buried, nobody's identity was checked, and there was no simple way to rent things you only need for a term, like calculators or formal attire.

## What we built

- **A mobile app** (React Native and Supabase) where every user is verified as a member of the university. Students can list items, buy through a cart or by negotiating directly, and rent academic essentials.
- **An admin dashboard** for moderators: verifications, reports and appeals, suspensions and bans with a reason, and sales charts and exports.
- **An on-campus kiosk** so students without mobile data can still browse and post.

## My part

I led the five-person team through planning, deadlines and handoffs. I designed the app in Figma, from the first screen to the last, and built the admin dashboard.

## How we tested it

- **Functional testing:** 14 of 14 critical test cases passed.
- **Concurrency:** simultaneous checkouts of the same item were run in parallel. Transactions held, and nothing was booked twice.
- **Usability:** 60 students and faculty from different colleges took the System Usability Scale. The score was **87.45**, which the scale rates as excellent.
- **Software quality:** an evaluation against ISO/IEC 25010 gave a grand mean of **4.6 out of 5**, strongest on functional suitability and security.

## What's next, from the study

In-app payments, an iOS version, and better recommendations.
