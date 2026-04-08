// ══════════════════════════════════════════════════════════════════════════
// Familia Burgada — Script
// Motor de renderizado adaptado del BOM Viewer:
//   layout horizontal, posicionamiento absoluto, SVG bézier, zoom, colapso
// ══════════════════════════════════════════════════════════════════════════

// ── Layout constants ────────────────────────────────────────────────────
const CARD_W   = 210;
const CARD_H_SINGLE   = 110;
const CARD_H_MARRIAGE = 240;   // two cards + ring
const COL_GAP  = 80;
const ROW_GAP  = 12;
const TOP_PAD  = 20;
const LEFT_PAD = 20;

// ── Generation palette ──────────────────────────────────────────────────
const GEN_COLORS = [
  { color: '#6f5b3e', bg: '#f5f0e6' },
  { color: '#4a7c59', bg: '#edf5ef' },
  { color: '#3e6b8a', bg: '#eaf1f6' },
  { color: '#7c5a8a', bg: '#f3edf6' },
  { color: '#8a5a5a', bg: '#f6edec' },
  { color: '#5a7c8a', bg: '#edf4f6' },
];

function genStyle(gen) {
  return GEN_COLORS[gen % GEN_COLORS.length] || GEN_COLORS[0];
}

// ── State ───────────────────────────────────────────────────────────────
let peopleData = [];
let peopleById = new Map();
let childrenByParentId = new Map();
let rootTree = null;
let currentFilter = 'all';
let searchTerm = '';

// ── Load data ───────────────────────────────────────────────────────────
async function loadPeople() {
  const res = await fetch('data/people.json');
  peopleData = await res.json();

  peopleById = new Map();
  childrenByParentId = new Map();

  peopleData.forEach(p => {
    peopleById.set(p.id, p);
    if (p.parentId != null) {
      if (!childrenByParentId.has(p.parentId))
        childrenByParentId.set(p.parentId, []);
      childrenByParentId.get(p.parentId).push(p);
    }
  });

  // Populate generation filter
  const gens = [...new Set(peopleData.map(p => p.generation))].sort((a,b) => a - b);
  const sel = document.getElementById('generation-filter');
  gens.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g;
    opt.textContent = `Gen ${g}`;
    sel.appendChild(opt);
  });

  document.getElementById('ft-count').textContent = `${peopleData.length} personas`;
}

// ── Tree building (adapted from BOM viewer) ─────────────────────────────
// A "render node" can be a single person or a marriage block (person + partner).
// Children hang from the marriage/person, not duplicated.

function shouldRenderAsPrimary(person) {
  if (person.partnerId) return person.id < person.partnerId;
  return true;
}

function buildFamilyTree() {
  const roots = peopleData.filter(p => p.parentId == null && shouldRenderAsPrimary(p));

  // If multiple roots, create a virtual root
  if (roots.length === 1) {
    return buildSubTree(roots[0]);
  }

  const vRoot = {
    id: -1, name: 'Raíces', virtual: true,
    children: roots.map(r => buildSubTree(r)),
    collapsed: false
  };
  return vRoot;
}

function buildSubTree(person) {
  const partner = person.partnerId ? peopleById.get(person.partnerId) : null;

  let children = childrenByParentId.get(person.id) || [];
  if (partner && childrenByParentId.has(partner.id)) {
    children = children.concat(childrenByParentId.get(partner.id));
  }
  const seen = new Set();
  children = children.filter(c => { if (seen.has(c.id)) return false; seen.add(c.id); return true; });

  const primary = children.filter(shouldRenderAsPrimary);

  const node = {
    person,
    partner,
    isMarriage: !!partner,
    children: primary.map(c => buildSubTree(c)),
    collapsed: false,
    generation: person.generation ?? 0,
  };

  return node;
}

// ── Layout engine (from BOM viewer) ─────────────────────────────────────

function nodeHeight(node) {
  return node.isMarriage ? CARD_H_MARRIAGE : CARD_H_SINGLE;
}

function computeHeights(node) {
  if (!node.children.length || node.collapsed) {
    node.sh = nodeHeight(node);
    return;
  }
  node.children.forEach(computeHeights);
  const total = node.children.reduce((s, c) => s + c.sh, 0)
    + ROW_GAP * (node.children.length - 1);
  node.sh = Math.max(nodeHeight(node), total);
}

function assignDepth(node, d = 0) {
  node.depth = d;
  node.children.forEach(c => assignDepth(c, d + 1));
}

function assignPositions(node, top) {
  node.x = LEFT_PAD + node.depth * (CARD_W + COL_GAP);
  const h = nodeHeight(node);
  node.y = top + (node.sh - h) / 2;

  if (!node.children.length || node.collapsed) return;

  const total = node.children.reduce((s, c) => s + c.sh, 0)
    + ROW_GAP * (node.children.length - 1);
  let cur = top + (node.sh - total) / 2;
  for (const c of node.children) {
    assignPositions(c, cur);
    cur += c.sh + ROW_GAP;
  }
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

function findNode(node, personId) {
  if (node.person?.id === personId || node.partner?.id === personId) return node;
  for (const c of node.children) {
    const f = findNode(c, personId);
    if (f) return f;
  }
  return null;
}

// ── Rendering ───────────────────────────────────────────────────────────

function formatDates(person) {
  const b = person.birthDate || '';
  const d = person.deathDate || '';
  if (!b && !d) return '';
  return d ? `${b} – ${d}` : `${b} –`;
}

function createPersonCard(person, genColor) {
  const photo = person.photoUrl || 'https://via.placeholder.com/46?text=' + encodeURIComponent(person.name?.[0] || '?');
  const deceased = person.deathDate ? 'ft-deceased' : '';
  return `
    <div class="ft-node-top">
      <img class="ft-node-photo" src="${photo}" alt="${person.name}" onerror="this.src='https://via.placeholder.com/46'" />
      <div class="ft-node-info">
        <div class="ft-node-name">${person.name}</div>
        <div class="ft-node-dates">${formatDates(person)}</div>
      </div>
    </div>
    <span class="ft-gen-badge" style="background:${genColor.bg};color:${genColor.color}">Gen ${person.generation ?? '?'}</span>
  `;
}

function renderNode(node, canvas, order) {
  const gen = genStyle(node.generation);

  if (node.virtual) {
    // Virtual root — don't render, just children
    return;
  }

  if (node.isMarriage) {
    // Marriage block: two cards with ring
    const wrapper = document.createElement('div');
    wrapper.className = 'ft-marriage';
    wrapper.style.left = `${node.x}px`;
    wrapper.style.top = `${node.y}px`;
    wrapper.style.animationDelay = `${0.04 + order * 0.02}s`;

    const card1 = document.createElement('article');
    card1.className = `ft-node ${node.person.deathDate ? 'ft-deceased' : ''}`;
    card1.style.borderTopColor = gen.color;
    card1.innerHTML = createPersonCard(node.person, gen);
    card1.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); });

    const ring = document.createElement('div');
    ring.className = 'ft-marriage-ring';
    ring.textContent = '♡';

    const card2 = document.createElement('article');
    card2.className = `ft-node ${node.partner.deathDate ? 'ft-deceased' : ''}`;
    card2.style.borderTopColor = gen.color;
    card2.innerHTML = createPersonCard(node.partner, gen);
    card2.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.partner); });

    wrapper.appendChild(card1);
    wrapper.appendChild(ring);
    wrapper.appendChild(card2);

    // Collapse button on wrapper
    if (node.children.length) {
      const btn = document.createElement('button');
      btn.className = 'ft-collapse-btn';
      btn.title = node.collapsed ? 'Expandir' : 'Colapsar';
      btn.textContent = node.collapsed ? '›' : '‹';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        node.collapsed = !node.collapsed;
        renderTree();
      });
      wrapper.appendChild(btn);
    }

    canvas.appendChild(wrapper);
    requestAnimationFrame(() => {
      card1.classList.add('ft-visible');
      card2.classList.add('ft-visible');
    });

  } else {
    // Single person
    const el = document.createElement('article');
    el.className = `ft-node ${node.person.deathDate ? 'ft-deceased' : ''} ${node.collapsed && node.children.length ? 'ft-collapsed' : ''}`;
    el.style.position = 'absolute';
    el.style.left = `${node.x}px`;
    el.style.top = `${node.y}px`;
    el.style.borderTopColor = gen.color;
    el.style.animationDelay = `${0.04 + order * 0.02}s`;
    el.innerHTML = createPersonCard(node.person, gen);

    if (node.children.length) {
      const btn = document.createElement('button');
      btn.className = 'ft-collapse-btn';
      btn.title = node.collapsed ? 'Expandir' : 'Colapsar';
      btn.textContent = node.collapsed ? '›' : '‹';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        node.collapsed = !node.collapsed;
        renderTree();
      });
      el.appendChild(btn);
    }

    el.addEventListener('click', e => { if (!e.target.closest('.ft-collapse-btn')) openModal(node.person); });
    canvas.appendChild(el);
    requestAnimationFrame(() => el.classList.add('ft-visible'));
  }
}

// ── SVG connectors (from BOM viewer) ────────────────────────────────────

function connectorAnchor(node) {
  const h = nodeHeight(node);
  return { x: node.x + CARD_W, y: node.y + h / 2 };
}

function childAnchor(node) {
  const h = nodeHeight(node);
  return { x: node.x, y: node.y + h / 2 };
}

function connectorPath(parent, child) {
  const p = connectorAnchor(parent);
  const c = childAnchor(child);
  const mx = p.x + (c.x - p.x) * 0.45;
  return `M ${p.x} ${p.y} C ${mx} ${p.y}, ${mx} ${c.y}, ${c.x} ${c.y}`;
}

function renderLinks(node, svg) {
  if (node.collapsed || node.virtual) {
    // For virtual root, still render children links
    if (node.virtual && !node.collapsed) {
      node.children.forEach(c => renderLinks(c, svg));
    }
    return;
  }
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

// ── Level labels (from BOM viewer) ──────────────────────────────────────

function renderLevelLabels(depthCount) {
  const viewport = document.getElementById('ft-viewport');
  const colWrap = viewport.parentElement?.querySelector('.ft-col-wrap') || null;
  const target = colWrap || viewport.parentElement;

  let levelBar = target.querySelector('.ft-level-bar');
  if (!levelBar) {
    levelBar = document.createElement('div');
    levelBar.className = 'ft-level-bar';
    const inner = document.createElement('div');
    inner.className = 'ft-level-inner';
    levelBar.appendChild(inner);

    // Wrap viewport in col layout
    if (!colWrap) {
      const wrap = document.createElement('div');
      wrap.className = 'ft-col-wrap';
      wrap.style.cssText = 'flex:1;display:flex;flex-direction:column;overflow:hidden;min-height:0;min-width:0;';
      viewport.parentElement.insertBefore(wrap, viewport);
      wrap.appendChild(levelBar);
      wrap.appendChild(viewport);
    } else {
      colWrap.insertBefore(levelBar, viewport);
    }

    // Sync scroll
    viewport.addEventListener('scroll', () => {
      levelBar.querySelector('.ft-level-inner').style.transform = `translateX(-${viewport.scrollLeft}px)`;
    });
  }

  const inner = levelBar.querySelector('.ft-level-inner');
  inner.innerHTML = '';
  for (let d = 0; d <= depthCount; d++) {
    const label = document.createElement('div');
    label.className = 'ft-level-label';
    label.style.width = `${CARD_W + COL_GAP}px`;
    label.style.flexShrink = '0';
    const g = genStyle(d);
    label.textContent = `Generación ${d}`;
    label.style.color = g.color;
    inner.appendChild(label);
  }
}

// ── Main render ─────────────────────────────────────────────────────────

function renderTree() {
  const canvas = document.getElementById('ft-canvas');
  canvas.innerHTML = '';

  // SVG layer
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;inset:0;overflow:visible;pointer-events:none;';
  canvas.appendChild(svg);

  let tree = rootTree;
  if (!tree) {
    canvas.innerHTML = '<div class="ft-empty">Cargando datos…</div>';
    return;
  }

  // Apply generation filter
  if (currentFilter !== 'all') {
    // We don't prune the tree, we just dim non-matching nodes via search mechanism
  }

  computeHeights(tree);
  assignDepth(tree, 0);
  assignPositions(tree, TOP_PAD);

  const nodes = flatten(tree);
  const depth = maxDepth(tree);
  const width = LEFT_PAD * 2 + (depth + 1) * CARD_W + depth * COL_GAP + 100;
  const height = TOP_PAD + tree.sh + 60;

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  renderLevelLabels(depth);
  nodes.forEach((n, i) => renderNode(n, canvas, i));
  renderLinks(tree, svg);

  // Apply search highlight
  applySearch();
}

// ── Search / filter ─────────────────────────────────────────────────────

function applySearch() {
  const term = searchTerm.toLowerCase().trim();
  const genFilter = currentFilter;

  document.querySelectorAll('.ft-node').forEach(el => {
    el.classList.remove('ft-highlight', 'ft-dimmed');
  });

  if (!term && genFilter === 'all') return;

  // Get all rendered person nodes
  const allNodes = document.querySelectorAll('.ft-node');
  let anyMatch = false;

  allNodes.forEach(el => {
    const name = el.querySelector('.ft-node-name')?.textContent?.toLowerCase() || '';
    const genText = el.querySelector('.ft-gen-badge')?.textContent || '';
    const genNum = genText.match(/\d+/)?.[0] || '';

    let matches = true;
    if (term && !name.includes(term)) matches = false;
    if (genFilter !== 'all' && genNum !== String(genFilter)) matches = false;

    if (matches) {
      el.classList.add('ft-highlight');
      anyMatch = true;
    } else {
      if (term || genFilter !== 'all') el.classList.add('ft-dimmed');
    }
  });
}

// ── Modal ───────────────────────────────────────────────────────────────

function openModal(person) {
  const backdrop = document.getElementById('ft-modal-backdrop');
  const gen = genStyle(person.generation ?? 0);

  document.getElementById('modal-photo').src = person.photoUrl || 'https://via.placeholder.com/72';
  document.getElementById('modal-name').textContent = person.name;
  document.getElementById('modal-dates').textContent = formatDates(person);
  document.getElementById('modal-description').textContent = person.description || '';

  const badge = document.getElementById('modal-relation');
  badge.textContent = `Generación ${person.generation ?? '?'}`;
  badge.style.background = gen.bg;
  badge.style.color = gen.color;

  document.querySelector('.ft-modal').style.borderTopColor = gen.color;

  document.getElementById('modal-gen').textContent = `${person.generation ?? '?'}`;
  document.getElementById('modal-birthplace').textContent = person.birthPlace || '—';

  const spouse = person.partnerId ? peopleById.get(person.partnerId) : null;
  document.getElementById('modal-spouse').textContent = spouse ? spouse.name : '—';

  // Count children
  const ch1 = childrenByParentId.get(person.id) || [];
  const ch2 = spouse ? (childrenByParentId.get(spouse.id) || []) : [];
  const allCh = [...new Set([...ch1, ...ch2].map(c => c.id))];
  document.getElementById('modal-children').textContent = allCh.length || '0';

  document.getElementById('modal-notes').textContent = person.notes || '—';

  backdrop.classList.add('open');
}

// ── Zoom ────────────────────────────────────────────────────────────────

let zoom = 1;

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

  // Zoom buttons
  document.getElementById('zoom-in').addEventListener('click', () => updateZoom(Math.min(2, +(zoom + 0.1).toFixed(2))));
  document.getElementById('zoom-out').addEventListener('click', () => updateZoom(Math.max(0.3, +(zoom - 0.1).toFixed(2))));
  document.getElementById('zoom-reset').addEventListener('click', () => updateZoom(1));

  // Modal close
  const backdrop = document.getElementById('ft-modal-backdrop');
  backdrop.addEventListener('click', e => {
    if (e.target === backdrop) backdrop.classList.remove('open');
  });
  document.getElementById('ft-modal-close').addEventListener('click', () => backdrop.classList.remove('open'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') backdrop.classList.remove('open'); });

  // Generation filter
  document.getElementById('generation-filter').addEventListener('change', e => {
    currentFilter = e.target.value;
    applySearch();
  });

  // Search
  document.getElementById('ft-search-input').addEventListener('input', e => {
    searchTerm = e.target.value;
    applySearch();
  });

  // Request form toggle
  document.getElementById('request-toggle').addEventListener('click', () => {
    const body = document.getElementById('request-body');
    const chevron = document.getElementById('request-chevron');
    body.classList.toggle('hidden');
    chevron.classList.toggle('open');
  });

  // Request form submit
  document.getElementById('request-form').addEventListener('submit', e => {
    e.preventDefault();
    const payload = {
      reportedBy: document.getElementById('req-reporter').value.trim(),
      reportedAt: new Date().toISOString(),
      type: document.getElementById('req-type').value,
      relatedPerson: {
        id: document.getElementById('req-person-id').value.trim() || null,
        nameOrReference: document.getElementById('req-person-name').value.trim() || null,
      },
      details: document.getElementById('req-details').value.trim(),
    };
    document.getElementById('request-output').textContent =
      'Solicitud generada:\n\n' + JSON.stringify(payload, null, 2);
    document.getElementById('request-form').reset();
  });
})();
