// ============================================
// KARN LA KHRANg NAN Official - Main JS
// ============================================

let currentLang = localStorage.getItem('lang') || 'th';
let translations = {};

async function loadLanguage(lang) {
  try {
    const res = await fetch(`lang/${lang}.json`);
    translations = await res.json();
    currentLang = lang;
    updateUIText();
    localStorage.setItem('lang', lang);
  } catch (e) {
    console.error('Failed to load language:', e);
  }
}

function updateUIText() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const keys = key.split('.');
    let value = translations;
    for (const k of keys) {
      if (value && value[k] !== undefined) value = value[k];
      else { value = key; break; }
    }
    if (value !== key) el.textContent = value;
  });

  const langToggle = document.getElementById('langToggle');
  if (langToggle && translations?.nav?.lang_toggle) {
    langToggle.textContent = translations.nav.lang_toggle;
  }
}

function toggleLanguage() {
  const newLang = currentLang === 'th' ? 'en' : 'th';
  loadLanguage(newLang);
}

// Mobile Menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadLanguage(currentLang);
  initMobileMenu();

  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', toggleLanguage);
  }
});