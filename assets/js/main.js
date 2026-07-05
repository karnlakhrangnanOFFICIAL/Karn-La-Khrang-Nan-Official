// ============================================
// KANLAKHRANGNAN Official - Main JavaScript
// ============================================

// ---------- LANGUAGE SYSTEM ----------
let currentLang = 'th';
let translations = {};

// Load language file
async function loadLanguage(lang) {
  try {
    const response = await fetch(`lang/${lang}.json`);
    translations = await response.json();
    currentLang = lang;
    updateContent();
    localStorage.setItem('lang', lang);
  } catch (error) {
    console.error('Error loading language:', error);
  }
}

// Update all elements with data-i18n attribute
function updateContent() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        value = key;
        break;
      }
    }
    
    element.textContent = value;
  });

  // Update lang toggle button
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.textContent = translations?.nav?.lang_toggle || 'EN';
  }

  // Update page title
  document.title = translations?.home?.title || 'KANLAKHRANGNAN Official';
}

// Toggle language
function toggleLanguage() {
  const newLang = currentLang === 'th' ? 'en' : 'th';
  loadLanguage(newLang);
}

// ---------- MOBILE MENU ----------
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
}

// ---------- FORMAT DATE ----------
function formatDate(dateString, lang) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  
  if (lang === 'th') {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
  }
  
  return date.toLocaleDateString('en-GB', options);
}

// ---------- LOAD FIXTURES ----------
async function loadFixtures() {
  const container = document.getElementById('fixturesContainer');
  if (!container) return;

  try {
    const response = await fetch('data/combined-fixtures.json');
    const fixtures = await response.json();
    
    if (fixtures.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📅</span>
          <p data-i18n="home.no_fixtures">ไม่มีโปรแกรมแข่งขันในขณะนี้</p>
        </div>`;
      updateContent();
      return;
    }

    // Sort by date and time
    fixtures.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));

    // Show only upcoming (next 6)
    const upcomingFixtures = fixtures.filter(f => f.status === 'upcoming').slice(0, 6);
    
    container.innerHTML = upcomingFixtures.map(fixture => `
      <div class="card">
        <div class="card-header">
          <div class="card-date">
            <span class="date-icon">📅</span>
            <span>${formatDate(fixture.date, currentLang)}</span>
          </div>
          <div class="card-competition">
            ${fixture.competition_logo ? `<img src="${fixture.competition_logo}" alt="${fixture.competition}" onerror="this.style.display='none'">` : ''}
            <span>${fixture.competition}</span>
            <span class="team-badge ${fixture.team === 'women' ? 'women' : ''}">${fixture.team === 'women' ? 'W' : 'M'}</span>
          </div>
        </div>
        <div class="card-fixture">
          <div class="team">
            <img src="${fixture.home_logo}" alt="${fixture.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${fixture.home_team}</span>
          </div>
          <div class="fixture-info">
            <span class="fixture-time">${fixture.time}</span>
            <span class="fixture-vs">VS</span>
          </div>
          <div class="team">
            <img src="${fixture.away_logo}" alt="${fixture.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${fixture.away_team}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="venue-icon">📍</span>
          <span>${fixture.venue}</span>
        </div>
      </div>
    `).join('');

    updateContent();
  } catch (error) {
    console.error('Error loading fixtures:', error);
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p>ไม่สามารถโหลดข้อมูลได้</p></div>`;
  }
}

// ---------- LOAD RESULTS ----------
async function loadResults() {
  const container = document.getElementById('resultsContainer');
  if (!container) return;

  try {
    const response = await fetch('data/combined-results.json');
    const results = await response.json();
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">📊</span>
          <p data-i18n="home.no_results">ยังไม่มีผลการแข่งขัน</p>
        </div>`;
      updateContent();
      return;
    }

    // Sort by date (newest first)
    results.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Show latest 6 results
    const latestResults = results.slice(0, 6);
    
    container.innerHTML = latestResults.map(result => {
      const homeWin = result.home_score > result.away_score;
      const awayWin = result.away_score > result.home_score;
      
      return `
      <div class="card">
        <div class="card-header">
          <div class="card-date">
            <span class="date-icon">📅</span>
            <span>${formatDate(result.date, currentLang)}</span>
          </div>
          <div class="card-competition">
            <span>${result.competition}</span>
            <span class="team-badge ${result.team === 'women' ? 'women' : ''}">${result.team === 'women' ? 'W' : 'M'}</span>
          </div>
        </div>
        <div class="card-result">
          <div class="team ${homeWin ? 'winner' : 'loser'}">
            <img src="${result.home_logo}" alt="${result.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${result.home_team}</span>
          </div>
          <div class="score-display">
            <span class="score ${homeWin ? 'winner' : ''}">${result.home_score}</span>
            <span class="score-divider">-</span>
            <span class="score ${awayWin ? 'winner' : ''}">${result.away_score}</span>
          </div>
          <div class="team ${awayWin ? 'winner' : 'loser'}">
            <img src="${result.away_logo}" alt="${result.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${result.away_team}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="venue-icon">📍</span>
          <span>${result.venue}</span>
        </div>
      </div>
    `}).join('');

    updateContent();
  } catch (error) {
    console.error('Error loading results:', error);
    container.innerHTML = `<div class="empty-state"><span class="empty-icon">⚠️</span><p>ไม่สามารถโหลดข้อมูลได้</p></div>`;
  }
}

// ---------- SET ACTIVE NAV LINK ----------
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ---------- INIT ----------
async function init() {
  // Load saved language or default to Thai
  const savedLang = localStorage.getItem('lang') || 'th';
  await loadLanguage(savedLang);

  // Init mobile menu
  initMobileMenu();

  // Set active nav
  setActiveNavLink();

  // Load data
  loadFixtures();
  loadResults();

  // Lang toggle event
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);