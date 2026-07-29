// ============================================
// KARN LA KHRANg NAN Official - Team Page JS
// ============================================

const API_PLAYERS_MEN = 'https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=men';
const API_PLAYERS_WOMEN = 'https://script.google.com/macros/s/AKfycbx1XcMAxsYaTm7AvRPg8q1CtiyXrCJXp27LX-Lh5V36JdBWPF87yXuyhkZm6hqwJAU3/exec?team=women';

// ---------- TAB SYSTEM ----------
function showTab(tabName) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  const targetTab = document.getElementById('tab-' + tabName);
  if (targetTab) targetTab.classList.add('active');
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) btn.classList.add('active');
  });
}

function initTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const tabName = this.getAttribute('data-tab');
      if (tabName) showTab(tabName);
    });
  });
}

// ---------- FORMAT DATE ----------
function formatDate(dateString, lang) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  if (lang === 'th') {
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  }
  return date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function formatCompetitionName(name) {
  if (!name) return '';
  return name.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// ---------- RENDER FUNCTIONS ----------
function renderFixtures(container, fixtures, badgeClass) {
  if (!container) return;
  if (fixtures.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
    return;
  }
  container.innerHTML = fixtures.map(match => {
    const compLogo = match.competition_logo || '';
    const compName = formatCompetitionName(match.competition_name || match.competition);
    const displayTime = (match.time === '00:00' || match.time === 'TBC' || !match.time) ? 'TBC' : match.time.substring(0, 5);
    const channelsIcons = (match.channels && match.channels.length > 0)
      ? `<div class="channels-list channels-icons-only">${match.channels.map(ch => 
          `<span class="channel-badge" title="${ch.name}">
            ${ch.logo ? `<img src="${ch.logo}" alt="${ch.name}" class="channel-logo" onerror="this.style.display='none'">` : ''}
            <span class="channel-name" style="display:none;">${ch.name}</span>
          </span>`
        ).join('')}</div>`
      : '';

    return `
    <a href="match-detail.html?id=${match.id}" class="card-link">
      <div class="card fixture-card-mobile">
        <div class="match-meta">
          <span>${formatDate(match.date, 'th')}</span>
          <span>· ${displayTime}</span>
          <span>· ${compName}</span>
          <span>📍 ${match.venue}</span>
        </div>
        <div class="match-versus">
          <div class="team-block">
            <img src="${match.home_logo}" alt="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span>${match.home_team}</span>
          </div>
          <div class="vs-text">VS</div>
          <div class="team-block">
            <img src="${match.away_logo}" alt="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span>${match.away_team}</span>
          </div>
        </div>
        <div class="match-channels">
          ${channelsIcons}
        </div>
      </div>
    </a>`;
  }).join('');
}

function renderResults(container, results, badgeClass) {
  if (!container) return;
  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
    return;
  }
  container.innerHTML = results.map(match => {
    const homeWin = match.home_score > match.away_score;
    const awayWin = match.away_score > match.home_score;
    const compName = formatCompetitionName(match.competition_name || match.competition);
    return `
    <a href="match-detail.html?id=${match.id}" class="card-link">
      <div class="card">
        <div class="card-header">
          <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(match.date, 'th')}</span></div>
          <div class="card-competition">
            ${match.competition_logo ? `<img src="${match.competition_logo}" alt="" onerror="this.style.display='none'" style="height:20px;">` : ''}
            <span>${compName}</span>
            <span class="team-badge ${badgeClass === 'W' ? 'women' : ''}">${badgeClass}</span>
          </div>
        </div>
        <div class="card-result">
          <div class="team ${homeWin ? 'winner' : ''}">
            <img src="${match.home_logo}" alt="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.home_team}</span>
          </div>
          <div class="score-display">
            <span class="score ${homeWin ? 'winner' : ''}">${match.home_score}</span>
            <span class="score-divider">-</span>
            <span class="score ${awayWin ? 'winner' : ''}">${match.away_score}</span>
          </div>
          <div class="team ${awayWin ? 'winner' : ''}">
            <img src="${match.away_logo}" alt="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.away_team}</span>
          </div>
        </div>
        <div class="card-footer">
          <span class="venue-icon">📍</span>
          <span>${match.venue}</span>
        </div>
      </div>
    </a>`;
  }).join('');
}

function renderTable(container, table, highlightTeam) {
  if (table.length === 0) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
    return;
  }
  container.innerHTML = `
    <table class="league-table">
      <thead><tr><th>#</th><th>Logo</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr></thead>
      <tbody>
        ${table.map(row => `
          <tr class="${row.team === highlightTeam ? 'highlight' : ''}">
            <td>${row.pos}</td>
            <td class="logo-cell">${row.logo ? `<img src="${row.logo}" alt="${row.team}" style="height:24px;width:auto;" onerror="this.style.display='none'">` : ''}</td>
            <td class="team-cell">${row.team}</td>
            <td>${row.p}</td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td>
            <td>${row.gf}</td><td>${row.ga}</td><td>${row.gd}</td>
            <td><strong>${row.pts}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function renderPlayers(container, players) {
  container.innerHTML = players.map(p => `
    <div class="player-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='assets/images/placeholder-player.svg'">
      <div class="player-info">
        <h3>${p.name}</h3>
        <span class="player-number">#${p.number || '?'}</span>
        <span class="player-position">${p.position}</span>
        <div class="player-stats">
          <span>⚽ ${p.goals || 0} goals</span>
          <span>🎯 ${p.assists || 0} assists</span>
          <span>👕 ${p.appearances || 0} apps</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ---------- LOAD DATA ----------
async function loadMenFixtures() {
  const container = document.getElementById('menFixturesContainer');
  if (!container) return;
  try {
    const res = await fetch('data/fixtures-men.json');
    const data = await res.json();
    let all = [];
    for (const comp in data) {
      if (Array.isArray(data[comp])) {
        data[comp].forEach(m => all.push({ ...m, competition_name: comp }));
      }
    }
    const upcoming = all.filter(m => m.status === 'upcoming').sort((a,b) => new Date(a.date+'T'+(a.time||'00:00')) - new Date(b.date+'T'+(b.time||'00:00')));
    renderFixtures(container, upcoming, 'M');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading fixtures</p></div>';
    console.error('Fixtures error:', e);
  }
}

async function loadMenResults() {
  const container = document.getElementById('menResultsContainer');
  if (!container) return;
  try {
    const res = await fetch('data/fixtures-men.json');
    const data = await res.json();
    let all = [];
    for (const comp in data) {
      if (Array.isArray(data[comp])) {
        data[comp].forEach(m => all.push({ ...m, competition_name: comp }));
      }
    }
    const results = all.filter(m => m.status === 'completed').sort((a,b) => new Date(b.date) - new Date(a.date));
    renderResults(container, results, 'M');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading results</p></div>';
    console.error('Results error:', e);
  }
}

async function loadMenTable() {
  const container = document.getElementById('menTableContainer');
  if (!container) return;
  try {
    const res = await fetch('data/tables-men.json');
    const data = await res.json();
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    renderTable(container, table, 'Chelsea');
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading table</p></div>';
    console.error('Table error:', e);
  }
}

async function loadMenPlayers() {
  const container = document.getElementById('menPlayersContainer');
  if (!container) return;
  try {
    const res = await fetch(API_PLAYERS_MEN);
    const players = await res.json();
    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }
    renderPlayers(container, players);
  } catch(e) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
    console.error('Players error:', e);
  }
}

// Women functions similar
async function loadWomenFixtures() {
  const container = document.getElementById('womenFixturesContainer');
  if (!container) return;
  try {
    const res = await fetch('data/fixtures-women.json');
    const data = await res.json();
    let all = [];
    for (const comp in data) { if (Array.isArray(data[comp])) data[comp].forEach(m => all.push({ ...m, competition_name: comp })); }
    renderFixtures(container, all.filter(m => m.status === 'upcoming').sort((a,b) => new Date(a.date+'T'+(a.time||'00:00')) - new Date(b.date+'T'+(b.time||'00:00'))), 'W');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenResults() {
  const container = document.getElementById('womenResultsContainer');
  if (!container) return;
  try {
    const res = await fetch('data/fixtures-women.json');
    const data = await res.json();
    let all = [];
    for (const comp in data) { if (Array.isArray(data[comp])) data[comp].forEach(m => all.push({ ...m, competition_name: comp })); }
    renderResults(container, all.filter(m => m.status === 'completed').sort((a,b) => new Date(b.date)-new Date(a.date)), 'W');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenTable() {
  const container = document.getElementById('womenTableContainer');
  if (!container) return;
  try {
    const res = await fetch('data/tables-women.json');
    const data = await res.json();
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    renderTable(container, table, 'Chelsea Women');
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

async function loadWomenPlayers() {
  const container = document.getElementById('womenPlayersContainer');
  if (!container) return;
  try {
    const res = await fetch('data/players-women.json');
    const players = await res.json();
    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No players found</p></div>';
      return;
    }
    renderPlayers(container, players);
  } catch(e) { container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error</p></div>'; console.error(e); }
}

function initTeamPage() {
  const isWomenPage = window.location.pathname.includes('women');
  initTabButtons();
  if (isWomenPage) {
    loadWomenFixtures(); loadWomenResults(); loadWomenTable(); loadWomenPlayers();
  } else {
    loadMenFixtures(); loadMenResults(); loadMenTable(); loadMenPlayers();
  }
}

document.addEventListener('DOMContentLoaded', initTeamPage);
