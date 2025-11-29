// ====== JSON de ejemplo ======
    let peopleData = [];
    let peopleById = new Map();
    let childrenByParentId = new Map();

// Rellenar el selector de generaciones en base a los datos
const generationFilterSelect = document.getElementById("generation-filter");

 // ====== CARGAR JSON ======
    async function loadPeople() {
      const res = await fetch('data/people.json');
      peopleData = await res.json();

      peopleById = new Map();
      childrenByParentId = new Map();

      peopleData.forEach(p => {
        peopleById.set(p.id, p);
        if (p.parentId != null) {
          if (!childrenByParentId.has(p.parentId)) {
            childrenByParentId.set(p.parentId, []);
          }
          childrenByParentId.get(p.parentId).push(p);
        }
      });
    }

function populateGenerationFilter() {
  if (!generationFilterSelect) return;

  const gens = [...new Set(
    peopleData
      .map(p => p.generation)
      .filter(g => g !== null && g !== undefined)
  )].sort((a, b) => a - b);

  gens.forEach(g => {
    const opt = document.createElement("option");
    opt.value = String(g);
    opt.textContent = `Generación ${g}`;
    generationFilterSelect.appendChild(opt);
  });
}

function applyGenerationFilter(genValue) {
  const nodes = document.querySelectorAll(".person-node");

  // reset estado
  nodes.forEach(node => {
    node.classList.remove("gen-muted", "gen-highlight");
  });

  if (!genValue || genValue === "all") {
    // mostrar todo sin resaltar
    return;
  }

  nodes.forEach(node => {
    const nodeGen = node.dataset.generation;
    if (nodeGen === genValue) {
      node.classList.add("gen-highlight");
    } else {
      node.classList.add("gen-muted");
    }
  });
}



    const peopleById = new Map();
    peopleData.forEach(p => peopleById.set(p.id, p));

    const childrenByParentId = new Map();
    peopleData.forEach(p => {
      if (p.parentId != null) {
        if (!childrenByParentId.has(p.parentId)) {
          childrenByParentId.set(p.parentId, []);
        }
        childrenByParentId.get(p.parentId).push(p);
      }
    });

    function shouldRenderAsPrimary(person) {
      if (person.partnerId) {
        return person.id < person.partnerId;
      }
      return true;
    }

      function createPersonNode(person) {
        const div = document.createElement("div");
        div.className = "person-node";
        div.dataset.id = person.id;
        div.dataset.generation = person.generation ?? "";
      
        const img = document.createElement("img");
        img.className = "person-photo";
        img.src = person.photoUrl || "https://via.placeholder.com/56";
        img.alt = person.name;
      
        const nameSpan = document.createElement("span");
        nameSpan.className = "person-name";
        nameSpan.textContent = person.name;
      
        const roleSpan = document.createElement("span");
        roleSpan.className = "person-role";
        roleSpan.textContent = person.relation || `Generación ${person.generation}`;
      
        div.appendChild(img);
        div.appendChild(nameSpan);
        div.appendChild(roleSpan);
      
        div.addEventListener("click", () => showPerson(person.id));
      
        return div;
      }

    function createMarriageBlock(person, isRoot = false) {
      const partner = person.partnerId ? peopleById.get(person.partnerId) : null;

      if (partner) {
        const marriageDiv = document.createElement("div");
        marriageDiv.className = "marriage" + (isRoot ? " marriage-root" : "");

        const p1 = createPersonNode(person);
        const ring = document.createElement("span");
        ring.className = "marriage-ring";
        ring.textContent = "♡";
        const p2 = createPersonNode(partner);

        marriageDiv.appendChild(p1);
        marriageDiv.appendChild(ring);
        marriageDiv.appendChild(p2);

        return { container: marriageDiv, partner };
      } else {
        const single = createPersonNode(person);
        return { container: single, partner: null };
      }
    }

    function buildSubTree(person, isRoot = false) {
      const li = document.createElement("li");
      const { container, partner } = createMarriageBlock(person, isRoot);
      li.appendChild(container);

      let children = childrenByParentId.get(person.id) || [];

      if (partner && childrenByParentId.has(partner.id)) {
        children = children.concat(childrenByParentId.get(partner.id));
      }

      const seenIds = new Set();
      children = children.filter(child => {
        if (seenIds.has(child.id)) return false;
        seenIds.add(child.id);
        return true;
      });

      const primaryChildren = children.filter(shouldRenderAsPrimary);

      if (primaryChildren.length > 0) {
        const ul = document.createElement("ul");
        primaryChildren.forEach(child => {
          ul.appendChild(buildSubTree(child, false));
        });
        li.appendChild(ul);
      }

      return li;
    }

    function buildTree() {
      const treeContainer = document.getElementById("tree");
      const rootUl = document.createElement("ul");

      const roots = peopleData.filter(
        p => p.parentId == null && shouldRenderAsPrimary(p)
      );

      roots.forEach(rootPerson => {
        rootUl.appendChild(buildSubTree(rootPerson, true));
      });

      treeContainer.appendChild(rootUl);
    }

    // ====== Info card ======
    const infoCard = document.getElementById("info-card");
    const infoPlaceholder = document.getElementById("info-placeholder");

    const infoPhoto = document.getElementById("info-photo");
    const infoName = document.getElementById("info-name");
    const infoGeneration = document.getElementById("info-generation");
    const infoDates = document.getElementById("info-dates");
    const infoDescription = document.getElementById("info-description");
    const infoBirthplace = document.getElementById("info-birthplace");
    const infoSpouses = document.getElementById("info-spouses");
    const infoNotes = document.getElementById("info-notes");

    function showPerson(id) {
      const person = peopleById.get(Number(id));
      if (!person) return;

      infoPhoto.src = person.photoUrl || "https://via.placeholder.com/72";
      infoPhoto.alt = person.name;
      infoName.textContent = person.name;
      infoGeneration.textContent = person.generation
        ? `Generación ${person.generation}`
        : "";

      if ((person.birthDate && person.birthDate.trim() !== "") ||
          (person.deathDate && person.deathDate.trim() !== "")) {
        const birth = person.birthDate || "?";
        const death = person.deathDate || "";
        infoDates.textContent = death
          ? `${birth} – ${death}`
          : `${birth} –`;
      } else {
        infoDates.textContent = "";
      }

      infoDescription.textContent = person.description || "";
      infoBirthplace.textContent = person.birthPlace || "—";
      infoNotes.textContent = person.notes || "—";

      if (person.partnerId) {
        const spouse = peopleById.get(person.partnerId);
        infoSpouses.textContent = spouse ? spouse.name : "—";
      } else {
        infoSpouses.textContent = "—";
      }

      infoPlaceholder.classList.add("hidden");
      infoCard.classList.remove("hidden");
    }

    // ====== Zoom del árbol ======
    const treeInner = document.getElementById("tree-inner");
    const zoomInBtn = document.getElementById("zoom-in");
    const zoomOutBtn = document.getElementById("zoom-out");
    const zoomResetBtn = document.getElementById("zoom-reset");
    const zoomLevelLabel = document.getElementById("zoom-level");

    let zoom = 1;
    const minZoom = 0.5;
    const maxZoom = 2;
    const zoomStep = 0.1;

    function applyZoom() {
      treeInner.style.transform = `scale(${zoom})`;
      zoomLevelLabel.textContent = `${Math.round(zoom * 100)}%`;
    }

    zoomInBtn.addEventListener("click", () => {
      zoom = Math.min(maxZoom, zoom + zoomStep);
      applyZoom();
    });

    zoomOutBtn.addEventListener("click", () => {
      zoom = Math.max(minZoom, zoom - zoomStep);
      applyZoom();
    });

    zoomResetBtn.addEventListener("click", () => {
      zoom = 1;
      applyZoom();
    });

// Evento del select
if (generationFilterSelect) {
  generationFilterSelect.addEventListener("change", (e) => {
    const value = e.target.value;
    applyGenerationFilter(value);
  });
}

// Arrancar todo
populateGenerationFilter();
buildTree();
applyZoom();
