/**
 * GNEGR // NIÃ‘O REDOBLE PORTFOLIO - CORE RUNTIME & THREE.JS ENGINE
 * Elevated to Award-Winning Standard:
 *  - Bruno Simon 3D Obsidian Sculpture & Lighting Art Direction
 *  - Intro Split-Screen Loader (Sora Bold, JetBrains Mono, Session-Cached)
 *  - Scroll Engineering (Parallax, Reveal on Scroll, Active Nav Highlighting)
 *  - Micro-Interactions (8px/30px/60px Dual Cursor with #E24E1B hover, Magnetic Buttons)
 *  - Seamless Theme Engine & Performance Optimizations
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Global Three.js Scene References
let scene, camera, renderer, modelGroup, gridHelper, shadowMesh;
let ambientLight, keyLight, rimLight, accentLight;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 5;
let isMobile = window.innerWidth < 768;

// Loader Callback Registry
let onModelProgress = null;

document.addEventListener('DOMContentLoaded', () => {
  initIntroLoader();
  initCustomCursor();
  initMagneticButtons();
  initScrollEngineering();
  initThreeHero();
  initWebMParallax();
  initThemeEngine();
  initTimeTracker();
  initProjectFilters();
  initSkillsPhysics();
  initCopyButtons();
});

// ==========================================================================
// 0. INTRO SPLIT-SCREEN LOADER
// ==========================================================================
function initIntroLoader() {
  const introLoader = document.getElementById('intro-loader');
  const percentText = document.getElementById('loader-percent');
  const progressBar = document.getElementById('loader-progress-bar');
  if (!introLoader) return;

  // Once per session check
  const introSeen = sessionStorage.getItem('gnegr_intro_seen');
  if (introSeen) {
    introLoader.classList.add('is-hidden');
    return;
  }

  let currentPercent = 0;
  let targetPercent = 25;

  const progressInterval = setInterval(() => {
    if (currentPercent < targetPercent) {
      currentPercent += 1;
      if (percentText) percentText.textContent = `${currentPercent}%`;
      if (progressBar) progressBar.style.width = `${currentPercent}%`;
    }
  }, 20);

  // Hook into model load progress
  onModelProgress = (percent) => {
    targetPercent = Math.max(targetPercent, percent);
    if (percent >= 100) {
      targetPercent = 100;
      clearInterval(progressInterval);
      currentPercent = 100;
      if (percentText) percentText.textContent = '100%';
      if (progressBar) progressBar.style.width = '100%';

      setTimeout(() => {
        introLoader.classList.add('is-loaded');
        sessionStorage.setItem('gnegr_intro_seen', 'true');
        setTimeout(() => {
          introLoader.classList.add('is-hidden');
        }, 900);
      }, 250);
    }
  };

  // Fallback safety timeout so user is never blocked
  setTimeout(() => {
    if (!introLoader.classList.contains('is-loaded')) {
      if (onModelProgress) onModelProgress(100);
    }
  }, 2200);
}

// ==========================================================================
// 1. SECTION 1: THE 3D HERO (BRUNO SIMON ART DIRECTION)
// ==========================================================================
function initThreeHero() {
  const container = document.getElementById('hero-3d-wrapper');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  // Scene
  scene = new THREE.Scene();
  // Deep void fog matching site background (#0A0A0A)
  scene.fog = new THREE.Fog(0x0A0A0A, 5, 25);

  // Dimensions
  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Camera: FOV 55, Position (0, 5, 12) looking at (0, 0, 0)
  camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
  camera.position.set(0, 5, isMobile ? 14 : 12);
  camera.lookAt(0, 0, 0);

  // Renderer: alpha: true (transparent for #0A0A0A), antialias: true, pixelRatio <= 2
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

    root.scale.set(0.5, 0.5, 0.5);

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);

    root.rotation.y = Math.PI * 0.12;
    modelGroup.add(root);

    // Hide hero 3d loader
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
      if (onModelProgress) onModelProgress(100);
    },
    (xhr) => {
      if (xhr.lengthComputable && xhr.total > 0) {
        const p = Math.round((xhr.loaded / xhr.total) * 90);
        if (onModelProgress) onModelProgress(p);
      }
    },
    (err) => {
      console.error('GLTF loading error for gnegr.glb:', err);
      if (onModelProgress) onModelProgress(100);
    }
  );

  // Track user mouse
  window.addEventListener('mousemove', (e) => {
    if (isMobile) return;
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    // Maximum orbit angle: subtle 8 degrees
    const maxOrbitRadians = 8 * (Math.PI / 180);
    const orbitDistance = 12;
    targetCameraX = Math.sin(mouseX * maxOrbitRadians) * orbitDistance;
    targetCameraY = 5 + mouseY * 0.9;
  });

  window.addEventListener('resize', onWindowResize);
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

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now();

  if (modelGroup) {
    modelGroup.position.y = Math.sin(time * 0.002) * 0.15;
    if (isMobile) {
      modelGroup.rotation.y += 0.006;
    } else {
      modelGroup.rotation.y = Math.sin(time * 0.0006) * 0.1;
    }
  }

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
// 2. PHASE 1: SCROLL ENGINEERING (PARALLAX, REVEAL, ACTIVE NAV)
// ==========================================================================
function initScrollEngineering() {
  // 1. Reveal on Scroll Observer
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el) => revealObserver.observe(el));

  // Stagger project cards delay (increment of 0.1s)
  const projectCards = document.querySelectorAll('.work-showcase-grid .project-card');
  projectCards.forEach((card, index) => {
    card.style.transitionDelay = `${(index % 3) * 0.1}s`;
  });

  // 2. Hero Parallax on Scroll (Canvas & Text move up at slower rate 0.3)
  const heroWrapper = document.getElementById('hero-3d-wrapper');
  const heroContent = document.querySelector('.hero-container');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const vh = window.innerHeight;

        if (scrolled <= vh * 1.2) {
          if (heroWrapper) {
            heroWrapper.style.transform = `translate3d(0, ${(scrolled * 0.3).toFixed(2)}px, 0)`;
          }
          if (heroContent) {
            heroContent.style.transform = `translate3d(0, ${(scrolled * 0.2).toFixed(2)}px, 0)`;
            heroContent.style.opacity = Math.max(0, 1 - (scrolled / (vh * 0.75))).toFixed(2);
          }
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 3. Active Nav State Observer
  const navLinks = document.querySelectorAll('.site-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          const href = link.getAttribute('href');
          if (href === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '-10% 0px -30% 0px'
  });

  sections.forEach((s) => navObserver.observe(s));
}

// ==========================================================================
// 3. PHASE 2: MICRO-INTERACTIONS (MAGNETIC BUTTONS)
// ==========================================================================
function initMagneticButtons() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const magneticBtns = document.querySelectorAll('.magnetic-btn, .hero-cta-btn.primary, .btn-pill-primary, .btn-card-action.primary, .btn-channel.primary');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let deltaX = (e.clientX - centerX) * 0.25;
      let deltaY = (e.clientY - centerY) * 0.25;

      const distance = Math.hypot(deltaX, deltaY);
      const maxDistance = 5;
      if (distance > maxDistance) {
        deltaX = (deltaX / distance) * maxDistance;
        deltaY = (deltaY / distance) * maxDistance;
      }

      btn.style.transform = `translate3d(${deltaX.toFixed(2)}px, ${deltaY.toFixed(2)}px, 0)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

// ==========================================================================
// 4. PHASE 2: CUSTOM DUAL CURSOR (8px Dot + 30px Lerp Ring -> 60px #E24E1B)
// ==========================================================================
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
    dot.style.transform = `translate3d(${curMouseX}px, ${curMouseY}px, 0)`;
  });

  function renderCursor() {
    ringX += (curMouseX - ringX) * 0.18;
    ringY += (curMouseY - ringY) * 0.18;

    // Scale up to 60px on hover (scale(2) * 30px = 60px)
    const scale = isHoveringInteractive ? 'scale(2)' : 'scale(1)';
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) ${scale}`;

    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  const interactives = document.querySelectorAll('a, button, input, .project-card, .skill-badge, .control-btn, .nav-link, .hero-cta-btn, .filter-pill');
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
// 5. THEME SWITCHING (DARK / LIGHT MODE)
// ==========================================================================
export function updateTheme(mode) {
  const isDark = mode === 'dark';
  const root = document.documentElement;

  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    try { localStorage.setItem('gnegr_theme', 'dark'); } catch (e) {}

    // Dark mode parameters (Void #0A0A0A)
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
    if (scene) scene.fog = new THREE.Fog(0x0A0A0A, 5, 25);

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

    // Light mode parameters (Paper #FAF9F6)
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

window.updateTheme = updateTheme;

function initThemeEngine() {
  const themeToggleBtn = document.getElementById('theme-toggle');

  const savedTheme = localStorage.getItem('gnegr_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialMode = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

  updateTheme(initialMode);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      updateTheme(next);
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('gnegr_theme')) {
      updateTheme(e.matches ? 'dark' : 'light');
    }
  });
}

// ==========================================================================
// 6. CINEMATIC WEBM PARALLAX BACKGROUND
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
      if (rect.bottom >= -50 && rect.top <= vh + 50) {
        const offset = (rect.top + rect.height / 2 - vh / 2) * 0.1;
        videoBg.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
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

  updateParallax();
}

// ==========================================================================
// 7. PHILIPPINES REAL-TIME CLOCK (PHT / UTC+8)
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
// 8. SHOWCASE PROJECT FILTER ENGINE
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
// 9. INTERACTIVE SKILL BADGES PHYSICS
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
      badge.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  canvas.addEventListener('mouseleave', () => {
    badges.forEach((badge) => {
      badge.style.transform = '';
    });
  });
}

// ==========================================================================
// 10. CLIPBOARD COPY UTILITIES
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