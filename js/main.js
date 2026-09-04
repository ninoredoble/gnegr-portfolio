/**
 * GNEGR // NIÃ‘O REDOBLE PORTFOLIO - CORE RUNTIME & THREE.JS ENGINE
 * Inspired by: Bruno Simon (interactive 3D canvas) & Lynn Fisher (creative polish)
 *
 * Deliverables & Architecture:
 *  1. Full-screen interactive Three.js Hero Section:
 *     - ES Modules (three & GLTFLoader)
 *     - Transparent renderer showing dark site background (#0b0b0f)
 *     - Dark metallic sculpture material override (#1a1a24, metalness: 0.8, roughness: 0.2)
 *     - Neon GridHelper (pink #ff3366 & cyan #00e5ff) at y = -1
 *     - Ambient & dual point lights (pink/cyan)
 *     - Hover sine-wave bobbing physics
 *     - Camera orbit lerp tracking user mouse (up to 10 deg)
 *     - Responsive mobile handling (<768px z: 12, auto-rotation)
 *     - Theme switching (window.updateTheme(mode))
 *  2. Cinematic WebM Parallax Section:
 *     - RequestAnimationFrame throttled parallax scroll
 *  3. Custom Dual Cursor:
 *     - Instant 10px dot + smooth lerp 30px lagging ring with mix-blend-mode: difference
 *  4. Showcase Projects filter, Philippines live clock, and clipboard copy utilities
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Global Three.js Scene References
let scene, camera, renderer, modelGroup, gridHelper;
let ambientLight, pointLight1, pointLight2;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 2;
let isMobile = window.innerWidth < 768;

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initThreeHero();
  initWebMParallax();
  initThemeEngine();
  initTimeTracker();
  initProjectFilters();
  initSkillsPhysics();
  initCopyButtons();
});

// ==========================================================================
// 1. SECTION 1: THE 3D HERO (BRUNO SIMON STYLE)
// ==========================================================================
function initThreeHero() {
  const container = document.getElementById('hero-3d-wrapper');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // Scene
  scene = new THREE.Scene();

  // Dimensions
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Camera starting position: (0, 2, 10). Looking at (0, 0, 0)
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 2, isMobile ? 12 : 10);
  camera.lookAt(0, 0, 0);

  // Renderer: alpha: true (transparent for #0b0b0f), antialias: true, pixelRatio <= 2
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // Lighting System
  // AmbientLight with intensity 0.5
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // PointLight 1: Color #ff3366, Intensity 20, Position (5, 5, 5)
  pointLight1 = new THREE.PointLight(0xff3366, 20, 50);
  pointLight1.position.set(5, 5, 5);
  scene.add(pointLight1);

  // PointLight 2: Color #00e5ff, Intensity 20, Position (-5, 2, -5)
  pointLight2 = new THREE.PointLight(0x00e5ff, 20, 50);
  pointLight2.position.set(-5, 2, -5);
  scene.add(pointLight2);

  // Neon Grid: THREE.GridHelper (size: 30, divisions: 30)
  // Grid colors: #ff3366 (Neon Pink) and #00e5ff (Cyan)
  // Position the grid at y = -1 so the car floats above it
  gridHelper = new THREE.GridHelper(30, 30, 0xff3366, 0x00e5ff);
  gridHelper.position.y = -1;
  if (gridHelper.material) {
    gridHelper.material.opacity = 0.5;
    gridHelper.material.transparent = true;
  }
  scene.add(gridHelper);

  // Model Group
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // Load 3D GNEGR.glb
  const loader = new GLTFLoader();
  const primaryModelPath = '3D GNEGR.glb';
  const fallbackModelPath = '3d-gnegr.glb';

  function applySculptureMaterial(root) {
    // Dark metallic sculpture material
    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a24,
      metalness: 0.8,
      roughness: 0.2
    });

    root.traverse((child) => {
      if (child.isMesh) {
        // Remove existing texture map
        if (child.material) {
          child.material.map = null;
        }
        // Override with new THREE.MeshStandardMaterial
        child.material = obsidianMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale the model to 0.5
    root.scale.set(0.5, 0.5, 0.5);

    // Center geometry inside the group
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);

    // Rotate model so it faces the camera dynamically
    root.rotation.y = Math.PI * 0.12;

    modelGroup.add(root);

    // Hide loading spinner if present
    const loaderIndicator = document.getElementById('hero-3d-loader');
    if (loaderIndicator) {
      loaderIndicator.style.opacity = '0';
      setTimeout(() => { loaderIndicator.style.display = 'none'; }, 400);
    }
  }

  loader.load(
    primaryModelPath,
    (gltf) => {
      applySculptureMaterial(gltf.scene);
    },
    undefined,
    (err) => {
      console.warn('Could not load primary model URL, attempting fallback:', err);
      loader.load(
        fallbackModelPath,
        (gltf) => {
          applySculptureMaterial(gltf.scene);
        },
        undefined,
        (fallbackErr) => {
          console.error('GLTF loading error:', fallbackErr);
        }
      );
    }
  );

  // Track the user mouse across the window
  window.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Maximum orbit angle: 10 degrees left/right
    const maxOrbitX = 10 * Math.sin(10 * (Math.PI / 180));
    targetCameraX = mouseX * maxOrbitX;
    targetCameraY = 2 + mouseY * 0.8;
  });

  // Window resize handler
  window.addEventListener('resize', onWindowResize);

  // Start Animation Loop
  animate();
}

function onWindowResize() {
  const container = document.getElementById('hero-3d-wrapper');
  if (!container || !camera || !renderer) return;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  isMobile = window.innerWidth < 768;

  camera.aspect = width / height;
  camera.position.z = isMobile ? 12 : 10;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now();

  // Model hover physics: sine wave to Y position Math.sin(Date.now() * 0.002) * 0.2
  if (modelGroup) {
    modelGroup.position.y = Math.sin(time * 0.002) * 0.2;

    // Responsiveness: mobile auto-rotates slowly
    if (isMobile) {
      modelGroup.rotation.y += 0.006;
    } else {
      modelGroup.rotation.y = Math.sin(time * 0.0006) * 0.12;
    }
  }

  // Smoothly orbit camera around the car based on mouse X/Y using lerp
  if (camera) {
    if (!isMobile) {
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.x = 0;
      camera.position.y = 2;
      camera.lookAt(0, 0, 0);
    }
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

// ==========================================================================
// 2. THEME SWITCHING (DARK / LIGHT MODE)
// ==========================================================================
export function updateTheme(mode) {
  const isDark = mode === 'dark';
  const root = document.documentElement;

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('gnegr_theme', 'dark'); } catch (e) {}

    // Dark mode Three.js parameters:
    // Grid colors = #ff3366 (Pink) and #00e5ff (Cyan)
    // Fog color = #0b0b0f
    // Ambient light intensity = 0.5
    if (ambientLight) ambientLight.intensity = 0.5;
    if (pointLight1) {
      pointLight1.color.set(0xff3366);
      pointLight1.intensity = 20;
    }
    if (pointLight2) {
      pointLight2.color.set(0x00e5ff);
      pointLight2.intensity = 20;
    }
    if (scene) scene.fog = new THREE.Fog(0x0b0b0f, 10, 30);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0xff3366, 0x00e5ff);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.5;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }
  } else {
    root.removeAttribute('data-theme');
    try { localStorage.setItem('gnegr_theme', 'light'); } catch (e) {}

    // Light mode Three.js parameters:
    // Grid colors = #0055ff (Blue) and #4400ff (Purple)
    // Fog color = #e0e0e0
    // Ambient light intensity = 1.0
    if (ambientLight) ambientLight.intensity = 1.0;
    if (pointLight1) {
      pointLight1.color.set(0x0055ff);
      pointLight1.intensity = 16;
    }
    if (pointLight2) {
      pointLight2.color.set(0x4400ff);
      pointLight2.intensity = 16;
    }
    if (scene) scene.fog = new THREE.Fog(0xe0e0e0, 10, 30);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0x0055ff, 0x4400ff);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.38;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }
  }
}

// Expose globally to window so inline triggers & buttons can call it
window.updateTheme = updateTheme;

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Detect preference: window.matchMedia('(prefers-color-scheme: dark)').matches
  const savedTheme = localStorage.getItem('gnegr_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialMode = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  // Run initial theme configuration
  updateTheme(initialMode);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      updateTheme(next);
    });
  }

  // Reactive OS theme change
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('gnegr_theme')) {
      updateTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ==========================================================================
// 3. SECTION 2: WEBM PARALLAX BACKGROUND (THROTTLED VIA RAF)
// ==========================================================================
function initWebMParallax() {
  const mediaSections = document.querySelectorAll('.media-section');
  if (!mediaSections.length) return;

  let isTicking = false;

  function updateParallax() {
    const vh = window.innerHeight;

    mediaSections.forEach((section) => {
      const videoBg = section.querySelector('.video-bg');
      if (!videoBg) return;

      const rect = section.getBoundingClientRect();

      // Only perform parallax transform when section intersects or approaches viewport
      if (rect.bottom >= -50 && rect.top <= vh + 50) {
        const offset = (rect.top + rect.height / 2 - vh / 2) * 0.1;
        videoBg.style.transform = "translate3d(0, " + offset.toFixed(2) + "px, 0)";
      }
    });

    isTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      requestAnimationFrame(updateParallax);
      isTicking = true;
    }
  }, { passive: true });

  // Initial calculation
  updateParallax();
}

// ==========================================================================
// 4. SECTION 3: PREMIUM UI POLISH & CUSTOM DUAL CURSOR
// ==========================================================================
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  // On touch/coarse devices, do not engage custom cursor
  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = 'none';
    ring.style.display = 'none';
    return;
  }

  let curMouseX = -100, curMouseY = -100;
  let ringX = -100, ringY = -100;
  let isHoveringInteractive = false;

  window.addEventListener('mousemove', (e) => {
    curMouseX = e.clientX;
    curMouseY = e.clientY;

    // Small dot follows mouse instantly
    dot.style.transform = "translate3d(" + curMouseX + "px, " + curMouseY + "px, 0)";
  });

  // Larger circle lags behind using lerp (linear interpolation)
  function renderCursor() {
    ringX += (curMouseX - ringX) * 0.18;
    ringY += (curMouseY - ringY) * 0.18;

    const scale = isHoveringInteractive ? 'scale(1.5)' : 'scale(1)';
    ring.style.transform = "translate3d(" + ringX + "px, " + ringY + "px, 0) " + scale;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Interactive element hover states
  const interactives = document.querySelectorAll('a, button, input, .project-card, .skill-badge, .control-btn');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      isHoveringInteractive = true;
      ring.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
      isHoveringInteractive = false;
      ring.classList.remove('cursor-hover');
    });
  });
}

// ==========================================================================
// 5. PHILIPPINES REAL-TIME CLOCK (PHT / UTC+8)
// ==========================================================================
function initTimeTracker() {
  const timeElem = document.getElementById('pht-time');
  if (!timeElem) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Manila',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    timeElem.textContent = now.toLocaleTimeString('en-GB', options) + ' PHT';
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 6. SHOWCASE PROJECT FILTER ENGINE
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.category-filters .filter-pill');
  const projectCards = document.querySelectorAll('.work-showcase-grid .project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 7. INTERACTIVE SKILL BADGES PHYSICS
// ==========================================================================
function initSkillsPhysics() {
  const canvas = document.getElementById('skills-cloud');
  const badges = document.querySelectorAll('.skill-badge');

  if (!canvas || !badges.length) return;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mX = e.clientX - rect.left - rect.width / 2;
    const mY = e.clientY - rect.top - rect.height / 2;

    badges.forEach((badge, i) => {
      const depth = ((i % 3) + 1) * 0.03;
      const moveX = mX * depth;
      const moveY = mY * depth;
      badge.style.transform = "translate(" + moveX + "px, " + moveY + "px)";
    });
  });

  canvas.addEventListener('mouseleave', () => {
    badges.forEach((badge) => {
      badge.style.transform = '';
    });
  });
}

// ==========================================================================
// 8. CLIPBOARD COPY UTILITIES
// ==========================================================================
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = btn.getAttribute('data-email') || 'redoble.gninoemmanuel@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.borderColor = 'var(--accent-emerald)';
        btn.style.color = 'var(--accent-emerald)';

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 2200);
      }).catch((err) => {
        console.error('Copy failed:', err);
      });
    });
  });
}