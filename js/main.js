/**
 * GNEGR // NIÑO REDOBLE PORTFOLIO - CORE RUNTIME & THREE.JS ENGINE
 * Inspired by: Bruno Simon (interactive 3D canvas depth) & Lynn Fisher (creative polish)
 *
 * Deliverables & Architecture:
 *  1. Full-screen interactive Three.js Hero Section:
 *     - ES Modules (three & GLTFLoader)
 *     - Transparent renderer showing dark site background (#0b0b0f)
 *     - Dark obsidian sculpture material override (#111111, metalness: 1.0, roughness: 0.05)
 *     - Directional Key Light (#ffffff, 2.5) at (5, 10, 5)
 *     - Rim Light behind model (#ff3366, 30) at (0, 3, -5)
 *     - Accent Light (#00e5ff, 20) at (-5, 1, 2)
 *     - Desaturated dark GridHelper (0x331a22, 0x1a3333) with ground contact shadow
 *     - Camera at (0, 5, 12) looking down at (0, 0, 0), FOV 55
 *     - Camera orbit lerp tracking user mouse (subtle <= 8 deg)
 *     - Responsive mobile handling (<768px auto-rotation)
 *  2. Cinematic WebM Parallax Section
 *  3. Custom Dual Cursor (dot + lerp lagging ring)
 *  4. Showcase Projects filter, Philippines live clock, and clipboard copy utilities
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Global Three.js Scene References
let scene, camera, renderer, modelGroup, gridHelper, shadowMesh;
let ambientLight, keyLight, rimLight, accentLight;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 5;
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
// 1. SECTION 1: THE 3D HERO (BRUNO SIMON ART DIRECTION)
// ==========================================================================
function initThreeHero() {
  const container = document.getElementById('hero-3d-wrapper');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // Scene
  scene = new THREE.Scene();
  // Deep void fog matching site background
  scene.fog = new THREE.Fog(0x0b0b0f, 5, 25);

  // Dimensions
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Camera: FOV 55, Position (0, 5, 12) looking at (0, 0, 0)
  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
  camera.position.set(0, 5, isMobile ? 14 : 12);
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

  // --- Lighting Setup (Bruno Simon Aesthetic) ---
  // 1. AmbientLight: heavily reduced to 0.1 for deep, dramatic shadows
  ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // 2. Key Light (DirectionalLight): gives the chassis shape and crisp definition
  keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(5, 10, 5);
  scene.add(keyLight);

  // 3. Rim Light (PointLight): sits behind the car and outlines its silhouette with neon pink
  rimLight = new THREE.PointLight(0xff3366, 30, 40);
  rimLight.position.set(0, 3, -5);
  scene.add(rimLight);

  // 4. Accent Light (PointLight): cyan front-side highlight
  accentLight = new THREE.PointLight(0x00e5ff, 20, 35);
  accentLight.position.set(-5, 1, 2);
  scene.add(accentLight);

  // --- Subtle & Atmospheric Grid ---
  // Desaturated dark versions: 0x331a22 and 0x1a3333
  gridHelper = new THREE.GridHelper(30, 30, 0x331a22, 0x1a3333);
  gridHelper.position.y = -1;
  if (gridHelper.material) {
    gridHelper.material.opacity = 0.45;
    gridHelper.material.transparent = true;
  }
  scene.add(gridHelper);

  // --- Ground Contact Shadow (Soft Radial Gradient under chassis) ---
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
  gradient.addColorStop(0.4, 'rgba(0, 0, 0, 0.5)');
  gradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(6, 6);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: 0.8
  });
  shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -0.98;
  scene.add(shadowMesh);

  // --- Model Group ---
  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  // --- Load gnegr.glb ---
  const loader = new GLTFLoader();
  const primaryModelPath = 'gnegr.glb';

  function applySculptureMaterial(root) {
    // Polished obsidian mirror reflecting neon lights
    const obsidianMaterial = new THREE.MeshStandardMaterial({
      color: 0x111111,
      metalness: 1.0,
      roughness: 0.05
    });

    root.traverse((child) => {
      if (child.isMesh) {
        if (child.material) {
          child.material.map = null;
        }
        child.material = obsidianMaterial;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale the model
    root.scale.set(0.5, 0.5, 0.5);

    // Center geometry inside the group
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);

    // Dynamic initial rotation
    root.rotation.y = Math.PI * 0.12;

    modelGroup.add(root);

    // Hide loading indicator
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
      console.error('GLTF loading error for gnegr.glb:', err);
      // Fallback if needed
      loader.load(
        'gnegr.glb',
        (gltf) => { applySculptureMaterial(gltf.scene); },
        undefined,
        (fallbackErr) => { console.error('Fallback error:', fallbackErr); }
      );
    }
  );

  // Track the user mouse across the window
  window.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Maximum orbit angle: subtle 8 degrees (heavy, smooth camera feel)
    const maxOrbitRadians = 8 * (Math.PI / 180);
    const orbitDistance = 12;
    targetCameraX = Math.sin(mouseX * maxOrbitRadians) * orbitDistance;
    targetCameraY = 5 + mouseY * 0.9;
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
  camera.position.z = isMobile ? 14 : 12;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now();

  // Model hover physics: sine wave bobbing
  if (modelGroup) {
    modelGroup.position.y = Math.sin(time * 0.002) * 0.15;

    // Responsiveness: mobile auto-rotates smoothly
    if (isMobile) {
      modelGroup.rotation.y += 0.006;
    } else {
      modelGroup.rotation.y = Math.sin(time * 0.0006) * 0.1;
    }
  }

  // Smoothly orbit camera around the car based on mouse X/Y using lerp
  if (camera) {
    if (!isMobile) {
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.x = 0;
      camera.position.y = 5;
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

    // Dark mode Three.js parameters
    if (ambientLight) ambientLight.intensity = 0.1;
    if (keyLight) keyLight.intensity = 2.5;
    if (rimLight) {
      rimLight.color.set(0xff3366);
      rimLight.intensity = 30;
    }
    if (accentLight) {
      accentLight.color.set(0x00e5ff);
      accentLight.intensity = 20;
    }
    if (scene) scene.fog = new THREE.Fog(0x0b0b0f, 5, 25);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0x331a22, 0x1a3333);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.45;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }

    if (shadowMesh) {
      shadowMesh.material.opacity = 0.8;
    }
  } else {
    root.removeAttribute('data-theme');
    try { localStorage.setItem('gnegr_theme', 'light'); } catch (e) {}

    // Light mode Three.js parameters
    if (ambientLight) ambientLight.intensity = 0.8;
    if (keyLight) keyLight.intensity = 2.0;
    if (rimLight) {
      rimLight.color.set(0x0055ff);
      rimLight.intensity = 18;
    }
    if (accentLight) {
      accentLight.color.set(0x7928ca);
      accentLight.intensity = 15;
    }
    if (scene) scene.fog = new THREE.Fog(0xe0e0e0, 8, 28);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0x0055ff, 0x4400ff);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.35;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }

    if (shadowMesh) {
      shadowMesh.material.opacity = 0.4;
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