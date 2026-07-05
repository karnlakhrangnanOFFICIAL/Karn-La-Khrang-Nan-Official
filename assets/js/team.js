// ============================================
// KANLAKHRANGNAN Official - Team Page JS
// ============================================

// ---------- TAB SYSTEM ----------
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active from all buttons
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const targetTab = document.getElementById('tab-' + tabName);
  if (targetTab) {
    targetTab.classList.add('active');
  }
  
  // Activate button by data-tab attribute
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });
}

// ---------- INIT TAB CLICK EVENTS ----------
function initTabButtons() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      if (tabName) {
        showTab(tabName);
      }
    });
  });
}

// ---------- FORMAT DATE ----------
function formatDate(dateString, lang) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (lang === 'th') {
    const thaiMonths = [
      'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
      'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];
    const thaiYear = date.getFullYear() + 543;
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`;
  }

  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// ============================================
// MEN'S TEAM FUNCTIONS
// ============================================

async function loadMenFixtures() {
  const container = document.getElementById('menFixturesContainer');
  if (!container) return;
  
  try {
    const response = await fetch('data/fixtures-men.json');
    const data = await response.json();
    
    let allFixtures = [];
    for (const competition in data) {
      if (Array.isArray(data[competition])) {
        data[competition].forEach(match => {
          allFixtures.push({ ...match, competition_name: competition });
        });
      }
    }
    
    const upcoming = allFixtures
      .filter(m => m.status === 'upcoming')
      .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));
    
    if (upcoming.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    
    container.innerHTML = upcoming.map(match => {
      const compLogo = match.competition_logo || '';
      return `
      <div class="card">
        <div class="card-header">
          <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(match.date, 'th')}</span></div>
          <div class="card-competition">
            ${compLogo ? `<img src="${compLogo}" alt="" onerror="this.style.display='none'" style="height:20px;">` : ''}
            <span>${match.competition_name.replace(/-/g, ' ').toUpperCase()}</span>
            <span class="team-badge">M</span>
          </div>
        </div>
        <div class="card-fixture">
          <div class="team">
            <img src="${match.home_logo}" alt="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.home_team}</span>
          </div>
          <div class="fixture-info">
            ${compLogo ? `<img src="${compLogo}" alt="" class="fixture-comp-logo" onerror="this.style.display='none'">` : `<span class="fixture-time">${match.time === '00:00' || !match.time ? 'TBA' : match.time.substring(0, 5)}</span>`}
            <span class="fixture-vs">VS</span>
          </div>
          <div class="team">
            <img src="${match.away_logo}" alt="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.away_team}</span>
          </div>
        </div>
        <div class="card-footer"><span class="venue-icon">📍</span><span>${match.venue}</span></div>
      </div>
    `}).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading fixtures</p></div>';
  }
}

async function loadMenResults() {
  const container = document.getElementById('menResultsContainer');
  if (!container) return;

  try {
    const response = await fetch('data/fixtures-men.json');
    const data = await response.json();
    
    let allMatches = [];
    for (const competition in data) {
      if (Array.isArray(data[competition])) {
        data[competition].forEach(match => {
          allMatches.push({ ...match, competition_name: competition });
        });
      }
    }
    
    const results = allMatches
      .filter(m => m.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    
    container.innerHTML = results.map(match => {
      const homeWin = match.home_score > match.away_score;
      const awayWin = match.away_score > match.home_score;
      return `
      <div class="card">
        <div class="card-header">
          <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(match.date, 'th')}</span></div>
          <div class="card-competition">
            ${match.competition_logo ? `<img src="${match.competition_logo}" alt="" onerror="this.style.display='none'" style="height:20px;">` : ''}
            <span>${match.competition_name.replace(/-/g, ' ').toUpperCase()}</span>
            <span class="team-badge">M</span>
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
        <div class="card-footer"><span class="venue-icon">📍</span><span>${match.venue}</span></div>
      </div>
    `}).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading results</p></div>';
  }
}

async function loadMenTable() {
  const container = document.getElementById('menTableContainer');
  if (!container) return;

  try {
    const response = await fetch('data/tables-men.json');
    const data = await response.json();
    
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    
    if (table.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="league-table">
        <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr></thead>
        <tbody>
          ${table.map(row => `
            <tr class="${row.team === 'Chelsea' ? 'highlight' : ''}">
              <td>${row.pos}</td>
              <td class="team-cell">${row.logo ? `<img src="${row.logo}" alt="" style="height:20px;vertical-align:middle;margin-right:8px;" onerror="this.style.display='none'">` : ''}${row.team}</td>
              <td>${row.p}</td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td>
              <td>${row.gf}</td><td>${row.ga}</td><td>${row.gd}</td>
              <td><strong>${row.pts}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading table</p></div>';
  }
}

async function loadMenPlayers() {
  const container = document.getElementById('menPlayersContainer');
  if (!container) return;

  try {
    const response = await fetch('data/players-men.json');
    const players = await response.json();
    
    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No player data yet</p></div>';
      return;
    }
    
    container.innerHTML = players.map(p => `
      <div class="player-card">
        <img src="${p.image || 'assets/images/placeholder-player.svg'}" alt="${p.name}" onerror="this.src='assets/images/placeholder-player.svg'">
        <div class="player-info">
          <h3>${p.name}</h3>
          <span class="player-number">#${p.number || '?'}</span>
          <span class="player-position">${p.position || 'N/A'}</span>
          <div class="player-stats">
            <span>⚽ ${p.goals || 0} goals</span>
            <span>🎯 ${p.assists || 0} assists</span>
            <span>👕 ${p.appearances || 0} apps</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
  }
}

// ============================================
// WOMEN'S TEAM FUNCTIONS
// ============================================

async function loadWomenFixtures() {
  const container = document.getElementById('womenFixturesContainer');
  if (!container) return;
  
  try {
    const response = await fetch('data/fixtures-women.json');
    const data = await response.json();
    
    let allFixtures = [];
    for (const competition in data) {
      if (Array.isArray(data[competition])) {
        data[competition].forEach(match => {
          allFixtures.push({ ...match, competition_name: competition });
        });
      }
    }
    
    const upcoming = allFixtures
      .filter(m => m.status === 'upcoming')
      .sort((a, b) => new Date(a.date + 'T' + (a.time || '00:00')) - new Date(b.date + 'T' + (b.time || '00:00')));
    
    if (upcoming.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📅</span><p>No upcoming fixtures</p></div>';
      return;
    }
    
    container.innerHTML = upcoming.map(match => {
      const compLogo = match.competition_logo || '';
      return `
      <div class="card">
        <div class="card-header">
          <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(match.date, 'th')}</span></div>
          <div class="card-competition">
            ${compLogo ? `<img src="${compLogo}" alt="" onerror="this.style.display='none'" style="height:20px;">` : ''}
            <span>${match.competition_name.replace(/-/g, ' ').toUpperCase()}</span>
            <span class="team-badge women">W</span>
          </div>
        </div>
        <div class="card-fixture">
          <div class="team">
            <img src="${match.home_logo}" alt="${match.home_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.home_team}</span>
          </div>
          <div class="fixture-info">
            ${compLogo ? `<img src="${compLogo}" alt="" class="fixture-comp-logo" onerror="this.style.display='none'">` : `<span class="fixture-time">${match.time === '00:00' || !match.time ? 'TBA' : match.time.substring(0, 5)}</span>`}
            <span class="fixture-vs">VS</span>
          </div>
          <div class="team">
            <img src="${match.away_logo}" alt="${match.away_team}" onerror="this.src='assets/images/placeholder-team.svg'">
            <span class="team-name">${match.away_team}</span>
          </div>
        </div>
        <div class="card-footer"><span class="venue-icon">📍</span><span>${match.venue}</span></div>
      </div>
    `}).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading fixtures</p></div>';
  }
}

async function loadWomenResults() {
  const container = document.getElementById('womenResultsContainer');
  if (!container) return;

  try {
    const response = await fetch('data/fixtures-women.json');
    const data = await response.json();
    
    let allMatches = [];
    for (const competition in data) {
      if (Array.isArray(data[competition])) {
        data[competition].forEach(match => {
          allMatches.push({ ...match, competition_name: competition });
        });
      }
    }
    
    const results = allMatches
      .filter(m => m.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (results.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">📊</span><p>No results yet</p></div>';
      return;
    }
    
    container.innerHTML = results.map(match => {
      const homeWin = match.home_score > match.away_score;
      const awayWin = match.away_score > match.home_score;
      return `
      <div class="card">
        <div class="card-header">
          <div class="card-date"><span class="date-icon">📅</span><span>${formatDate(match.date, 'th')}</span></div>
          <div class="card-competition">
            ${match.competition_logo ? `<img src="${match.competition_logo}" alt="" onerror="this.style.display='none'" style="height:20px;">` : ''}
            <span>${match.competition_name.replace(/-/g, ' ').toUpperCase()}</span>
            <span class="team-badge women">W</span>
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
        <div class="card-footer"><span class="venue-icon">📍</span><span>${match.venue}</span></div>
      </div>
    `}).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading results</p></div>';
  }
}

async function loadWomenTable() {
  const container = document.getElementById('womenTableContainer');
  if (!container) return;

  try {
    const response = await fetch('data/tables-women.json');
    const data = await response.json();
    
    const table = Array.isArray(data) ? data : (data.standings || data.table || []);
    
    if (table.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">🏆</span><p>No table data yet</p></div>';
      return;
    }

    container.innerHTML = `
      <table class="league-table">
        <thead><tr><th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>PTS</th></tr></thead>
        <tbody>
          ${table.map(row => `
            <tr class="${row.team === 'Chelsea' || row.team === 'Chelsea Women' ? 'highlight' : ''}">
              <td>${row.pos}</td>
              <td class="team-cell">${row.logo ? `<img src="${row.logo}" alt="" style="height:20px;vertical-align:middle;margin-right:8px;" onerror="this.style.display='none'">` : ''}${row.team}</td>
              <td>${row.p}</td><td>${row.w}</td><td>${row.d}</td><td>${row.l}</td>
              <td>${row.gf}</td><td>${row.ga}</td><td>${row.gd}</td>
              <td><strong>${row.pts}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading table</p></div>';
  }
}

async function loadWomenPlayers() {
  const container = document.getElementById('womenPlayersContainer');
  if (!container) return;

  try {
    const response = await fetch('data/players-women.json');
    const players = await response.json();
    
    if (!Array.isArray(players) || players.length === 0) {
      container.innerHTML = '<div class="empty-state"><span class="empty-icon">👕</span><p>No player data yet</p></div>';
      return;
    }
    
    container.innerHTML = players.map(p => `
      <div class="player-card">
        <img src="${p.image || 'assets/images/placeholder-player.svg'}" alt="${p.name}" onerror="this.src='assets/images/placeholder-player.svg'">
        <div class="player-info">
          <h3>${p.name}</h3>
          <span class="player-number">#${p.number || '?'}</span>
          <span class="player-position">${p.position || 'N/A'}</span>
          <div class="player-stats">
            <span>⚽ ${p.goals || 0} goals</span>
            <span>🎯 ${p.assists || 0} assists</span>
            <span>👕 ${p.appearances || 0} apps</span>
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    container.innerHTML = '<div class="empty-state"><span class="empty-icon">⚠️</span><p>Error loading players</p></div>';
  }
}

// ============================================
// INIT
// ============================================

function initTeamPage() {
  const isWomenPage = window.location.pathname.includes('women');

  // ✅ เปิดใช้ Tab
  initTabButtons();

  if (isWomenPage) {
    loadWomenFixtures();
    loadWomenResults();
    loadWomenTable();
    loadWomenPlayers();
  } else {
    loadMenFixtures();
    loadMenResults();
    loadMenTable();
    loadMenPlayers();
  }
}

document.addEventListener('DOMContentLoaded', initTeamPage);