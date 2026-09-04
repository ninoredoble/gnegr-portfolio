/**
 * GNEGR // NIÑO REDOBLE PORTFOLIO - CORE RUNTIME ENGINE
 * Features: Native Natural Scroll, Project Filtering, Interactive Skill Badges, Theme Toggle, Philippines Live Time Tracker, Copy Utilities
 * ZERO scrolljacking or lagging wheel traps.
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTimeTracker();
  initProjectFilters();
  initSkillsPhysics();
  initCopyButtons();
});

// ==========================================================================
// 1. THEME TOGGLE ENGINE (Light / Dark Mode with Persistence)
// ==========================================================================
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  if (!themeToggleBtn) return;

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    
    if (newTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    
    try {
      localStorage.setItem('gnegr_theme', newTheme);
    } catch (e) {}
  }

  themeToggleBtn.addEventListener('click', toggleTheme);
}

// ==========================================================================
// 2. REAL-TIME PHILIPPINES TIME TRACKER (PHT / UTC+8)
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
      second: '2-digit',
    };
    timeElem.textContent = now.toLocaleTimeString('en-GB', options) + ' PHT';
  }

  update();
  setInterval(update, 1000);
}

// ==========================================================================
// 3. PROJECT FILTER ENGINE
// ==========================================================================
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.category-filters .filter-pill');
  const projectCards = document.querySelectorAll('.work-showcase-grid .project-card');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
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
// 4. INTERACTIVE SKILL BADGES (Subtle mouse move response)
// ==========================================================================
function initSkillsPhysics() {
  const canvas = document.getElementById('skills-cloud');
  const badges = document.querySelectorAll('.skill-badge');

  if (!canvas || !badges.length) return;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    badges.forEach((badge, i) => {
      const depth = (i % 3 + 1) * 0.03;
      const moveX = mouseX * depth;
      const moveY = mouseY * depth;
      badge.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  canvas.addEventListener('mouseleave', () => {
    badges.forEach(badge => {
      badge.style.transform = '';
    });
  });
}

// ==========================================================================
// 5. COPY TO CLIPBOARD UTILITY
// ==========================================================================
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('.copy-email-btn');

  copyBtns.forEach(btn => {
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
      }).catch(err => {
        console.error('Copy failed:', err);
      });
    });
  });
}
