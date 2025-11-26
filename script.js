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
  },
 // Generación 4
  {
    "id": 19,
    "partnerId": null,
    "parentId": 9,
    "name": "María del Pilar Burgada Palleiro",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 20,
    "partnerId": 21,
    "parentId": 9,
    "name": "María Isabel Burgada Palleiro",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 21,
    "partnerId": 20,
    "parentId": null,
    "name": "Miguel Ángel Martínez",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 22,
    "partnerId": 23,
    "parentId": 9,
    "name": "Pedro Burgada Palleiro",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "images/pedro_burgada_palleiro.png",
    "notes": ""
  },
  {
    "id": 23,
    "partnerId": 22,
    "parentId": null,
    "name": "Jael Ruiz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },

  {
    "id": 24,
    "partnerId": 25,
    "parentId": 11,
    "name": "Pedro Burgada García",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 25,
    "partnerId": 24,
    "parentId": null,
    "name": "Raquel Lois",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },

  {
    "id": 26,
    "partnerId": null,
    "parentId": 13,
    "name": "Aurora Paul Burgada",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },

  {
    "id": 27,
    "partnerId": 28,
    "parentId": 15,
    "name": "Francisco Javier Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 28,
    "partnerId": 27,
    "parentId": null,
    "name": "Marián Gil",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 29,
    "partnerId": 30,
    "parentId": 15,
    "name": "María Antonia Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 30,
    "partnerId": 29,
    "parentId": null,
    "name": "Florentino Benéitez",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 31,
    "partnerId": 32,
    "parentId": 15,
    "name": "José Ignacio Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 32,
    "partnerId": 31,
    "parentId": null,
    "name": "Ana Padilla",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 33,
    "partnerId": 34,
    "parentId": 15,
    "name": "Miguel Ángel Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 34,
    "partnerId": 33,
    "parentId": null,
    "name": "Mercedes García",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 35,
    "partnerId": 36,
    "parentId": 15,
    "name": "Juan Carlos Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 36,
    "partnerId": 35,
    "parentId": null,
    "name": "Elena Chiva",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 37,
    "partnerId": 38,
    "parentId": 15,
    "name": "Luis Burgada Sanz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 38,
    "partnerId": 37,
    "parentId": null,
    "name": "Marián Saiz",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },

  {
    "id": 39,
    "partnerId": 40,
    "parentId": 17,
    "name": "Ana Burgada Berasategui",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 40,
    "partnerId": 39,
    "parentId": null,
    "name": "Juan Carlos García Sánchez",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 41,
    "partnerId": 42,
    "parentId": 17,
    "name": "Aurora Burgada Berasategui",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 42,
    "partnerId": 41,
    "parentId": null,
    "name": "Abus Kakeh",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 43,
    "partnerId": 44,
    "parentId": 17,
    "name": "Rogelio Burgada Berasategui",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 44,
    "partnerId": 43,
    "parentId": null,
    "name": "Piedad Serrano",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 45,
    "partnerId": 46,
    "parentId": 17,
    "name": "Alberto Federico Burgada Berasategui",
    "generation": 4,
    "description": "",
    "birthDate": "",
    "deathDate": "",
    "birthPlace": "",
    "photoUrl": "",
    "notes": ""
  },
  {
    "id": 46,
    "partnerId": 45,
    "parentId": null,
    "name": "María Luisa Ruiloba",
    "generation": 4,
    "description": "",
    "birthDate": "",
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
