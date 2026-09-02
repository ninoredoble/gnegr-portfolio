/**
 * GNEGR / NINO REDOBLE PORTFOLIO - CORE RUNTIME ENGINE
 * Features: Lenis Smooth Scroll, Interactive Terminal, Dynamic Tool Registry, Project Filter, Copy Utilities
 */

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initTimeTracker();
  initProjectFilters();
  initToolsCatalog();
  initInteractiveTerminal();
  initCopyButtons();
  initContactForm();
  initMobileNav();
});

// ==========================================================================
// 1. SMOOTH SCROLL (Lenis Integration)
// ==========================================================================
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

// ==========================================================================
// 2. REAL-TIME PHILIPPINES TIME TRACKER
// ==========================================================================
function initTimeTracker() {
  const timeElem = document.getElementById('live-time');
  if (!timeElem) return;

  function update() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Manila',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };
    timeElem.textContent = now.toLocaleTimeString('en-GB', options) + ' PHT (UTC+8)';
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 3. PROJECT FILTER ENGINE
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.work-filters .filter-btn');
  const projectCards = document.querySelectorAll('.work-grid .work-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ==========================================================================
// 4. TOOLS & WORKFLOW ECOSYSTEM CATALOG
// ==========================================================================
const TOOLS_DATABASE = [
  {
    name: 'Antigravity IDE',
    category: 'agent',
    categoryLabel: 'Agentic IDE',
    desc: "Google's agent-first coding IDE. Plans, writes, tests, and refactors across the entire workspace.",
    link: 'https://github.com',
    role: 'Core Development Engine'
  },
  {
    name: 'Jules',
    category: 'agent',
    categoryLabel: 'Autonomous Agent',
    desc: 'Autonomous coding agent that fixes issues, generates test suites, and manages GitHub backlog.',
    link: 'https://github.com',
    role: 'Automated CI/CD Fixes'
  },
  {
    name: 'Google Opal',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'Drag-and-drop prompt builder turning plain text prompts into full working mini-apps & workflows.',
    link: 'https://opal.google',
    role: 'Rapid Prototyping'
  },
  {
    name: 'Mixboard',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'AI whiteboard for brainstorming and mood boards, fusing visuals and text on a single canvas.',
    link: 'https://labs.google',
    role: 'Design Moodboarding'
  },
  {
    name: 'Google Pomelli',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'Scans brand guidelines and automatically creates consistent social posts and visual collateral.',
    link: 'https://labs.google',
    role: 'Brand Asset Generation'
  },
  {
    name: 'Stitch',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'Turns natural language prompts directly into production-ready frontend UI layouts and code.',
    link: 'https://labs.google',
    role: 'UI Scaffolding'
  },
  {
    name: 'Firebase Studio',
    category: 'agent',
    categoryLabel: 'Cloud Platform',
    desc: 'Cloud dev environment that builds, executes, and deploys full-stack apps from prompt instructions.',
    link: 'https://firebase.google.com',
    role: 'Cloud Deployment'
  },
  {
    name: 'Code Wiki',
    category: 'agent',
    categoryLabel: 'Knowledge Tool',
    desc: 'Transforms any codebase into an interactive, indexed, and searchable documentation wiki.',
    link: 'https://github.com',
    role: 'Codebase Documentation'
  },
  {
    name: 'Gemini Notebook (NotebookLM)',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'Source-grounded research assistant. Synthesizes knowledge and study briefs from source docs.',
    link: 'https://notebooklm.google',
    role: 'Source Grounding'
  },
  {
    name: 'Google AI Studio',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: "Google's playground for building, prompt engineering, and experimenting with Gemini 1.5/2.0.",
    link: 'https://aistudio.google.com',
    role: 'Model Prompting & Testing'
  },
  {
    name: 'Google Illuminate',
    category: 'google',
    categoryLabel: 'Google Suite',
    desc: 'Converts complex research papers into podcast-style AI-generated audio summaries.',
    link: 'https://illuminate.google.com',
    role: 'Research Synthesis'
  },
  {
    name: 'Lenis Smooth Scroll',
    category: 'motion',
    categoryLabel: 'Motion & Scroll',
    desc: 'Ultra-lightweight, robust smooth scrolling library with zero lag and native keyboard support.',
    link: 'https://github.com/darkroomengineering/lenis',
    role: 'Scroll Ergonomics'
  },
  {
    name: 'GSAP (GreenSock)',
    category: 'motion',
    categoryLabel: 'Motion & Scroll',
    desc: 'Industry standard JavaScript animation library for high-performance scripted animations.',
    link: 'https://github.com/greensock/GSAP',
    role: 'Timeline Orchestration'
  },
  {
    name: 'Raylight.app',
    category: 'motion',
    categoryLabel: 'Motion & Scroll',
    desc: 'Interactive motion design tool for authoring and tuning micro-interactions and easing curves.',
    link: 'https://raylight.app',
    role: 'Easing Curve Tuning'
  },
  {
    name: 'Watermelon.UI',
    category: 'design',
    categoryLabel: 'UI/UX Design',
    desc: 'Modern component libraries and layout architectures for clean, distraction-free software.',
    link: 'https://watermelonui.com',
    role: 'Design Reference'
  },
  {
    name: 'Variant',
    category: 'design',
    categoryLabel: 'UI/UX Design',
    desc: 'Rapid layout and component variant generator for testing contrast and balance.',
    link: 'https://variant.design',
    role: 'Layout Exploration'
  },
  {
    name: 'GrayBlocks',
    category: 'design',
    categoryLabel: 'UI/UX Design',
    desc: 'Minimal wireframing kit focused on structural information hierarchy before styling.',
    link: 'https://grayblocks.io',
    role: 'Structural Wireframing'
  },
  {
    name: 'Mockuply & Appshots',
    category: 'design',
    categoryLabel: 'UI/UX Design',
    desc: 'High-resolution realistic device presentation framing without artificial 3D distorion.',
    link: 'https://mockuply.com',
    role: 'Asset Presentation'
  },
  {
    name: 'markitdown',
    category: 'repo',
    categoryLabel: 'Open Source',
    desc: 'Microsoft utility for converting PDF, Word, PowerPoint, audio and HTML into clean Markdown.',
    link: 'https://github.com/microsoft/markitdown',
    role: 'Document Conversion'
  },
  {
    name: 'free-for-dev',
    category: 'repo',
    categoryLabel: 'Open Source',
    desc: 'Extensive curated index of SaaS, PaaS, and IaaS offerings with free developer tiers.',
    link: 'https://github.com/ripienaar/free-for-dev',
    role: 'Zero-Cost Infrastructure'
  },
  {
    name: 'react-bits',
    category: 'repo',
    categoryLabel: 'Open Source',
    desc: 'Curated collection of interactive UI snippets, shaders, and micro-animations.',
    link: 'https://github.com/DavidHDev/react-bits',
    role: 'Interaction Snippets'
  },
  {
    name: 'Routera & Ruflo',
    category: 'repo',
    categoryLabel: 'Open Source',
    desc: 'Intelligent multi-model routing and multi-agent workflow orchestration frameworks.',
    link: 'https://github.com/ruvnet/ruflo',
    role: 'Agent Workflows'
  }
];

function initToolsCatalog() {
  const container = document.getElementById('tools-grid');
  const searchInput = document.getElementById('tools-search');
  const filterBtns = document.querySelectorAll('.tools-filters .filter-btn');
  if (!container) return;

  let activeCategory = 'all';
  let activeSearch = '';

  function render() {
    container.innerHTML = '';
    const filtered = TOOLS_DATABASE.filter(item => {
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = item.name.toLowerCase().includes(activeSearch) ||
                          item.desc.toLowerCase().includes(activeSearch) ||
                          item.role.toLowerCase().includes(activeSearch);
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-muted); font-family: var(--font-mono);">No matching tools found.</div>`;
      return;
    }

    filtered.forEach(tool => {
      const card = document.createElement('div');
      card.className = 'tool-card';
      card.innerHTML = `
        <div>
          <div class="tool-header">
            <h4 class="tool-name">${tool.name}</h4>
            <span class="tool-category-tag">${tool.categoryLabel}</span>
          </div>
          <p class="tool-desc">${tool.desc}</p>
        </div>
        <div class="tool-footer">
          <span>// ${tool.role}</span>
          <a href="${tool.link}" target="_blank" rel="noopener noreferrer" class="tool-link">
            Docs &nearr;
          </a>
        </div>
      `;
      container.appendChild(card);
    });
  }

  render();

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value.toLowerCase().trim();
      render();
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-tool-filter');
      render();
    });
  });
}

// ==========================================================================
// 5. INTERACTIVE DEVELOPER TERMINAL
// ==========================================================================
function initInteractiveTerminal() {
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('terminal-input');
  const pills = document.querySelectorAll('.term-pill');
  if (!termBody || !termInput) return;

  const COMMANDS = {
    help: `Available commands:
  • <span class="term-log info">whoami</span>     : Display developer identity & background
  • <span class="term-log info">projects</span>   : List featured portfolio projects
  • <span class="term-log info">stack</span>      : Show core technologies & languages
  • <span class="term-log info">tools</span>      : Summary of active AI & workflow ecosystem
  • <span class="term-log info">domain</span>     : Display custom domain architecture (is-a.dev)
  • <span class="term-log info">contact</span>    : Print direct verified contact channels
  • <span class="term-log info">clear</span>      : Clear terminal screen`,
    
    whoami: `Name: G. Niño Emmanuel G. Redoble (GNEGR)
Role: Web Developer & Creative Technologist
Location: Cagayan de Oro City, Philippines
Status: Active, building agent workflows and digital systems.`,

    projects: `Featured Projects:
  [01] Digital Experience Platform - High performance portfolio & web architecture
  [02] Introduction Video Production - Video editing, motion graphics & sound design
  [03] Slogan Campaign & Brand Identity - Graphic design, typography & layout hierarchy
  [04] Curriculum Vitae & Technical Specs - Professional background & engineering resume`,

    stack: `Core Stack:
  • Languages: C++, C, JavaScript (ES6+), TypeScript, HTML5, CSS3
  • Motion & Scroll: Lenis Smooth Scroll, GSAP, Raylight.app
  • AI & Agents: Antigravity IDE, Jules, Gemini / Google AI Studio, Routera, Ruflo
  • Prototyping: Watermelon.UI, Variant, GrayBlocks, Mockuply, Appshots`,

    tools: `Workflow Engine:
  Integrated 22+ modern tools including Jules, Opal, Mixboard, Antigravity, Stitch, Code Wiki,
  Firebase Studio, Lenis, GSAP, and Microsoft Markitdown. Scroll to #tools section to explore.`,

    domain: `Domain Architecture:
  Target Custom Domain: ninoredoble.is-a.dev (100% Free Forever)
  Hosting: GitHub Pages (Global CDN + Automatic SSL)
  Config File: domains/ninoredoble.json via is-a-dev/register`,

    contact: `Direct Contact Channels:
  • Email: redoble.gninoemmanuel@gmail.com
  • Phone: [REDACTED]
  • Location: Cagayan de Oro City, Philippines
  • GitHub: https://github.com/ninoredoble`
  };

  function execute(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    
    // Echo user command
    const userLine = document.createElement('div');
    userLine.className = 'term-log';
    userLine.innerHTML = `<span class="term-prompt-label">visitor@gnegr:~$</span> ${escapeHTML(cmd)}`;
    termBody.appendChild(userLine);

    if (trimmed === 'clear') {
      termBody.innerHTML = '';
    } else if (COMMANDS[trimmed]) {
      const respLine = document.createElement('div');
      respLine.className = 'term-log output';
      respLine.innerHTML = COMMANDS[trimmed];
      termBody.appendChild(respLine);
    } else if (trimmed === '') {
      // Do nothing on blank enter
    } else {
      const errorLine = document.createElement('div');
      errorLine.className = 'term-log';
      errorLine.style.color = '#ef4444';
      errorLine.textContent = `Command not recognized: '${cmd}'. Type 'help' to see valid commands.`;
      termBody.appendChild(errorLine);
    }

    termBody.scrollTop = termBody.scrollHeight;
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      execute(val);
    }
  });

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      if (cmd) {
        execute(cmd);
      }
    });
  });
}

// ==========================================================================
// 6. COPY TO CLIPBOARD UTILITIES
// ==========================================================================
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          btn.style.color = 'var(--accent-emerald)';
          setTimeout(() => {
            btn.textContent = orig;
            btn.style.color = '';
          }, 2000);
        });
      }
    });
  });
}

// ==========================================================================
// 7. CONTACT FORM VALIDATION & DISPATCH
// ==========================================================================
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      if (statusMsg) {
        statusMsg.style.color = 'var(--accent-crimson)';
        statusMsg.textContent = 'Please fill out all fields.';
      }
      return;
    }

    // Open mailto fallback with pre-filled details
    const mailtoUrl = `mailto:redoble.gninoemmanuel@gmail.com?subject=${encodeURIComponent('Contact from ' + name)}&body=${encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')')}`;
    window.location.href = mailtoUrl;

    if (statusMsg) {
      statusMsg.style.color = 'var(--accent-emerald)';
      statusMsg.textContent = 'Opening your email client... Message ready to send!';
    }
    form.reset();
  });
}

// ==========================================================================
// 8. MOBILE NAV TOGGLE
// ==========================================================================
function initMobileNav() {
  const toggle = document.querySelector('.mobile-nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

// Helper: Escape HTML
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
