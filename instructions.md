**Role:** Act as a senior creative developer and UI/UX engineer. You are building a complete, production-ready portfolio website section for me.

**Context:**
My website is currently a static portfolio with a dark theme (background color: #0b0b0f). I have two assets uploaded to this project:

1. `3D GNEGR.glb` - A 3D model that currently renders as solid white. I need it to look like a polished, dark metallic sculpture.
2. `GNEGR_logo_reveal.webm` - A looping video that I want to use as a cinematic background in a section below the hero.

**Goal:**
Create a single HTML file (or a modular set of files: index.html, style.css, script.js) that includes:

1. A full-screen Hero Section with an interactive 3D Three.js canvas.
2. A secondary section that uses the WebM video as a parallax background with a dark overlay.

---

## SECTION 1: The 3D Hero (Bruno Simon Style)

**Renderer Setup:**

- Use Three.js loaded via ES Modules (import \* as THREE from 'three'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';).
- Renderer: alpha: true, antialias: true.
- Pixel ratio: Math.min(window.devicePixelRatio, 2) for performance.
- Background must be fully transparent so my site's CSS background (#0b0b0f) shows through.

**The 3D Model:**

- Load `3D GNEGR.glb` using GLTFLoader.
- Once loaded, traverse the entire object.
- For every mesh, remove the existing texture map (material.map = null).
- Override with new THREE.MeshStandardMaterial.
- Set color: #1a1a24 (slightly lighter than site background).
- Set metalness: 0.8, roughness: 0.2.
- Scale the model to 0.5.
- Rotate the model so it faces the camera (adjust Y rotation as needed).

**The Neon Grid:**

- Create a THREE.GridHelper (size: 30, divisions: 30).
- Grid colors: #ff3366 (Neon Pink) and #00e5ff (Cyan).
- Position the grid at y = -1 so the car floats above it.

**Lighting:**

- Add THREE.AmbientLight with intensity 0.5.
- Add THREE.PointLight (Color: #ff3366, Intensity: 20, Position: (5, 5, 5)).
- Add THREE.PointLight (Color: #00e5ff, Intensity: 20, Position: (-5, 2, -5)).

**Animation & Interaction:**

- The car should hover gently. Add a sine wave to its Y position: Math.sin(Date.now() _ 0.002) _ 0.2.
- Track the user's mouse across the window.
- Smoothly orbit the camera around the car based on mouse X/Y using lerp (linear interpolation).
- Camera starting position: (0, 2, 10). Looking at (0, 0, 0).
- Maximum orbit angle: 10 degrees left/right.

**Theme Switching (Dark/Light Mode):**

- Create a function called `updateTheme(mode)`.
- If mode is 'dark': Grid colors = #ff3366 (Pink) and #00e5ff (Cyan). Fog color = #0b0b0f. Ambient light intensity = 0.5.
- If mode is 'light': Grid colors = #0055ff (Blue) and #4400ff (Purple). Fog color = #e0e0e0. Ambient light intensity = 1.0.
- By default, detect user preference using window.matchMedia('(prefers-color-scheme: dark)').matches. If true, run updateTheme('dark'), else run updateTheme('light').
- Expose the function globally: window.updateTheme = updateTheme; so I can call it from my existing website's theme toggle button.

**Responsiveness:**

- If screen width is less than 768px, move camera back (z: 12) and disable mouse orbit (let it auto-rotate slowly).
- On window resize, update camera aspect ratio and renderer size.

---

## SECTION 2: The WebM Background Section (Parallax)

**HTML Structure:**
Create a `<section>` element with class `media-section`.
Inside it, add:

1. A `<div>` with class `video-bg` containing the `<video>` tag.
   - Video attributes: autoplay, muted, loop, playsinline.
   - Source: `GNEGR_logo_reveal.webm`, type: `video/webm`.
   - Style: width: 100%; height: 100%; object-fit: cover; opacity: 0.5.
2. A `<div>` with class `video-overlay` for the dark overlay.
   - Style: position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(8, 8, 12, 0.7); z-index: 1.
3. A `<div>` with class `container` for the content that sits on top.
   - Style: position: relative; z-index: 2; color: #ffffff; padding: 100px 20px; text-align: center.

**Parallax Effect:**

- Add a JavaScript scroll event listener.
- For every `.media-section` on the page, calculate its position relative to the center of the viewport.
- Move the `.video-bg` div up or down slightly using `transform: translateY(offset px)` where offset = (rect.top + rect.height / 2 - window.innerHeight / 2) \* 0.1.
- Use `requestAnimationFrame` to throttle the scroll event for performance.

**Mobile Fallback:**

- In CSS, add a media query for max-width: 768px.
- On mobile, hide the `<video>` tag (display: none) and replace it with a solid background color or a background image.

---

## SECTION 3: Premium UI Polish

**Custom Cursor:**

- Add a small dot (10px) that follows the mouse instantly.
- Add a larger circle (30px) that lags behind using lerp.
- Both should use `mix-blend-mode: difference` and `pointer-events: none`.
- Hide the default cursor (`cursor: none` on body).

**Smooth Scrolling:**

- Add `scroll-behavior: smooth` to the html element.

**Typography:**

- Import Google Fonts: 'Space Grotesk' (for headings) and 'Inter' (for body text).
- Apply 'Space Grotesk' to h1, h2, h3 tags.
- Apply 'Inter' to body and p tags.

---

## DELIVERABLES

Please provide the complete code as:

1. `index.html` - The full HTML structure.
2. `style.css` - All the CSS including the media queries and custom cursor.
3. `script.js` - All the JavaScript including Three.js scene, parallax, custom cursor, and theme switching.

ART DIRECTION & REFERENCES:
I am trying to emulate the look and feel of award-winning creative developer portfolios (specifically the aesthetic of "Bruno Simon" and the playfulness of "Lynn Fisher").

Design Philosophy:

The "Game" Feel: The site should feel like a polished WebGL game, not a standard webpage. The interactions should have weight, inertia, and smooth easing.

The Composition: Bruno Simon places the 3D object directly in the center of the viewport, often overlapping with the HTML text. Do not confine the 3D model to a small box or card. Let it break the grid. Let it overlap my name/title.

The Color Palette: Deep dark void background (#0b0b0f). Neon accent colors (#ff3366 and #00e5ff). The 3D object should look like dark polished obsidian reflecting these neon lights.

The Lighting: High contrast. Deep shadows. Glowing emissive edges. The lighting should make the car look dramatic and slightly mysterious.

Typography Integration: The 3D canvas must be behind the HTML text (z-index: 1 for canvas, z-index: 2 for text). The text should be extremely bold and modern (Space Grotesk). Use a mix of solid white text and outlined text (text-stroke) to create depth.

Micro-Interactions:

The car should not just sit there. It should bob up and down slowly.

When the user moves the mouse, the camera should orbit subtly (parallax effect).

If the user scrolls down, the 3D scene should either fade out or zoom out slightly.

The "WebM" Section: This should feel like a cinematic "intermission" between sections. The video plays silently in the background, heavily darkened, giving the illusion of depth while the user reads the text.

Make sure the file names are properly labeled and organized, rename them if you think it is not properly labeled and organized.

Only Update the gnegr-portfolio no need to update the private repo.

Make sure the code is clean, well-commented, and ready to be copied directly into my existing
repository. If there are any errors or missing assets, notify me before finishing.
