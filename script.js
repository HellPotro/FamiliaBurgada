// Familia Burgada — Script v6

const ADMIN_EMAIL = 'albertoburgada@gmail.com'; // ← CAMBIAR

const CARD_W = 210, CARD_H_SINGLE = 116, CARD_H_MARRIAGE = 248;
const COL_GAP = 80, ROW_GAP = 14, TOP_PAD = 24, LEFT_PAD = 24;

const GEN_COLORS = [
  { color: '#6f5b3e', bg: '#f5f0e6' }, { color: '#4a7c59', bg: '#edf5ef' },
  { color: '#3e6b8a', bg: '#eaf1f6' }, { color: '#7c5a8a', bg: '#f3edf6' },
  { color: '#8a5a5a', bg: '#f6edec' }, { color: '#5a7c8a', bg: '#edf4f6' },
];
function genStyle(g) { return GEN_COLORS[(g ?? 0) % GEN_COLORS.length]; }

let peopleData = [], peopleById = new Map(), childrenByParentId = new Map();
let rootTree = null, currentFilter = 'all', searchTerm = '';
let orientation = 'vertical', zoom = 1;
let personElements = new Map(), edgeElements = new Map(), treeNodeByPersonId = new Map();

// Highlight mode: 'lineage' | 'descendants' | null
let highlightMode = null;
let highlightPersonIds = null; // Set<number>
let highlightEdges = null;     // Set<string>

// ── Helpers ─────────────────────────────────────────────────────────────

function isBurgada(p) { return p.parentId != null; }
function isSpouse(p) { return p.parentId == null && p.partnerId != null; }

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

function formatDates(p) { const b = p.birthDate || '', d = p.deathDate || ''; if (!b && !d) return ''; return d ? `${b} – ${d}` : `${b} –`; }

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length === 1 ? parts[0][0].toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avatarHTML(person, size) {
  const s = size || 46, g = genStyle(person.generation);
  if (person.photoUrl) {
    return `<img class="ft-avatar-img" style="width:${s}px;height:${s}px" src="${person.photoUrl}" alt="${person.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="ft-avatar-initials" style="width:${s}px;height:${s}px;display:none;background:${g.bg};color:${g.color}">${getInitials(person.name)}</div>`;
  }
  return `<div class="ft-avatar-initials" style="width:${s}px;height:${s}px;background:${g.bg};color:${g.color}">${getInitials(person.name)}</div>`;
}

// ── Load ────────────────────────────────────────────────────────────────

async function loadPeople() {
  peopleData = await (await fetch('data/people.json')).json();
  peopleById = new Map(); childrenByParentId = new Map();
  peopleData.forEach(p => {
    peopleById.set(p.id, p);
    if (p.parentId != null) { if (!childrenByParentId.has(p.parentId)) childrenByParentId.set(p.parentId, []); childrenByParentId.get(p.parentId).push(p); }
  });
  const gens = [...new Set(peopleData.map(p => p.generation).filter(g => g != null))].sort((a, b) => a - b);
  const sel = document.getElementById('generation-filter');
  gens.forEach(g => { const o = document.createElement('option'); o.value = String(g); o.textContent = `Gen ${g}`; sel.appendChild(o); });
  document.getElementById('ft-count').textContent = `${peopleData.length} personas`;
}

// ── Tree ────────────────────────────────────────────────────────────────

function buildFamilyTree() {
  const roots = peopleData.filter(p => p.parentId == null && shouldRenderAsPrimary(p));
  let tree;
  if (roots.length === 1) tree = buildSubTree(roots[0], null);
  else { tree = { id: -1, virtual: true, person: null, partner: null, isMarriage: false, children: roots.map(r => buildSubTree(r, null)), collapsed: false, generation: 0, parentTreeNode: null }; tree.children.forEach(c => c.parentTreeNode = tree); }
  treeNodeByPersonId = new Map(); indexTreeNodes(tree);
  return tree;
}

function buildSubTree(person, parentTreeNode) {
  const partner = person.partnerId ? peopleById.get(person.partnerId) : null;
  const ch1 = childrenByParentId.get(person.id) || [], ch2 = partner ? (childrenByParentId.get(partner.id) || []) : [];
  const seen = new Set(), children = [];
  [...ch1, ...ch2].forEach(c => { if (!seen.has(c.id)) { seen.add(c.id); children.push(c); } });
  let burgada = person, pareja = partner;
  if (partner && isSpouse(person) && isBurgada(partner)) { burgada = partner; pareja = person; }
  const node = { person: burgada, partner: pareja, isMarriage: !!pareja, children: [], collapsed: false, generation: burgada.generation ?? 0, parentTreeNode };
  node.children = children.filter(shouldRenderAsPrimary).map(c => buildSubTree(c, node));
  return node;
}

function indexTreeNodes(node) {
  if (node.person) treeNodeByPersonId.set(node.person.id, node);
  if (node.partner) treeNodeByPersonId.set(node.partner.id, node);
  node.children.forEach(indexTreeNodes);
}

// ── Lineage (up to root) ────────────────────────────────────────────────

function computeLineagePath(personId) {
  const pids = new Set(), edges = new Set();
  let tn = treeNodeByPersonId.get(personId);
  while (tn) {
    if (tn.person) pids.add(tn.person.id);
    if (tn.partner) pids.add(tn.partner.id);
    const parent = tn.parentTreeNode;
    if (parent && !parent.virtual && parent.person && tn.person) edges.add(`${parent.person.id}-${tn.person.id}`);
    tn = parent;
  }
  return { personIds: pids, edges };
}

function getLineageNames(personId) {
  const names = [];
  const person = peopleById.get(personId);
  if (person) names.push(person.name);
  let tn = treeNodeByPersonId.get(personId);
  if (tn) { let w = tn.parentTreeNode; while (w) { if (!w.virtual && w.person) names.push(w.person.name); w = w.parentTreeNode; } }
  return names;
}

// ── Descendants (down from node) ────────────────────────────────────────

function computeDescendantsPath(personId) {
  const pids = new Set(), edges = new Set();
  const tn = treeNodeByPersonId.get(personId);
  if (!tn) return { personIds: pids, edges };

  function walk(node) {
    if (node.person) pids.add(node.person.id);
    if (node.partner) pids.add(node.partner.id);
    for (const child of node.children) {
      if (node.person && child.person) edges.add(`${node.person.id}-${child.person.id}`);
      walk(child);
    }
  }
  walk(tn);
  return { personIds: pids, edges };
}

function countDescendants(personId) {
  const { personIds } = computeDescendantsPath(personId);
  // Subtract the person themselves and their partner
  const tn = treeNodeByPersonId.get(personId);
  let self = 1;
  if (tn && tn.partner) self = 2;
  return Math.max(0, personIds.size - self);
}

// ── Highlight activation ────────────────────────────────────────────────

function activateHighlight(mode, personId) {
  const result = mode === 'lineage' ? computeLineagePath(personId) : computeDescendantsPath(personId);
  highlightMode = mode;
  highlightPersonIds = result.personIds;
  highlightEdges = result.edges;

  const person = peopleById.get(personId);
  const bar = document.getElementById('ft-filter-bar');
  const text = document.getElementById('ft-filter-text');

  if (mode === 'lineage') {
    const names = getLineageNames(personId);
    text.textContent = '🌳 Linaje: ' + names.join('  →  ');
  } else {
    text.textContent = `👨‍👩‍👧‍👦 Descendientes de ${person?.name || '?'} (${countDescendants(personId)} personas)`;
  }
  bar.classList.remove('hidden');
  applyVisualState();
}

function clearHighlight() {
  highlightMode = null; highlightPersonIds = null; highlightEdges = null;
  document.getElementById('ft-filter-bar').classList.add('hidden');
  applyVisualState();
}

// ── Layout ──────────────────────────────────────────────────────────────

function nodeH(n) { return n.isMarriage ? CARD_H_MARRIAGE : CARD_H_SINGLE; }
function secSize(n) { return orientation === 'horizontal' ? nodeH(n) : CARD_W; }

function computeSpread(node) {
  const my = secSize(node);
  if (!node.children.length || node.collapsed) { node.spread = my; return; }
  node.children.forEach(computeSpread);
  node.spread = Math.max(my, node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1));
}

function assignDepth(node, d = 0) { node.depth = d; node.children.forEach(c => assignDepth(c, d + 1)); }

function assignPosH(node, yStart) {
  node.x = LEFT_PAD + node.depth * (CARD_W + COL_GAP); node.y = yStart + (node.spread - nodeH(node)) / 2;
  if (!node.children.length || node.collapsed) return;
  const total = node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1);
  let cur = yStart + (node.spread - total) / 2;
  for (const c of node.children) { assignPosH(c, cur); cur += c.spread + ROW_GAP; }
}

function assignPosV(node, xStart, yStart) {
  node.x = xStart + (node.spread - CARD_W) / 2; node.y = yStart;
  if (!node.children.length || node.collapsed) return;
  const childY = yStart + nodeH(node) + COL_GAP;
  const total = node.children.reduce((s, c) => s + c.spread, 0) + ROW_GAP * (node.children.length - 1);
  let curX = xStart + (node.spread - total) / 2;
  for (const c of node.children) { assignPosV(c, curX, childY); curX += c.spread + ROW_GAP; }
}

function maxDepth(node) { if (!node.children.length || node.collapsed) return node.depth; return Math.max(node.depth, ...node.children.map(maxDepth)); }
function flatten(node, acc = []) { acc.push(node); if (!node.collapsed) node.children.forEach(c => flatten(c, acc)); return acc; }

// ── Rendering ───────────────────────────────────────────────────────────

function createPersonCard(person) {
  const gen = genStyle(person.generation);
  const isFam = isBurgada(person) || (person.parentId == null && !person.partnerId);
  const tag = isFam ? `<span class="ft-burgada-tag" style="background:${gen.bg};color:${gen.color}">Burgada</span>` : `<span class="ft-spouse-tag">Pareja</span>`;
  return `<div class="ft-node-top"><div class="ft-node-avatar">${avatarHTML(person, 46)}</div><div class="ft-node-info"><div class="ft-node-name">${person.name}</div><div class="ft-node-dates">${formatDates(person)}</div></div></div><div class="ft-node-bottom"><span class="ft-gen-badge" style="background:${gen.bg};color:${gen.color}">Gen ${person.generation ?? '?'}</span>${tag}</div>`;
}

function makeCollapseBtn(node) {
  const btn = document.createElement('button'); btn.className = 'ft-collapse-btn';
  btn.textContent = node.collapsed ? '+' : '−';
  btn.addEventListener('click', e => { e.stopPropagation(); node.collapsed = !node.collapsed; renderTree(); });
  return btn;
}

function registerEl(pid, el) { if (!personElements.has(pid)) personElements.set(pid, []); personElements.get(pid).push(el); }

function renderNode(node, canvas, order) {
  if (node.virtual) return;
  const gen = genStyle(node.generation);
  if (node.isMarriage) {
    const wrap = document.createElement('div'); wrap.className = 'ft-marriage'; wrap.style.left = `${node.x}px`; wrap.style.top = `${node.y}px`;
    const c1 = document.createElement('article'); c1.className = `ft-node ft-node-burgada ${node.person.deathDate ? 'ft-deceased' : ''}`; c1.style.borderTopColor = gen.color; c1.innerHTML = createPersonCard(node.person); c1.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); }); registerEl(node.person.id, c1);
    const ring = document.createElement('div'); ring.className = 'ft-marriage-ring'; ring.textContent = '♡';
    const c2 = document.createElement('article'); c2.className = `ft-node ft-node-spouse ${node.partner.deathDate ? 'ft-deceased' : ''}`; c2.style.borderTopColor = '#b8ad98'; c2.innerHTML = createPersonCard(node.partner); c2.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.partner); }); registerEl(node.partner.id, c2);
    wrap.appendChild(c1); wrap.appendChild(ring); wrap.appendChild(c2);
    if (node.children.length) wrap.appendChild(makeCollapseBtn(node));
    canvas.appendChild(wrap);
    requestAnimationFrame(() => { c1.classList.add('ft-visible'); c2.classList.add('ft-visible'); });
  } else {
    const isFam = isBurgada(node.person) || (!node.person.partnerId && node.person.parentId == null);
    const el = document.createElement('article');
    el.className = `ft-node ${isFam ? 'ft-node-burgada' : 'ft-node-spouse'} ${node.person.deathDate ? 'ft-deceased' : ''} ${node.collapsed && node.children.length ? 'ft-collapsed' : ''}`;
    el.style.cssText = `position:absolute;left:${node.x}px;top:${node.y}px;border-top-color:${gen.color};animation-delay:${0.03 + order * 0.015}s`;
    el.innerHTML = createPersonCard(node.person);
    if (node.children.length) el.appendChild(makeCollapseBtn(node));
    el.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); });
    registerEl(node.person.id, el); canvas.appendChild(el);
    requestAnimationFrame(() => el.classList.add('ft-visible'));
  }
}

// ── SVG ─────────────────────────────────────────────────────────────────

function anchorOut(n) { const h = nodeH(n); return orientation === 'horizontal' ? { x: n.x + CARD_W, y: n.y + h / 2 } : { x: n.x + CARD_W / 2, y: n.y + h }; }
function anchorIn(n) { return orientation === 'horizontal' ? { x: n.x, y: n.y + nodeH(n) / 2 } : { x: n.x + CARD_W / 2, y: n.y }; }

function connectorPath(parent, child) {
  const p = anchorOut(parent), c = anchorIn(child);
  if (orientation === 'horizontal') { const mx = p.x + (c.x - p.x) * 0.45; return `M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`; }
  const my = p.y + (c.y - p.y) * 0.45; return `M ${p.x} ${p.y} C ${p.x} ${my}, ${c.x} ${my}, ${c.x} ${c.y}`;
}

function renderLinks(node, svg) {
  if (node.virtual && !node.collapsed) { node.children.forEach(c => renderLinks(c, svg)); return; }
  if (node.collapsed) return;
  for (const child of node.children) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', connectorPath(node, child)); path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#b8ad98'); path.setAttribute('stroke-width', '2'); path.setAttribute('stroke-linecap', 'round');
    svg.appendChild(path);
    if (node.person && child.person) edgeElements.set(`${node.person.id}-${child.person.id}`, path);
    renderLinks(child, svg);
  }
}

// ── Level labels ────────────────────────────────────────────────────────

function renderLevelLabels(depthCount) {
  const existing = document.querySelector('.ft-level-bar');
  if (orientation === 'vertical') { if (existing) existing.style.display = 'none'; return; }
  const viewport = document.getElementById('ft-viewport');
  let colWrap = viewport.parentElement;
  if (!colWrap?.classList.contains('ft-col-wrap')) {
    const wrap = document.createElement('div'); wrap.className = 'ft-col-wrap'; wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;min-width:0;';
    viewport.parentElement.insertBefore(wrap, viewport); wrap.appendChild(viewport); colWrap = wrap;
  }
  let bar = colWrap.querySelector('.ft-level-bar');
  if (!bar) { bar = document.createElement('div'); bar.className = 'ft-level-bar'; bar.innerHTML = '<div class="ft-level-inner"></div>'; colWrap.insertBefore(bar, viewport); viewport.addEventListener('scroll', () => { const i = bar.querySelector('.ft-level-inner'); if (i) i.style.transform = `translateX(-${viewport.scrollLeft}px)`; }); }
  bar.style.display = '';
  const inner = bar.querySelector('.ft-level-inner'); inner.innerHTML = '';
  for (let d = 0; d <= depthCount; d++) { const l = document.createElement('div'); l.className = 'ft-level-label'; l.style.width = `${CARD_W + COL_GAP}px`; l.style.flexShrink = '0'; l.textContent = `Generación ${d}`; l.style.color = genStyle(d).color; inner.appendChild(l); }
}

// ── Main render ─────────────────────────────────────────────────────────

function renderTree() {
  const canvas = document.getElementById('ft-canvas');
  canvas.innerHTML = ''; personElements = new Map(); edgeElements = new Map();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;inset:0;overflow:visible;pointer-events:none;'; canvas.appendChild(svg);
  if (!rootTree) return;

  computeSpread(rootTree); assignDepth(rootTree, 0);
  if (orientation === 'horizontal') assignPosH(rootTree, TOP_PAD); else assignPosV(rootTree, LEFT_PAD, TOP_PAD);

  const depth = maxDepth(rootTree), nodes = flatten(rootTree);
  let w, h;
  if (orientation === 'horizontal') { w = LEFT_PAD * 2 + (depth + 1) * CARD_W + depth * COL_GAP + 100; h = TOP_PAD + rootTree.spread + 60; }
  else { w = LEFT_PAD * 2 + rootTree.spread + 60; let my = 0; nodes.forEach(n => { if (!n.virtual) { const b = n.y + nodeH(n); if (b > my) my = b; } }); h = my + 80; }

  canvas.style.width = `${w}px`; canvas.style.height = `${h}px`; svg.setAttribute('width', w); svg.setAttribute('height', h);
  renderLevelLabels(depth); nodes.forEach((n, i) => renderNode(n, canvas, i)); renderLinks(rootTree, svg);
  applyVisualState();
}

// ── Visual state ────────────────────────────────────────────────────────

function applyVisualState() {
  const term = searchTerm.toLowerCase().trim(), gf = currentFilter;
  const hasSearch = term !== '' || gf !== 'all', hasHL = highlightPersonIds != null;

  for (const [pid, els] of personElements) {
    const p = peopleById.get(pid); if (!p) continue;
    let dim = false;
    if (hasHL && !highlightPersonIds.has(pid)) dim = true;
    if (hasSearch) { if ((term && !(p.name || '').toLowerCase().includes(term)) || (gf !== 'all' && String(p.generation ?? '') !== gf)) dim = true; }
    for (const el of els) {
      el.classList.toggle('ft-dimmed', dim);
      el.classList.toggle('ft-highlight', hasSearch && !dim);
      el.classList.toggle('ft-lineage-active', hasHL && !dim);
    }
  }
  for (const [key, pathEl] of edgeElements) {
    if (hasHL) {
      const inL = highlightEdges?.has(key);
      pathEl.setAttribute('stroke', inL ? '#6f5b3e' : '#e8e3da'); pathEl.setAttribute('stroke-width', inL ? '3' : '1.5'); pathEl.style.opacity = inL ? '1' : '0.3';
    } else { pathEl.setAttribute('stroke', '#b8ad98'); pathEl.setAttribute('stroke-width', '2'); pathEl.style.opacity = '1'; }
  }
}

// ── Modal ───────────────────────────────────────────────────────────────

let _modalPerson = null;

function openModal(person) {
  _modalPerson = person;
  const bd = document.getElementById('ft-modal-backdrop'), gen = genStyle(person.generation);
  const ac = document.getElementById('modal-avatar');
  if (person.photoUrl) { ac.innerHTML = `<img class="ft-modal-photo" src="${person.photoUrl}" alt="${person.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><div class="ft-avatar-initials ft-avatar-initials-lg" style="display:none;background:${gen.bg};color:${gen.color}">${getInitials(person.name)}</div>`; }
  else { ac.innerHTML = `<div class="ft-avatar-initials ft-avatar-initials-lg" style="background:${gen.bg};color:${gen.color}">${getInitials(person.name)}</div>`; }

  document.getElementById('modal-name').textContent = person.name;
  document.getElementById('modal-dates').textContent = formatDates(person);
  document.getElementById('modal-description').textContent = person.description || '';

  const isFam = isBurgada(person) || (person.parentId == null && !person.partnerId);
  const badge = document.getElementById('modal-relation');
  badge.textContent = isFam ? 'Familia Burgada' : 'Pareja'; badge.style.background = isFam ? gen.bg : '#f0ece4'; badge.style.color = isFam ? gen.color : '#8a7e6e';
  document.querySelector('.ft-modal').style.borderTopColor = gen.color;
  document.getElementById('modal-gen').textContent = `${person.generation ?? '?'}`;
  document.getElementById('modal-birthplace').textContent = person.birthPlace || '—';
  const spouse = person.partnerId ? peopleById.get(person.partnerId) : null;
  document.getElementById('modal-spouse').textContent = spouse ? spouse.name : '—';
  const ch1 = childrenByParentId.get(person.id) || [], ch2 = spouse ? (childrenByParentId.get(spouse.id) || []) : [];
  document.getElementById('modal-children').textContent = [...new Set([...ch1, ...ch2].map(c => c.id))].length || '0';
  document.getElementById('modal-notes').textContent = person.notes || '—';

  // Lineage text
  const lineageNames = getLineageNames(person.id);
  const lEl = document.getElementById('modal-lineage');
  if (lineageNames.length > 1) {
    lEl.innerHTML = '<span class="ft-modal-label" style="margin-bottom:6px;display:block">Línea familiar</span>' +
      lineageNames.map((n, i) => `<span class="ft-lineage-step" style="color:${genStyle(i).color}">${n}</span>`).join('<span class="ft-lineage-arrow">→</span>');
    lEl.style.display = '';
  } else { lEl.style.display = 'none'; }

  // Show/hide descendants button based on whether person has descendants
  const descBtn = document.getElementById('modal-trace-descendants');
  const descCount = countDescendants(person.id);
  descBtn.style.display = descCount > 0 ? '' : 'none';

  bd.classList.add('open');
}

// ── Mailto ──────────────────────────────────────────────────────────────

function sendChangeEmail() {
  const reporter = document.getElementById('req-reporter').value.trim();
  const type = document.getElementById('req-type').value;
  const personName = document.getElementById('req-person-name').value.trim();
  const details = document.getElementById('req-details').value.trim();
  const subject = `[Familia Burgada] ${type} — ${personName || 'Sin especificar'}`;
  const body = `Hola,\n\nSolicitud de cambio en el árbol familiar.\n\nReportado por: ${reporter}\nTipo: ${type}\nPersona: ${personName || '—'}\n\nDetalles:\n${details || '—'}\n\nFecha: ${new Date().toLocaleString('es-ES')}`;
  window.location.href = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function proposeChangeFromModal() {
  if (!_modalPerson) return;
  document.getElementById('ft-modal-backdrop').classList.remove('open');
  const body = document.getElementById('request-body'), chevron = document.getElementById('request-chevron');
  if (body.classList.contains('hidden')) { body.classList.remove('hidden'); chevron.classList.add('open'); }
  document.getElementById('req-type').value = 'Modificar datos';
  document.getElementById('req-person-name').value = _modalPerson.name;
  document.getElementById('req-details').value = ''; document.getElementById('req-details').focus();
  document.querySelector('.ft-request-panel').scrollIntoView({ behavior: 'smooth' });
}

function updateZoom(z) { zoom = z; document.getElementById('ft-canvas').style.transform = `scale(${zoom})`; document.getElementById('zoom-label').textContent = `${Math.round(zoom * 100)} %`; }

// ── Init ────────────────────────────────────────────────────────────────

(async function init() {
  await loadPeople(); rootTree = buildFamilyTree(); renderTree();

  document.getElementById('zoom-in').addEventListener('click', () => updateZoom(Math.min(2, +(zoom + 0.1).toFixed(2))));
  document.getElementById('zoom-out').addEventListener('click', () => updateZoom(Math.max(0.2, +(zoom - 0.1).toFixed(2))));
  document.getElementById('zoom-reset').addEventListener('click', () => updateZoom(1));
  document.getElementById('orientation-toggle').addEventListener('click', () => { orientation = orientation === 'horizontal' ? 'vertical' : 'horizontal'; document.getElementById('orientation-label').textContent = orientation === 'horizontal' ? '→' : '↓'; renderTree(); });

  const bd = document.getElementById('ft-modal-backdrop');
  bd.addEventListener('click', e => { if (e.target === bd) bd.classList.remove('open'); });
  document.getElementById('ft-modal-close').addEventListener('click', () => bd.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') bd.classList.remove('open'); });
  document.getElementById('modal-propose-change').addEventListener('click', proposeChangeFromModal);
  document.getElementById('modal-trace-lineage').addEventListener('click', () => { if (_modalPerson) { bd.classList.remove('open'); activateHighlight('lineage', _modalPerson.id); } });
  document.getElementById('modal-trace-descendants').addEventListener('click', () => { if (_modalPerson) { bd.classList.remove('open'); activateHighlight('descendants', _modalPerson.id); } });
  document.getElementById('ft-filter-clear').addEventListener('click', clearHighlight);

  document.getElementById('generation-filter').addEventListener('change', e => { currentFilter = e.target.value; applyVisualState(); });
  document.getElementById('ft-search-input').addEventListener('input', e => { searchTerm = e.target.value; applyVisualState(); });

  document.getElementById('request-toggle').addEventListener('click', () => { document.getElementById('request-body').classList.toggle('hidden'); document.getElementById('request-chevron').classList.toggle('open'); });
  document.getElementById('request-form').addEventListener('submit', e => { e.preventDefault(); sendChangeEmail(); });
})();
