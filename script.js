// ══════════════════════════════════════════════════════════════════════════
// Familia Burgada — Script v2
// Layout horizontal ↔ vertical, SVG bézier, zoom, colapso, búsqueda
// ══════════════════════════════════════════════════════════════════════════

const CARD_W = 210;
const CARD_H_SINGLE   = 116;
const CARD_H_MARRIAGE = 248;
const COL_GAP  = 80;
const ROW_GAP  = 14;
const TOP_PAD  = 24;
const LEFT_PAD = 24;

const GEN_COLORS = [
  { color: '#6f5b3e', bg: '#f5f0e6' },
  { color: '#4a7c59', bg: '#edf5ef' },
  { color: '#3e6b8a', bg: '#eaf1f6' },
  { color: '#7c5a8a', bg: '#f3edf6' },
  { color: '#8a5a5a', bg: '#f6edec' },
  { color: '#5a7c8a', bg: '#edf4f6' },
];
function genStyle(gen) { return GEN_COLORS[(gen ?? 0) % GEN_COLORS.length]; }

// ── State ───────────────────────────────────────────────────────────────
let peopleData = [];
let peopleById = new Map();
let childrenByParentId = new Map();
let rootTree = null;
let currentFilter = 'all';
let searchTerm = '';
let orientation = 'vertical';
let zoom = 1;

// ── Helpers ─────────────────────────────────────────────────────────────

function isBurgada(person) { return person.parentId != null; }
function isSpouse(person) { return person.parentId == null && person.partnerId != null; }

function shouldRenderAsPrimary(person) {
  if (person.partnerId) {
    const partner = peopleById.get(person.partnerId);
    if (partner) {
      if (isBurgada(person) && isSpouse(partner)) return true;
      if (isSpouse(person) && isBurgada(partner)) return false;
      return person.id < person.partnerId;
    }
  }
  return true;
}

function formatDates(person) {
  const b = person.birthDate || '';
  const d = person.deathDate || '';
  if (!b && !d) return '';
  return d ? `${b} – ${d}` : `${b} –`;
}

// ── Load data ───────────────────────────────────────────────────────────
async function loadPeople() {
  const res = await fetch('data/people.json');
  peopleData = await res.json();
  peopleById = new Map();
  childrenByParentId = new Map();
  peopleData.forEach(p => {
    peopleById.set(p.id, p);
    if (p.parentId != null) {
      if (!childrenByParentId.has(p.parentId)) childrenByParentId.set(p.parentId, []);
      childrenByParentId.get(p.parentId).push(p);
    }
  });
  const gens = [...new Set(peopleData.map(p => p.generation).filter(g => g != null))].sort((a, b) => a - b);
  const sel = document.getElementById('generation-filter');
  gens.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `Gen ${g}`;
    sel.appendChild(opt);
  });
  document.getElementById('ft-count').textContent = `${peopleData.length} personas`;
}

// ── Tree building ───────────────────────────────────────────────────────

function buildFamilyTree() {
  const roots = peopleData.filter(p => p.parentId == null && shouldRenderAsPrimary(p));
  if (roots.length === 1) return buildSubTree(roots[0]);
  return {
    id: -1, virtual: true, person: null, partner: null, isMarriage: false,
    children: roots.map(r => buildSubTree(r)), collapsed: false, generation: 0,
  };
}

function buildSubTree(person) {
  const partner = person.partnerId ? peopleById.get(person.partnerId) : null;
  let children = [];
  const ch1 = childrenByParentId.get(person.id) || [];
  const ch2 = partner ? (childrenByParentId.get(partner.id) || []) : [];
  const seen = new Set();
  [...ch1, ...ch2].forEach(c => { if (!seen.has(c.id)) { seen.add(c.id); children.push(c); } });
  const primary = children.filter(shouldRenderAsPrimary);

  // Burgada first in marriage
  let burgada = person, pareja = partner;
  if (partner && isSpouse(person) && isBurgada(partner)) { burgada = partner; pareja = person; }

  return {
    person: burgada, partner: pareja, isMarriage: !!pareja,
    children: primary.map(c => buildSubTree(c)),
    collapsed: false, generation: burgada.generation ?? 0,
  };
}

// ── Layout engine ───────────────────────────────────────────────────────

function nodeH(n) { return n.isMarriage ? CARD_H_MARRIAGE : CARD_H_SINGLE; }

function secSize(n) { return orientation === 'horizontal' ? nodeH(n) : CARD_W; }

function computeSpread(node) {
  const my = secSize(node);
  if (!node.children.length || node.collapsed) { node.spread = my; return; }
  node.children.forEach(computeSpread);
  const total = node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1);
  node.spread = Math.max(my, total);
}

function assignDepth(node, d = 0) { node.depth = d; node.children.forEach(c => assignDepth(c, d + 1)); }

// Horizontal: depth→x, spread→y
function assignPosH(node, yStart) {
  node.x = LEFT_PAD + node.depth * (CARD_W + COL_GAP);
  node.y = yStart + (node.spread - nodeH(node)) / 2;
  if (!node.children.length || node.collapsed) return;
  const total = node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1);
  let cur = yStart + (node.spread - total) / 2;
  for (const c of node.children) { assignPosH(c, cur); cur += c.spread + ROW_GAP; }
}

// Vertical: depth→y (cumulative), spread→x
function assignPosV(node, xStart, yStart) {
  node.x = xStart + (node.spread - CARD_W) / 2;
  node.y = yStart;
  if (!node.children.length || node.collapsed) return;
  const childY = yStart + nodeH(node) + COL_GAP;
  const total = node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1);
  let curX = xStart + (node.spread - total) / 2;
  for (const c of node.children) { assignPosV(c, curX, childY); curX += c.spread + ROW_GAP; }
}

function maxDepth(node) {
  if (!node.children.length || node.collapsed) return node.depth;
  return Math.max(node.depth, ...node.children.map(maxDepth));
}

function flatten(node, acc = []) {
  acc.push(node);
  if (!node.collapsed) node.children.forEach(c => flatten(c, acc));
  return acc;
}

// ── Rendering ───────────────────────────────────────────────────────────

function createPersonCard(person) {
  const gen = genStyle(person.generation);
  const photo = person.photoUrl || 'https://via.placeholder.com/46?text=' + encodeURIComponent((person.name || '?')[0]);
  const isFam = isBurgada(person) || (person.parentId == null && !person.partnerId);
  const tag = isFam
    ? `<span class="ft-burgada-tag" style="background:${gen.bg};color:${gen.color}">Burgada</span>`
    : `<span class="ft-spouse-tag">Pareja</span>`;
  return `
    <div class="ft-node-top">
      <img class="ft-node-photo" src="${photo}" alt="${person.name}" onerror="this.src='https://via.placeholder.com/46'" />
      <div class="ft-node-info">
        <div class="ft-node-name">${person.name}</div>
        <div class="ft-node-dates">${formatDates(person)}</div>
      </div>
    </div>
    <div class="ft-node-bottom">
      <span class="ft-gen-badge" style="background:${gen.bg};color:${gen.color}">Gen ${person.generation ?? '?'}</span>
      ${tag}
    </div>`;
}

function makeCollapseBtn(node) {
  const btn = document.createElement('button');
  btn.className = 'ft-collapse-btn';
  btn.title = node.collapsed ? 'Expandir' : 'Colapsar';
  btn.textContent = node.collapsed ? '+' : '−';
  btn.addEventListener('click', e => { e.stopPropagation(); node.collapsed = !node.collapsed; renderTree(); });
  return btn;
}

function renderNode(node, canvas, order) {
  if (node.virtual) return;
  const gen = genStyle(node.generation);

  if (node.isMarriage) {
    const wrap = document.createElement('div');
    wrap.className = 'ft-marriage';
    wrap.style.left = `${node.x}px`;
    wrap.style.top = `${node.y}px`;

    const c1 = document.createElement('article');
    c1.className = `ft-node ft-node-burgada ${node.person.deathDate ? 'ft-deceased' : ''}`;
    c1.style.borderTopColor = gen.color;
    c1.dataset.personId = node.person.id;
    c1.dataset.gen = node.person.generation ?? '';
    c1.innerHTML = createPersonCard(node.person);
    c1.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); });

    const ring = document.createElement('div');
    ring.className = 'ft-marriage-ring';
    ring.textContent = '♡';

    const c2 = document.createElement('article');
    c2.className = `ft-node ft-node-spouse ${node.partner.deathDate ? 'ft-deceased' : ''}`;
    c2.style.borderTopColor = '#b8ad98';
    c2.dataset.personId = node.partner.id;
    c2.dataset.gen = node.partner.generation ?? '';
    c2.innerHTML = createPersonCard(node.partner);
    c2.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.partner); });

    wrap.appendChild(c1);
    wrap.appendChild(ring);
    wrap.appendChild(c2);
    if (node.children.length) wrap.appendChild(makeCollapseBtn(node));
    canvas.appendChild(wrap);
    requestAnimationFrame(() => { c1.classList.add('ft-visible'); c2.classList.add('ft-visible'); });
  } else {
    const isFam = isBurgada(node.person) || (!node.person.partnerId && node.person.parentId == null);
    const el = document.createElement('article');
    el.className = `ft-node ${isFam ? 'ft-node-burgada' : 'ft-node-spouse'} ${node.person.deathDate ? 'ft-deceased' : ''} ${node.collapsed && node.children.length ? 'ft-collapsed' : ''}`;
    el.style.position = 'absolute';
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    el.style.borderTopColor = gen.color;
    el.style.animationDelay = `${0.03 + order * 0.015}s`;
    el.dataset.personId = node.person.id;
    el.dataset.gen = node.person.generation ?? '';
    el.innerHTML = createPersonCard(node.person);
    if (node.children.length) el.appendChild(makeCollapseBtn(node));
    el.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); });
    canvas.appendChild(el);
    requestAnimationFrame(() => el.classList.add('ft-visible'));
  }
}

// ── SVG connectors ──────────────────────────────────────────────────────

function anchorOut(node) {
  const h = nodeH(node);
  return orientation === 'horizontal'
    ? { x: node.x + CARD_W, y: node.y + h / 2 }
    : { x: node.x + CARD_W / 2, y: node.y + h };
}

function anchorIn(node) {
  const h = nodeH(node);
  return orientation === 'horizontal'
    ? { x: node.x, y: node.y + h / 2 }
    : { x: node.x + CARD_W / 2, y: node.y };
}

function connectorPath(parent, child) {
  const p = anchorOut(parent);
  const c = anchorIn(child);
  if (orientation === 'horizontal') {
    const mx = p.x + (c.x - p.x) * 0.45;
    return `M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`;
  }
  const my = p.y + (c.y - p.y) * 0.45;
  return `M ${p.x} ${p.y} C ${p.x} ${my}, ${c.x} ${my}, ${c.x} ${c.y}`;
}

function renderLinks(node, svg) {
  if (node.virtual && !node.collapsed) { node.children.forEach(c => renderLinks(c, svg)); return; }
  if (node.collapsed) return;
  for (const child of node.children) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', connectorPath(node, child));
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#b8ad98');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    renderLinks(child, svg);
  }
}

// ── Level labels (horizontal only) ──────────────────────────────────────

function renderLevelLabels(depthCount) {
  const bar = document.querySelector('.ft-level-bar');
  if (orientation === 'vertical') { if (bar) bar.style.display = 'none'; return; }

  const viewport = document.getElementById('ft-viewport');
  let colWrap = viewport.parentElement;
  if (!colWrap?.classList.contains('ft-col-wrap')) {
    const wrap = document.createElement('div');
    wrap.className = 'ft-col-wrap';
    wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;min-width:0;';
    viewport.parentElement.insertBefore(wrap, viewport);
    wrap.appendChild(viewport);
    colWrap = wrap;
  }

  let levelBar = colWrap.querySelector('.ft-level-bar');
  if (!levelBar) {
    levelBar = document.createElement('div');
    levelBar.className = 'ft-level-bar';
    const inner = document.createElement('div');
    inner.className = 'ft-level-inner';
    levelBar.appendChild(inner);
    colWrap.insertBefore(levelBar, viewport);
    viewport.addEventListener('scroll', () => {
      const inn = levelBar.querySelector('.ft-level-inner');
      if (inn) inn.style.transform = `translateX(-${viewport.scrollLeft}px)`;
    });
  }
  levelBar.style.display = '';

  const inner = levelBar.querySelector('.ft-level-inner');
  inner.innerHTML = '';
  for (let d = 0; d <= depthCount; d++) {
    const lbl = document.createElement('div');
    lbl.className = 'ft-level-label';
    lbl.style.width = `${CARD_W + COL_GAP}px`;
    lbl.style.flexShrink = '0';
    lbl.textContent = `Generación ${d}`;
    lbl.style.color = genStyle(d).color;
    inner.appendChild(lbl);
  }
}

// ── Main render ─────────────────────────────────────────────────────────

function renderTree() {
  const canvas = document.getElementById('ft-canvas');
  canvas.innerHTML = '';

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;inset:0;overflow:visible;pointer-events:none;';
  canvas.appendChild(svg);

  if (!rootTree) { canvas.innerHTML = '<div class="ft-empty">Cargando…</div>'; return; }

  computeSpread(rootTree);
  assignDepth(rootTree, 0);
  if (orientation === 'horizontal') assignPosH(rootTree, TOP_PAD);
  else assignPosV(rootTree, LEFT_PAD, TOP_PAD);

  const depth = maxDepth(rootTree);
  const nodes = flatten(rootTree);

  let w, h;
  if (orientation === 'horizontal') {
    w = LEFT_PAD * 2 + (depth + 1) * CARD_W + depth * COL_GAP + 100;
    h = TOP_PAD + rootTree.spread + 60;
  } else {
    w = LEFT_PAD * 2 + rootTree.spread + 60;
    let maxY = 0;
    nodes.forEach(n => { if (!n.virtual) { const b = n.y + nodeH(n); if (b > maxY) maxY = b; } });
    h = maxY + 80;
  }

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
  svg.setAttribute('width', w);
  svg.setAttribute('height', h);

  renderLevelLabels(depth);
  nodes.forEach((n, i) => renderNode(n, canvas, i));
  renderLinks(rootTree, svg);
  applySearchAndFilter();
}

// ── Search & filter ─────────────────────────────────────────────────────

function applySearchAndFilter() {
  const term = searchTerm.toLowerCase().trim();
  const gf = currentFilter;
  const cards = document.querySelectorAll('.ft-node');
  if (!cards.length) return;

  const active = term || gf !== 'all';
  if (!active) { cards.forEach(el => el.classList.remove('ft-highlight', 'ft-dimmed')); return; }

  cards.forEach(el => {
    const name = (el.querySelector('.ft-node-name')?.textContent || '').toLowerCase();
    const gen = el.dataset.gen || '';
    const okTerm = !term || name.includes(term);
    const okGen = gf === 'all' || gen === String(gf);
    if (okTerm && okGen) { el.classList.add('ft-highlight'); el.classList.remove('ft-dimmed'); }
    else { el.classList.remove('ft-highlight'); el.classList.add('ft-dimmed'); }
  });
}

// ── Modal ───────────────────────────────────────────────────────────────

function openModal(person) {
  const bd = document.getElementById('ft-modal-backdrop');
  const gen = genStyle(person.generation);

  document.getElementById('modal-photo').src = person.photoUrl || 'https://via.placeholder.com/72';
  document.getElementById('modal-name').textContent = person.name;
  document.getElementById('modal-dates').textContent = formatDates(person);
  document.getElementById('modal-description').textContent = person.description || '';

  const badge = document.getElementById('modal-relation');
  const isFam = isBurgada(person) || (person.parentId == null && !person.partnerId);
  badge.textContent = isFam ? 'Familia Burgada' : 'Pareja';
  badge.style.background = isFam ? gen.bg : '#f5f5f0';
  badge.style.color = isFam ? gen.color : '#8a7e6e';

  document.querySelector('.ft-modal').style.borderTopColor = gen.color;
  document.getElementById('modal-gen').textContent = `${person.generation ?? '?'}`;
  document.getElementById('modal-birthplace').textContent = person.birthPlace || '—';

  const spouse = person.partnerId ? peopleById.get(person.partnerId) : null;
  document.getElementById('modal-spouse').textContent = spouse ? spouse.name : '—';

  const ch1 = childrenByParentId.get(person.id) || [];
  const ch2 = spouse ? (childrenByParentId.get(spouse.id) || []) : [];
  document.getElementById('modal-children').textContent = [...new Set([...ch1, ...ch2].map(c => c.id))].length || '0';
  document.getElementById('modal-notes').textContent = person.notes || '—';

  bd.classList.add('open');
}

// ── Zoom ────────────────────────────────────────────────────────────────

function updateZoom(z) {
  zoom = z;
  document.getElementById('ft-canvas').style.transform = `scale(${zoom})`;
  document.getElementById('zoom-label').textContent = `${Math.round(zoom * 100)} %`;
}

// ── Init ────────────────────────────────────────────────────────────────

(async function init() {
  await loadPeople();
  rootTree = buildFamilyTree();
  renderTree();

  document.getElementById('zoom-in').addEventListener('click', () => updateZoom(Math.min(2, +(zoom + 0.1).toFixed(2))));
  document.getElementById('zoom-out').addEventListener('click', () => updateZoom(Math.max(0.2, +(zoom - 0.1).toFixed(2))));
  document.getElementById('zoom-reset').addEventListener('click', () => updateZoom(1));

  document.getElementById('orientation-toggle').addEventListener('click', () => {
    orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal';
    document.getElementById('orientation-label').textContent = orientation === 'horizontal' ? '→' : '↓';
    renderTree();
  });

  const bd = document.getElementById('ft-modal-backdrop');
  bd.addEventListener('click', e => { if (e.target === bd) bd.classList.remove('open'); });
  document.getElementById('ft-modal-close').addEventListener('click', () => bd.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') bd.classList.remove('open'); });

  document.getElementById('generation-filter').addEventListener('change', e => { currentFilter = e.target.value; applySearchAndFilter(); });
  document.getElementById('ft-search-input').addEventListener('input', e => { searchTerm = e.target.value; applySearchAndFilter(); });

  document.getElementById('request-toggle').addEventListener('click', () => {
    document.getElementById('request-body').classList.toggle('hidden');
    document.getElementById('request-chevron').classList.toggle('open');
  });

  document.getElementById('request-form').addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      reportedBy: document.getElementById('req-reporter').value.trim(),
      reportedAt: new Date().toISOString(),
      type: document.getElementById('req-type').value,
      relatedPerson: { id: document.getElementById('req-person-id').value.trim() || null, nameOrReference: document.getElementById('req-person-name').value.trim() || null },
      details: document.getElementById('req-details').value.trim(),
    };
    document.getElementById('request-output').textContent = 'Solicitud generada:\n\n' + JSON.stringify(payload, null, 2);
    document.getElementById('request-form').reset();
  });
})();
