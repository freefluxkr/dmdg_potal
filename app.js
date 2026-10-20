/**
 * DMDG LIVE - Official Master Portal Hub Client Logic
 * Features: Live Search, Category Tabs, Theme Switcher (Light/Dark), Shortcut Keys
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elements
  const body = document.body;
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  const searchInput = document.getElementById('searchInput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const sectionBlocks = document.querySelectorAll('.section-block');
  const serviceCards = document.querySelectorAll('.service-card');
  const statusCounter = document.getElementById('statusCounter');

  // 2. Theme Management (Light by default as per Mockup 1, toggle to Mockup 2 Dark)
  const savedTheme = localStorage.getItem('dmdg_portal_theme') || 'theme-light';
  applyTheme(savedTheme);

  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
    const nextTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    applyTheme(nextTheme);
    localStorage.setItem('dmdg_portal_theme', nextTheme);
  });

  function applyTheme(theme) {
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add(theme);

    if (theme === 'theme-dark') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = '라이트';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = '다크';
    }
  }

  // 3. Category Tab Filtering
  let activeCategory = 'all';

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeCategory = btn.dataset.filter;
      applyFilterAndSearch();
    });
  });

  // 4. Live Search Input
  searchInput.addEventListener('input', () => {
    applyFilterAndSearch();
  });

  // 5. Filter & Search Combined Logic
  function applyFilterAndSearch() {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCardCount = 0;

    sectionBlocks.forEach(sec => {
      const secCategory = sec.dataset.category;
      const cards = sec.querySelectorAll('.service-card');
      let sectionHasVisibleCard = false;

      cards.forEach(card => {
        const cardTitle = (card.dataset.title || '').toLowerCase();
        const cardText = card.textContent.toLowerCase();

        const matchesCategory = (activeCategory === 'all' || secCategory === activeCategory);
        const matchesQuery = !query || cardTitle.includes(query) || cardText.includes(query);

        if (matchesCategory && matchesQuery) {
          card.style.display = 'flex';
          sectionHasVisibleCard = true;
          visibleCardCount++;
        } else {
          card.style.display = 'none';
        }
      });

      // Show or hide section container based on whether it has visible cards
      if (sectionHasVisibleCard) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });

    // Update Status Counter
    if (query) {
      statusCounter.textContent = `검색 결과: ${visibleCardCount}개 서비스 발견`;
    } else if (activeCategory !== 'all') {
      statusCounter.textContent = `현재 카테고리: ${visibleCardCount}개 서비스`;
    } else {
      statusCounter.textContent = `운영 서비스 7개 | 시뮬레이터 26개 | 출판 15종`;
    }
  }

  // 6. Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    // Press '/' to focus search
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    // Press 'Escape' to clear search
    if (e.key === 'Escape' && document.activeElement === searchInput) {
      searchInput.value = '';
      applyFilterAndSearch();
      searchInput.blur();
    }
  });

  // Initial calculation
  applyFilterAndSearch();
});
