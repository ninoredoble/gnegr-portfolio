**Role:** Act as a senior creative developer, lighting artist, and DevOps engineer. I need you to fix the visual aesthetics and the file architecture of my existing portfolio repository.

**Context:**
The current implementation works technically, but it looks flat, cheap, and unprofessional. It does not look like the "Bruno Simon" reference. Additionally, the file naming is inconsistent (some uppercase, some lowercase), which is causing broken links and 404 errors in the browser.

**Your Task:**

---

## PART 1: File Hygiene & Naming Conventions (Crucial)

Please review the entire repository and enforce a strict naming convention.

1. **All file names must be lowercase.**
2. **Use hyphens instead of spaces or underscores.**
   - Example: Rename `Hero 3D.js` or `Hero_3D.js` to `hero-3d.js`.
   - Example: Rename `GNEGR.glb` to `gnegr.glb`.
   - Example: Rename `GNEGR_logo_reveal.webm` to `gnegr-logo-reveal.webm`.
3. **Folders must also be lowercase.**
   - Example: `Assets/` should be `assets/`.
   - Example: `JS/` should be `js/`.
4. **Update all import paths and file references.**
   - In `index.html`, update the `<script src="...">` and `<link href="...">` tags.
   - In JavaScript files, update the paths for `GLTFLoader` and video sources.
5. **Verify the build.**
   - Ensure there are zero broken paths. The 3D model should load, the WebM video should play, and the CSS should render.

---

## PART 2: Art Direction Fix for the 3D Hero (The "Bruno Simon" Vibe)

The current 3D scene looks like a black blob floating over harsh graph paper. Apply the following changes immediately.

**1. The Lighting (This is the most important fix)**

- **Remove or heavily reduce AmbientLight.** Set the intensity to `0.1` or delete it. The scene should be dark and dramatic.
- **Add a Key Light (DirectionalLight).**
  - Color: `#ffffff`
  - Intensity: `2.5`
  - Position: `(5, 10, 5)`
  - This gives the car shape and definition.
- **Add a Rim Light (PointLight).**
  - Color: `#ff3366` (Neon Pink)
  - Intensity: `30`
  - Position: `(0, 3, -5)`
  - **Why:** This light sits _behind_ the car and outlines its silhouette. This is the secret to making the dark car pop against the dark background.
- **Add an Accent Light (PointLight).**
  - Color: `#00e5ff` (Cyan)
  - Intensity: `20`
  - Position: `(-5, 1, 2)`

**2. The Material (Make it look expensive)**

- Locate the `MeshStandardMaterial` applied to the car.
- Change `metalness` to `1.0`.
- Change `roughness` to `0.05`.
- Change `color` to `#111111`.
- This will make the car look like a polished obsidian mirror that reflects the neon lights.

**3. The Grid (Make it subtle and atmospheric)**

- The current `GridHelper` is too harsh and bright.
- **Option A (Preferred):** Keep the GridHelper, but darken the colors. Change `0xff3366` and `0x00e5ff` to darker, desaturated versions like `0x331a22` and `0x1a3333`.
- **Option B:** Create a custom `PlaneGeometry` with a repeating grid texture. (Only do this if Option A still looks bad).
- **Add Fog:** Increase the fog density. The grid should disappear into the void within 20 units.
  - `scene.fog = new THREE.Fog(0x0b0b0f, 5, 25);`
- **Ground Shadow:** Add a dark, radial gradient texture directly under the car (a simple circular mesh with a `MeshBasicMaterial` using a generated canvas texture). This grounds the car so it doesn't look like it's just floating in space.

**4. The Camera (Change the angle)**

- Move the camera higher and further back.
  - Current: `(0, 2, 10)`
  - New: `(0, 5, 12)`
- Point the camera down at the car:
  - `camera.lookAt(0, 0, 0)`
- Change the Field of View (FOV) to `50` or `60`. This gives a wide, architectural perspective like Bruno Simon's site.

**5. The Animation (Smooth and expensive)**

- Keep the sine wave bobbing.
- Slow down the mouse orbit. The camera should feel heavy and smooth.
- Maximum orbit angle: `8 degrees` (not 10, to keep it subtle).

---

## PART 3: Art Direction Fix for the WebM Section

The current video section looks like a cheap GIF. Make it cinematic.

1. **Darken the overlay.**
   - Change the overlay background from `rgba(8, 8, 12, 0.7)` to `rgba(8, 8, 12, 0.85)`.
2. **Apply a blend mode to the video.**
   - Add `mix-blend-mode: screen;` or `mix-blend-mode: overlay;` to the `.video-bg video` CSS rule.
   - This makes the bright parts of the WebM glow against the dark background, instead of looking like a washed-out rectangle.
3. **Add section borders.**
   - Add `border-top: 1px solid rgba(255, 255, 255, 0.1);` and `border-bottom: 1px solid rgba(255, 255, 255, 0.1);` to the `.media-section`.
   - This visually separates it from the rest of the page.
4. **Add a subtle zoom animation to the video.**
   - Use CSS `@keyframes` to slowly scale the video from `1.0` to `1.1` over 20 seconds, alternating. This gives the background a slow, breathing motion.

---

## PART 4: Verify and Deploy

1. **Check for Console Errors:** Ensure there are no 404 errors for `car.glb` (or `gnegr.glb`) or the WebM file.
2. **Check Mobile:** On screens smaller than 768px, ensure the video hides and the 3D canvas auto-rotates.
3. **Push to GitHub:** Once everything is fixed, commit the changes with a clear message (e.g., `fix: art direction pass and file naming conventions`) and push to the `main` branch of `gnegr-portfolio`.

---
