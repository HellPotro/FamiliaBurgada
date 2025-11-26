// ====== JSON de ejemplo ======
      const peopleData = [
  {
    "id": 1,
    "partnerId": 2,
    "parentId": null,
    "name": "Pedro Burgada Besantes",
    "generation": 1,
    "description": "En el último tercio del siglo diecinueve, llega a Santander, procedente del País Vasco nuestro primer Pedro Burgada, nacido en San Sebastián. Establece una pequeña industria en una travesía de la calle del Monte, para fabricar toneles (cubas grandes para envasar vino u otros líquidos). Contrae matrimonio con una joven santanderina, Felisa Campo. Tienen dos hijos, varones. El mayor Pedro y el segundo Francisco.",
    "birthDate": "1850",
    "deathDate": "",
    "birthPlace": "País Vasco, España",
    "photoUrl": "https://cdn-icons-png.flaticon.com/128/168/168882.png",
    "notes": "Apasionado de la huerta y los juegos de cartas."
  },
  {
    "id": 2,
    "partnerId": 1,
    "parentId": null,
    "name": "Felisa Campos",
    "generation": 1,
    "description": "María se encargó de llevar la contabilidad del negocio familiar.",
    "birthDate": "1947-07-02",
    "deathDate": "",
    "birthPlace": "Toledo, España",
    "photoUrl": "https://cdn-icons-png.flaticon.com/128/168/168916.png",
    "notes": "Le encanta cocinar y recopilar recetas familiares."
  },
  {
    "id": 3,
    "partnerId": 4,
    "parentId": 1,
    "name": "Pedro Burgada Campos",
    "generation": 2,
    "description": "Ana es la hija mayor, trabaja como médica.",
    "birthDate": "1975-01-15",
    "deathDate": "",
    "birthPlace": "Madrid, España",
    "photoUrl": "",
    "notes": "Organiza las reuniones familiares."
  },
  {
    "id": 4,
    "partnerId": 3,
    "parentId": null,
    "name": "Fermina Lavín",
    "generation": 2,
    "description": "Carlos es diseñador gráfico y se unió a la familia al casarse con Ana.",
    "birthDate": "1974-09-30",
    "deathDate": "",
    "birthPlace": "Sevilla, España",
    "photoUrl": "https://placekitten.com/223/223",
    "notes": "Aficionado a la fotografía."
  },
  {
    "id": 5,
    "partnerId": 6,
    "parentId": 1,
    "name": "Francisco Burgada Campos",
    "generation": 2,
    "description": "Ana es la hija mayor, trabaja como médica.",
    "birthDate": "1975-01-15",
    "deathDate": "",
    "birthPlace": "Madrid, España",
    "photoUrl": "",
    "notes": "Organiza las reuniones familiares."
  },
  {
    "id": 6,
    "partnerId": 5,
    "parentId": null,
    "name": "Catalina Mesones Vallejo",
    "generation": 2,
    "description": "Carlos es diseñador gráfico y se unió a la familia al casarse con Ana.",
    "birthDate": "1974-09-30",
    "deathDate": "",
    "birthPlace": "Sevilla, España",
    "photoUrl": "",
    "notes": "Aficionado a la fotografía."
  },
  {
    "id": 7,
    "partnerId": 8,
    "parentId": 3,
    "name": "Felisa Burgada Lavín",
    "generation": 3,
    "description": "Luis trabaja como ingeniero informático.",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "Madrid, España",
    "photoUrl": "",
    "notes": "El 'informático' de la familia."
  },
  {
    "id": 8,
    "partnerId": 7,
    "parentId": null,
    "name": "Gerardo Obeso",
    "generation": 3,
    "description": "Luis trabaja como ingeniero informático.",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "Madrid, España",
    "photoUrl": "",
    "notes": "El 'informático' de la familia."
  },
  {
    "id": 9,
    "partnerId": 10,
    "parentId": 3,
    "name": "Pedro Burgada Lavín",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 10,
    "partnerId": 9,
    "parentId": null,
    "name": "Pilar Palleiro Fernández",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 11,
    "partnerId": 12,
    "parentId": 3,
    "name": "Manuel Burgada Lavín",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 12,
    "partnerId": 11,
    "parentId": null,
    "name": "Dolores García",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 13,
    "partnerId": 14,
    "parentId": 5,
    "name": "Aurora Burgada Mesones",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 14,
    "partnerId": 13,
    "parentId": null,
    "name": "Damián Paul Corrales",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 15,
    "partnerId": 16,
    "parentId": 5,
    "name": "Francisco Burgada Mesones",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 16,
    "partnerId": 15,
    "parentId": null,
    "name": "Maria Asunción Sanz",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 17,
    "partnerId": 18,
    "parentId": 5,
    "name": "Rogelio Burgada Mesones",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 18,
    "partnerId": 17,
    "parentId": null,
    "name": "Generosa Berasategui Bolado",
    "generation": 3,
    "description": "",
    "birthDate": "1979-04-08",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  }
];

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

      const img = document.createElement("img");
      img.className = "person-photo";
      img.src = person.photoUrl || "https://via.placeholder.com/56";
      img.alt = person.name;

      const nameSpan = document.createElement("span");
      nameSpan.className = "person-name";
      nameSpan.textContent = person.name;

      const roleSpan = document.createElement("span");
      roleSpan.className = "person-role";
      roleSpan.textContent = `Generación ${person.generation}`;

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

    // build & init
    buildTree();
    applyZoom();
