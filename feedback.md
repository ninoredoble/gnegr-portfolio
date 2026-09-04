**Role:** Act as a Principal Product Designer and Senior Creative Developer. You have been hired to elevate my portfolio website to an "Award-Winning" standard.

**Context:**
My website currently has a 3D Hero section (Three.js), a structured WebM media section, and standard sections for Projects and About. It works, but it feels "flat." It lacks the micro-interactions, scroll physics, and UI "jewelry" that separate a good developer from a great one.

**My Brand Guidelines (CRITICAL):**

- **Brand Name:** GNEGR (Personal brand of G. Niño Emmanuel G. Redoble).
- **Tagline:** "Built to move."
- **Colors:**
  - Light Mode Background: `#FAF9F6` (Paper)
  - Dark Mode Background: `#0A0A0A` (Void)
  - Text: `#1C1C1F` (Ink) / `#FAF9F6` (White)
  - Accent: `#E24E1B` (Ember Orange)
  - Secondary: `#2B4C82` (Indigo Blue)
- **Typography:**
  - Display/Headings: 'Sora' (Bold/SemiBold)
  - Body: 'Inter' (Regular/Medium)
  - Mono/Labels: 'JetBrains Mono'
- **Personality:** Precise, technical, grounded, quietly confident. Think "Swiss engineering meets modern web."

**Reference Vibe:**
I want the user to feel like they are interacting with a precision instrument. Like driving a high-end German car or using a high-end Apple product. Smooth, weighted, and satisfying.

---

## SCOPE OF WORK (Global Enhancements)

You will modify the **CSS and JavaScript** across the entire site, but you will **NOT change the core HTML structure** of the About/Projects sections (you can add IDs/classes to elements if needed, but do not delete the existing content).

---

## PHASE 1: SCROLL ENGINEERING (The "Weight")

1. **Smooth Scrolling:** Ensure `html` has `scroll-behavior: smooth`.
2. **Reveal on Scroll:**
   - Add an Intersection Observer to elements with the class `.reveal`.
   - When an element enters the viewport, it should transition from `opacity: 0; transform: translateY(30px);` to `opacity: 1; transform: translateY(0);`.
   - The transition should be `0.8s cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
   - Stagger the children of `.project-grid` so cards fade in one after another (delay increment of 0.1s).
3. **Parallax on Hero:**
   - As the user scrolls down from the hero, the 3D canvas and the hero text should move up at a slightly slower speed (rate: 0.3). This creates a depth effect.
4. **Active Nav State:**
   - Highlight the navigation link that corresponds to the section currently in view. Use a subtle underline or color change to `#E24E1B`.

---

## PHASE 2: MICRO-INTERACTIONS (The "Jewelry")

1. **Custom Cursor:**
   - Create a custom cursor (a small 8px dot that tracks the mouse instantly).
   - Add a larger, lagging ring (30px) that smoothly lerps behind the dot.
   - When hovering over links, buttons, or project cards, the ring should scale up to 60px and change its border color to `#E24E1B`.
   - Use `mix-blend-mode: difference` so it works on both light and dark backgrounds.
   - Disable the default cursor on desktop only (`@media (hover: hover) and (pointer: fine)`).
2. **Magnetic Buttons:**
   - Add a subtle magnetic effect to the primary CTA buttons. The button moves slightly (max 5px) toward the cursor when the mouse is near it. It resets smoothly when the mouse leaves.
3. **Link Hover Effect:**
   - For text links in the body, add an animated underline. The background should slide in from the left (`transform: scaleX(0)` to `scaleX(1)`) with color `#E24E1B`.
4. **Project Card Hover:**
   - On hover, project cards should:
     - Translate up by `-8px`.
     - Add a soft shadow `0 20px 40px rgba(0,0,0,0.1)`.
     - The card border should change to `#E24E1B`.
     - Any images inside should scale from `1.0` to `1.05` (with `overflow: hidden` on the container).

---

## PHASE 3: LOADING & PERFORMANCE

1. **Intro Loader:**
   - Create a brief loading overlay.
   - It should show "GNEGR" in Sora Bold text with a small "Loading..." in JetBrains Mono.
   - Add a progress bar underneath that fills from 0% to 100%.
   - Once the page is fully loaded (and the Three.js car is ready), the overlay should split in two (top half slides up, bottom half slides down) revealing the site.
   - This should only happen once per session.
2. **Performance:**
   - Add `prefers-reduced-motion` media query. If user prefers reduced motion, disable custom cursor, parallax, and reveal animations.
   - Lazy load all images below the fold using `loading="lazy"`.

---

## PHASE 4: BRAND COHESION (The "Glue")

1. **Noise/Grain Overlay:**
   - Add a subtle, fixed, full-screen noise/grain overlay using a data-URI SVG or CSS gradient.
   - It should have `opacity: 0.03` and `pointer-events: none; z-index: 9999;`.
   - This removes the "cheap web" look and gives it a premium, textured feel.
2. **Selection Color:**
   - Change the default text selection color to `#E24E1B` with a light background.
3. **Scrollbar Styling:**
   - Style the scrollbar to match the theme. Track should be transparent, thumb should be `#DEDED9` (light mode) or `#2A2A2E` (dark mode).

---

## VERIFICATION CHECKLIST

1. The custom cursor works and does not break on mobile.
2. Project cards fade in smoothly as I scroll to them.
3. The hero section parallaxes slightly on scroll.
4. The loading screen appears briefly and then splits away.
5. Buttons have a magnetic effect.
6. Text links have an animated underline.
7. The scrollbar and text selection match the brand.
8. The site passes mobile responsiveness tests (no horizontal scrollbars).
9. No console errors or broken assets.

## DEPLOYMENT

Commit with message: `feat: elevate to award-winning portfolio standard with micro-interactions and scroll engineering` and push to `main`.
