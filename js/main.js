/**
 * GNEGR // NI&Ntilde;O REDOBLE PORTFOLIO - CORE RUNTIME & THREE.JS ENGINE
 * Elevated to Award-Winning Standard:
 *  - Bruno Simon 3D Obsidian Sculpture & Lighting Art Direction
 *  - Intro Split-Screen Loader (Sora Bold, JetBrains Mono, Session-Cached)
 *  - Scroll Engineering (Parallax, Reveal on Scroll, Active Nav Highlighting)
 *  - Micro-Interactions (8px/30px/60px Dual Cursor with #E24E1B hover, Magnetic Buttons)
 *  - Seamless Theme Engine & Performance Optimizations
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
  initHeroScramble();
  initSystemsTerminal();
  initProjectFilters();
  initCopyButtons();
});

// ==========================================================================
// 0. INTRO SPLIT-SCREEN LOADER
// ==========================================================================
function initIntroLoader() {
  const introLoader = document.getElementById('intro-loader');
  const percentText = document.getElementById('loader-percent');
  const progressBar = document.getElementById('loader-progress-bar');
  const telemetryText = document.getElementById('loader-telemetry');
  if (!introLoader) return;

  function updateTelemetry(p) {
    if (!telemetryText) return;
    if (p < 25) {
      telemetryText.textContent = 'INITIALIZING ARCHITECTURAL RUNTIME...';
    } else if (p < 55) {
      telemetryText.textContent = 'COMPUTING 3D CHASSIS GEOMETRY...';
    } else if (p < 85) {
      telemetryText.textContent = 'SYNCHRONIZING TELEMETRY & API MESH...';
    } else if (p < 100) {
      telemetryText.textContent = 'SYSTEMS ONLINE // BUILT TO MOVE...';
    } else {
      telemetryText.textContent = 'SYSTEMS ARMED // LAUNCHING...';
    }
  }

  let currentPercent = 0;
  let targetPercent = 35;

  const ticker = setInterval(() => {
    if (targetPercent < 90) {
      targetPercent += Math.floor(Math.random() * 8) + 4;
      if (targetPercent > 90) targetPercent = 90;
    }
  }, 120);

  const progressInterval = setInterval(() => {
    if (currentPercent < targetPercent) {
      currentPercent += 1;
      if (percentText) percentText.textContent = `${currentPercent}%`;
      if (progressBar) progressBar.style.width = `${currentPercent}%`;
      updateTelemetry(currentPercent);
    }
  }, 16);

  onModelProgress = (percent) => {
    targetPercent = Math.max(targetPercent, percent);
    if (percent >= 100) {
      targetPercent = 100;
      clearInterval(ticker);
      clearInterval(progressInterval);
      currentPercent = 100;
      if (percentText) percentText.textContent = '100%';
      if (progressBar) progressBar.style.width = '100%';
      updateTelemetry(100);

      setTimeout(() => {
        introLoader.classList.add('is-loaded');
        sessionStorage.setItem('gnegr_intro_seen', 'true');
        setTimeout(() => {
          introLoader.classList.add('is-hidden');
        }, 900);
      }, 350);
    }
  };

  // Fallback safety timeout so user is never blocked
  setTimeout(() => {
    if (!introLoader.classList.contains('is-loaded')) {
      if (onModelProgress) onModelProgress(100);
    }
  }, 2400);
}

// ==========================================================================
// 1. SECTION 1: THE 3D HERO (INTERACTIVE CHASSIS WITH ORBIT CONTROLS)
// ==========================================================================
let heroControls;
const defaultCameraPos = new THREE.Vector3(0, 1.5, 5.2);
let currentChassisColor = 0xE24E1B; // Default GNEGR Sunset Orange

function initThreeHero() {
  const container = document.getElementById('hero-3d-wrapper');
  const canvas = document.getElementById('hero-canvas');
  if (!container || !canvas) return;

  const width = container.clientWidth || 460;
  const height = container.clientHeight || 380;

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.copy(defaultCameraPos);

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
  renderer.toneMappingExposure = 1.35;

  heroControls = new OrbitControls(camera, canvas);
  heroControls.enableDamping = true;
  heroControls.dampingFactor = 0.05;
  heroControls.autoRotate = true;
  heroControls.autoRotateSpeed = 1.2;
  heroControls.enablePan = false;
  heroControls.minDistance = 3.0;
  heroControls.maxDistance = 8.0;
  heroControls.maxPolarAngle = Math.PI / 2 + 0.05;
  heroControls.target.set(0, 0, 0);

  // Lighting with vibrant studio definition
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.6 : 2.2);
  scene.add(ambientLight);

  keyLight = new THREE.DirectionalLight(0xffffff, 4.2);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 2.2);
  fillLight.position.set(-5, 4, -4);
  scene.add(fillLight);

  rimLight = new THREE.PointLight(0xFF6B35, 5.5, 20);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  accentLight = new THREE.PointLight(0xFF8A50, 4.0, 16);
  accentLight.position.set(4, 2, 3);
  scene.add(accentLight);

  // Subtle contact shadow
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const ctx = shadowCanvas.getContext('2d');
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
  gradient.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
  gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeo = new THREE.PlaneGeometry(5.5, 5.5);
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    depthWrite: false,
    opacity: isDark ? 0.75 : 0.4
  });
  shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = -1.15;
  scene.add(shadowMesh);

  // Pedestal grid inside the card floor
  const cardGrid = new THREE.GridHelper(6, 12, 0xE24E1B, 0x554433);
  cardGrid.position.y = -1.16;
  if (cardGrid.material) {
    cardGrid.material.opacity = isDark ? 0.35 : 0.18;
    cardGrid.material.transparent = true;
  }
  scene.add(cardGrid);

  modelGroup = new THREE.Group();
  scene.add(modelGroup);

  const loader = new GLTFLoader();
  loader.load(
    'gnegr.glb',
    (gltf) => {
      const root = gltf.scene;

      root.traverse((child) => {
        if (child.isMesh) {
          if (child.geometry) {
            child.geometry.computeVertexNormals();
          }
          child.material = new THREE.MeshStandardMaterial({
            color: currentChassisColor,
            metalness: 0.35,
            roughness: 0.28,
            side: THREE.DoubleSide
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      const box = new THREE.Box3().setFromObject(root);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetSize = 3.6;
      const scale = targetSize / maxDim;
      root.scale.set(scale, scale, scale);

      const updatedBox = new THREE.Box3().setFromObject(root);
      const center = updatedBox.getCenter(new THREE.Vector3());
      root.position.x = -center.x;
      root.position.y = -updatedBox.min.y - 1.14;
      root.position.z = -center.z;

      modelGroup.add(root);

      const loaderIndicator = document.getElementById('hero-3d-loader');
      if (loaderIndicator) {
        loaderIndicator.style.opacity = '0';
        setTimeout(() => { loaderIndicator.style.display = 'none'; }, 400);
      }
      if (onModelProgress) onModelProgress(100);
    },
    (xhr) => {
      if (xhr.lengthComputable && xhr.total > 0) {
        const p = Math.round((xhr.loaded / xhr.total) * 95);
        if (onModelProgress) onModelProgress(p);
      }
    },
    (err) => {
      console.error('Error loading 3D motorcycle model:', err);
      if (onModelProgress) onModelProgress(100);
    }
  );

  // Interactive Color Swatch Customizer
  const swatchBtns = document.querySelectorAll('.color-swatch-btn');
  swatchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const hex = btn.getAttribute('data-color');
      if (hex && modelGroup) {
        currentChassisColor = parseInt(hex.replace('#', '0x'));
        modelGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.color.setHex(currentChassisColor);
          }
        });
      }
    });
  });

  // Reset view button
  const resetBtn = document.getElementById('reset-3d-view-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      camera.position.copy(defaultCameraPos);
      heroControls.target.set(0, 0, 0);
      heroControls.update();
    });
  }

  // Theme change adaptation
  window.addEventListener('gnegr-theme-changed', (e) => {
    const isDarkNow = e.detail.theme === 'dark';
    if (ambientLight) ambientLight.intensity = isDarkNow ? 1.6 : 2.2;
    if (shadowMesh && shadowMesh.material) shadowMesh.material.opacity = isDarkNow ? 0.75 : 0.4;
    if (cardGrid && cardGrid.material) cardGrid.material.opacity = isDarkNow ? 0.35 : 0.18;
  });

  const resizeObserver = new ResizeObserver(() => {
    if (!container || !camera || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  resizeObserver.observe(container);

  function renderLoop() {
    requestAnimationFrame(renderLoop);
    heroControls.update();
    renderer.render(scene, camera);
  }
  renderLoop();
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
    if (ambientLight) ambientLight.intensity = 1.6;
    if (keyLight) keyLight.intensity = 4.2;
    if (rimLight) {
      rimLight.color.set(0xFF6B35);
      rimLight.intensity = 5.5;
    }
    if (accentLight) {
      accentLight.color.set(0xFF8A50);
      accentLight.intensity = 4.0;
    }
    if (scene) scene.fog = new THREE.Fog(0x0A0A0A, 5, 25);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0xE24E1B, 0x332211);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.35;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }

    if (shadowMesh) {
      shadowMesh.material.opacity = 0.75;
    }
  } else {
    root.removeAttribute('data-theme');
    try { localStorage.setItem('gnegr_theme', 'light'); } catch (e) {}

    // Light mode parameters (Paper #FAF9F6)
    if (ambientLight) ambientLight.intensity = 2.2;
    if (keyLight) keyLight.intensity = 4.2;
    if (rimLight) {
      rimLight.color.set(0xFF6B35);
      rimLight.intensity = 4.5;
    }
    if (accentLight) {
      accentLight.color.set(0xFF8A50);
      accentLight.intensity = 3.5;
    }
    if (scene) scene.fog = new THREE.Fog(0xe0e0e0, 8, 28);

    if (gridHelper && scene) {
      scene.remove(gridHelper);
      gridHelper.geometry.dispose();
      gridHelper = new THREE.GridHelper(30, 30, 0xE24E1B, 0x554433);
      gridHelper.position.y = -1;
      if (gridHelper.material) {
        gridHelper.material.opacity = 0.18;
        gridHelper.material.transparent = true;
      }
      scene.add(gridHelper);
    }

    if (shadowMesh) {
      shadowMesh.material.opacity = 0.4;
    }
  }

  window.dispatchEvent(new CustomEvent('gnegr-theme-changed', { detail: { theme: mode } }));
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
// 7. DYNAMIC HERO TEXT SCRAMBLER (Recommendation 2)
// ==========================================================================
function initHeroScramble() {
  const scrambleEl = document.getElementById('hero-scramble');
  if (!scrambleEl) return;

  const words = ['Full-Stack', 'Systems', 'Distributed', 'Backend'];
  let wordIndex = 0;
  const chars = '!<>-_\\/[]{}*^?#01X_=+/~';

  function scrambleTo(newWord) {
    let frame = 0;
    const totalFrames = 22;
    const oldWord = scrambleEl.textContent;

    const interval = setInterval(() => {
      let output = '';

      for (let i = 0; i < newWord.length; i++) {
        const charProgress = Math.floor((frame / totalFrames) * newWord.length);
        if (i < charProgress) {
          output += newWord[i];
        } else {
          output += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      scrambleEl.textContent = output;
      frame++;

      if (frame > totalFrames) {
        clearInterval(interval);
        scrambleEl.textContent = newWord;
      }
    }, 45);
  }

  setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    scrambleTo(words[wordIndex]);
  }, 3200);
}

// ==========================================================================
// 8. INTERACTIVE SYSTEMS TERMINAL / HUD (Recommendation 1)
// ==========================================================================
function initSystemsTerminal() {
  const modal = document.getElementById('terminal-modal');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const closeBtn = document.getElementById('terminal-close-btn');
  const backdrop = document.getElementById('terminal-backdrop');
  const toggleBtn = document.getElementById('terminal-toggle');
  const quickBtns = document.querySelectorAll('.term-quick-btn');

  if (!modal || !input || !output) return;

  let history = [];
  let historyIndex = -1;

  function openTerminal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => input.focus(), 80);
  }

  function closeTerminal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
  }

  window.toggleSystemsTerminal = function(force) {
    if (typeof force === 'boolean') {
      force ? openTerminal() : closeTerminal();
    } else {
      modal.classList.contains('is-open') ? closeTerminal() : openTerminal();
    }
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.toggleSystemsTerminal();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (backdrop) backdrop.addEventListener('click', closeTerminal);

  // Keyboard shortcut Ctrl+K or Cmd+K or ESC
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.toggleSystemsTerminal();
    } else if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      e.preventDefault();
      closeTerminal();
    }
  });

  // Quick action buttons
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        handleCommand(cmd);
        input.value = '';
      }
    });
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const cmd = input.value.trim();
      if (cmd) {
        history.push(cmd);
        historyIndex = history.length;
        handleCommand(cmd);
        input.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      if (history.length > 0 && historyIndex > 0) {
        historyIndex--;
        input.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        input.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const val = input.value.trim().toLowerCase();
      if (val) {
        const commands = ['projects', 'stack', 'experience', 'whoami', 'contact', 'theme', 'clear', 'exit', 'help'];
        const m = commands.find(c => c.startsWith(val));
        if (m) input.value = m;
      }
    }
  });

  function printOutput(cmd, content) {
    const entry = document.createElement('div');
    entry.className = 'term-output-entry';
    entry.innerHTML = `
      <div class="term-cmd-echo"><span style="color:#E24E1B;">gnegr&gt;</span> ${escapeHtml(cmd)}</div>
      <div class="term-output-text">${content}</div>
    `;
    output.appendChild(entry);
    const body = document.getElementById('terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function handleCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();

    switch (command) {
      case 'help':
      case '?':
        printOutput(trimmed, `
<span class="term-hl">AVAILABLE SYSTEM COMMANDS:</span>
  <span style="color:#E24E1B;">projects</span>    - Shipped production platforms & live interactive demos
  <span style="color:#E24E1B;">stack</span>       - Architectural technology matrix (Frontend, Backend, Infra)
  <span style="color:#E24E1B;">experience</span>  - Engineering career milestones & systems leadership
  <span style="color:#E24E1B;">whoami</span>      - Professional background, location, and engineering philosophy
  <span style="color:#E24E1B;">contact</span>     - Direct contact coordinates (Email, GitHub, LinkedIn)
  <span style="color:#E24E1B;">theme</span>       - Live toggle between Light (Paper) and Dark (Void) themes
  <span style="color:#E24E1B;">clear</span>       - Clear terminal buffer
  <span style="color:#E24E1B;">exit</span>        - Close this Systems Terminal HUD
        `);
        break;

      case 'projects':
      case 'work':
        printOutput(trimmed, `
<span class="term-hl">LIVE PRODUCTION PLATFORMS & SYSTEM SPEC SHEETS:</span>

[01] <span style="color:#E24E1B; font-weight:700;">Aether Report 2026</span> // AI Edge Mesh
     Apple/Stripe Press-inspired annual report on N-Mindanao compute clusters.
     Live: <a href="https://ninoredoble.github.io/aether-report-2026/" target="_blank">https://ninoredoble.github.io/aether-report-2026/</a>

[02] <span style="color:#E24E1B; font-weight:700;">ClimaPocket Android</span> // Mobile & Telemetry
     Pixel 9 Pro Material You 3.5 Agrometeorology Radar Studio.
     Live: <a href="https://ninoredoble.github.io/clima-pocket-android/" target="_blank">https://ninoredoble.github.io/clima-pocket-android/</a>

[03] <span style="color:#E24E1B; font-weight:700;">Relay Core API</span> // Infrastructure Engine
     Distributed Webhook Ingestion Engine with HMAC-SHA256 & UNIX TUI sandbox.
     Live: <a href="https://ninoredoble.github.io/relay-core-api/" target="_blank">https://ninoredoble.github.io/relay-core-api/</a>

[04] <span style="color:#E24E1B; font-weight:700;">Hablon Textile Archive</span> // Cultural Vector Loom
     Indigenous Handwoven Textile Preservation Folio with Procedural Math Loom.
     Live: <a href="https://ninoredoble.github.io/hablon-textile-archive/" target="_blank">https://ninoredoble.github.io/hablon-textile-archive/</a>

[05] <span style="color:#E24E1B; font-weight:700;">Mindanao Grid Mesh</span> // Sub-Transmission SCADA
     Industrial Power Dispatch Mimic Board modeling 69kV/13.8kV feeders.
     Live: <a href="https://ninoredoble.github.io/mindanao-grid-mesh/" target="_blank">https://ninoredoble.github.io/mindanao-grid-mesh/</a>

[06] <span style="color:#E24E1B; font-weight:700;">Archipelago Marine Cadence</span> // Oceanography
     Bathymetric Cartography & Pelagic Coastal Telemetry.
     Live: <a href="https://ninoredoble.github.io/archipelago-marine-cadence/" target="_blank">https://ninoredoble.github.io/archipelago-marine-cadence/</a>

[07] <span style="color:#E24E1B; font-weight:700;">Cagayan Basin Corridor</span> // Watershed Hydrology
     Watershed Riparian Resilience Simulation.
     Live: <a href="https://ninoredoble.github.io/cagayan-basin-corridor/" target="_blank">https://ninoredoble.github.io/cagayan-basin-corridor/</a>
        `);
        break;

      case 'stack':
      case 'skills':
        printOutput(trimmed, `
<span class="term-hl">TECHNOLOGY MATRIX & INFRASTRUCTURE:</span>
  Languages:   Python, TypeScript, JavaScript (ES6+), C++, Java, PHP, HTML5/CSS3
  Frameworks:  React, Next.js, FastAPI, Node.js, Express, Django, Laravel, Tailwind
  Databases:   PostgreSQL, MySQL, Supabase, MongoDB, Redis (Idempotency)
  DevOps/Ops:  Docker, Linux (Debian/Ubuntu), Git, GitHub Actions, Nginx, Vercel
  Graphics:    Three.js, WebGL Shaders, Canvas API, Generative SVG Vector Math
        `);
        break;

      case 'experience':
      case 'exp':
        printOutput(trimmed, `
<span class="term-hl">CAREER TIMELINE & SYSTEMS ROLES:</span>
  [2026] <span style="color:#FAF9F6; font-weight:600;">CEPALCO (Cagayan Electric Power & Light Co.)</span>
         Enterprise Systems Developer Intern
         - Enterprise internal ticketing & operational asset workflow automation.
         - High-reliability fleet fuel tracking analytics portal with strict auditing.

  [2024 - Present] <span style="color:#FAF9F6; font-weight:600;">Distributed Systems & Full-Stack Architect</span>
         Independent Production Engineering & Open Source
         - Shipped 7 live production platforms across Vercel, Supabase, and Docker.
         - Procedural vector simulations, SCADA mimics, and distributed engines.

  [2024 - 2025] <span style="color:#FAF9F6; font-weight:600;">BuyNaBay E-Commerce Platform</span>
         Lead Full-Stack Systems Architect
         - Regional Northern Mindanao marketplace platform.
         - Scalable microservices backend, authentication, and inventory sync.
        `);
        break;

      case 'whoami':
      case 'bio':
        printOutput(trimmed, `
<span class="term-hl">G. NI&#209;O EMMANUEL G. REDOBLE (GNEGR)</span>
Full-Stack Systems Developer & Software Architect based in Cagayan de Oro City, PH.
Focus: Resilient distributed web systems, real-time telemetry, 3D WebGL graphics, and industrial-grade software engineering.
Credo: "Built to move. Zero fluff, pure engineering."
        `);
        break;

      case 'contact':
        printOutput(trimmed, `
<span class="term-hl">DIRECT CONTACT CHANNELS:</span>
  Email:    <a href="mailto:redoble.gninoemmanuel@gmail.com">redoble.gninoemmanuel@gmail.com</a>
  LinkedIn: <a href="https://linkedin.com/in/g-redoble" target="_blank">https://linkedin.com/in/g-redoble</a>
  GitHub:   <a href="https://github.com/ninoredoble" target="_blank">https://github.com/ninoredoble</a>
  Location: Cagayan de Oro City, Philippines
        `);
        break;

      case 'theme':
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('gnegr_theme', nextTheme);
        window.dispatchEvent(new CustomEvent('gnegr-theme-changed', { detail: { theme: nextTheme } }));
        printOutput(trimmed, `Theme toggled to: <span style="color:#E24E1B; font-weight:700;">${nextTheme.toUpperCase()}</span> (${nextTheme === 'dark' ? 'Void #0A0A0A' : 'Paper #FAF9F6'})`);
        break;

      case 'clear':
      case 'cls':
        output.innerHTML = '';
        break;

      case 'exit':
      case 'quit':
        closeTerminal();
        break;

      default:
        printOutput(trimmed, `zsh: command not found: <span style="color:#ff3366;">${escapeHtml(command)}</span>. Type '<span class="term-hl">help</span>' to list valid commands.`);
        break;
    }
  }
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
