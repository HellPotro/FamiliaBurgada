// ==========
    // JSON de ejemplo (puedes moverlo a un .json y cargarlo con fetch si quieres)
    // ==========
    const peopleData = [
      {
        "id": 1,
        "partnerId": 2,
        "parentId": null,
        "name": "Juan Pérez",
        "generation": 1,
        "relation": "Abuelo",
        "description": "Juan es el patriarca de la familia. Trabajó toda su vida como carpintero.",
        "birthDate": "1945-03-12",
        "deathDate": "",
        "birthPlace": "Madrid, España",
        "photoUrl": "https://cdn-icons-png.flaticon.com/128/168/168882.png",
        "notes": "Apasionado de la huerta y los juegos de cartas."
      },
      {
        "id": 2,
        "partnerId": 1,
        "parentId": null,
        "name": "María López",
        "generation": 1,
        "relation": "Abuela",
        "description": "María se encargó de llevar la contabilidad del negocio familiar.",
        "birthDate": "1947-07-02",
        "deathDate": "",
        "birthPlace": "Toledo, España",
        "photoUrl": "https://placekitten.com/221/221",
        "notes": "Le encanta cocinar y recopilar recetas familiares."
      },
      {
        "id": 3,
        "partnerId": 4,
        "parentId": 1,   /* referencia al padre o a la madre (uno de los dos de la pareja) */
        "name": "Ana Pérez",
        "generation": 2,
        "relation": "Hija",
        "description": "Ana es la hija mayor, trabaja como médica.",
        "birthDate": "1975-01-15",
        "deathDate": "",
        "birthPlace": "Madrid, España",
        "photoUrl": "https://placekitten.com/222/222",
        "notes": "Organiza las reuniones familiares."
      },
      {
        "id": 4,
        "partnerId": 3,
        "parentId": null,
        "name": "Carlos García",
        "generation": 2,
        "relation": "Yerno",
        "description": "Carlos es diseñador gráfico y se unió a la familia al casarse con Ana.",
        "birthDate": "1974-09-30",
        "deathDate": "",
        "birthPlace": "Sevilla, España",
        "photoUrl": "https://placekitten.com/223/223",
        "notes": "Aficionado a la fotografía."
      },
      {
        "id": 5,
        "partnerId": null,
        "parentId": 3,
        "name": "Lucía García",
        "generation": 3,
        "relation": "Nieta",
        "description": "Lucía está estudiando arquitectura.",
        "birthDate": "2000-05-12",
        "deathDate": "",
        "birthPlace": "Madrid, España",
        "photoUrl": "https://placekitten.com/224/224",
        "notes": "Le encanta viajar."
      },
      {
        "id": 6,
        "partnerId": null,
        "parentId": 3,
        "name": "Diego García",
        "generation": 3,
        "relation": "Nieto",
        "description": "Diego es aficionado a la música y toca la guitarra.",
        "birthDate": "2003-11-02",
        "deathDate": "",
        "birthPlace": "Madrid, España",
        "photoUrl": "https://placekitten.com/225/225",
        "notes": "Sueña con tener una banda de rock."
      },
      {
        "id": 7,
        "partnerId": null,
        "parentId": 1,
        "name": "Luis Pérez",
        "generation": 2,
        "relation": "Hijo",
        "description": "Luis trabaja como ingeniero informático.",
        "birthDate": "1979-04-08",
        "deathDate": "",
        "birthPlace": "Madrid, España",
        "photoUrl": "https://placekitten.com/226/226",
        "notes": "El 'informático' de la familia."
      }
    ];

    // ==========
    // Preparar estructuras auxiliares
    // ==========
    const peopleById = new Map();
    peopleData.forEach(p => peopleById.set(p.id, p));

    // hijos por parentId (se asume que parentId apunta a uno de los miembros de la pareja)
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
      // Si tiene pareja, solo se dibuja una vez: cuando id < partnerId
      if (person.partnerId) {
        return person.id < person.partnerId;
      }
      return true;
    }

    // ==========
    // Crear DOM de persona y matrimonio
    // ==========
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
      roleSpan.textContent = person.relation || `Generación ${person.generation}`;

      div.appendChild(img);
      div.appendChild(nameSpan);
      div.appendChild(roleSpan);

      // evento de clic
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
        // persona sin pareja
        const single = createPersonNode(person);
        return { container: single, partner: null };
      }
    }

    // ==========
    // Construir recursivamente el árbol
    // ==========
    function buildSubTree(person, isRoot = false) {
      const li = document.createElement("li");
      const { container, partner } = createMarriageBlock(person, isRoot);
      li.appendChild(container);

      // buscar hijos de esta persona (y opcionalmente de su pareja)
      let children = childrenByParentId.get(person.id) || [];

      if (partner && childrenByParentId.has(partner.id)) {
        children = children.concat(childrenByParentId.get(partner.id));
      }

      // evitar duplicados por unión de arrays
      const seenIds = new Set();
      children = children.filter(child => {
        if (seenIds.has(child.id)) return false;
        seenIds.add(child.id);
        return true;
      });

      // solo renderizamos hijos "primarios" (para no duplicar parejas)
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

      // raíces: sin parentId y que sean "primarios" (una sola vez por pareja)
      const roots = peopleData.filter(
        p => p.parentId == null && shouldRenderAsPrimary(p)
      );

      roots.forEach(rootPerson => {
        rootUl.appendChild(buildSubTree(rootPerson, true));
      });

      treeContainer.appendChild(rootUl);
    }

    // ==========
    // Lógica de la tarjeta de información
    // ==========
    const infoCard = document.getElementById("info-card");
    const infoPlaceholder = document.getElementById("info-placeholder");

    const infoPhoto = document.getElementById("info-photo");
    const infoName = document.getElementById("info-name");
    const infoRelation = document.getElementById("info-relation");
    const infoGeneration = document.getElementById("info-generation");
    const infoDates = document.getElementById("info-dates");
    const infoDescription = document.getElementById("info-description");
    const infoBirthplace = document.getElementById("info-birthplace");
    const infoSpouses = document.getElementById("info-spouses");
    const infoNotes = document.getElementById("info-notes");
    const closeBtn = document.getElementById("close-card");

    function showPerson(id) {
      const person = peopleById.get(Number(id));
      if (!person) return;

      infoPhoto.src = person.photoUrl || "https://via.placeholder.com/72";
      infoPhoto.alt = person.name;
      infoName.textContent = person.name;
      infoRelation.textContent = person.relation || "Familiar";
      infoGeneration.textContent = person.generation
        ? `Generación ${person.generation}`
        : "";

      // Fechas
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

      // Parejas
      if (person.partnerId) {
        const spouse = peopleById.get(person.partnerId);
        infoSpouses.textContent = spouse ? spouse.name : "—";
      } else {
        infoSpouses.textContent = "—";
      }

      infoPlaceholder.classList.add("hidden");
      infoCard.classList.remove("hidden");
    }

    closeBtn.addEventListener("click", () => {
      infoCard.classList.add("hidden");
      infoPlaceholder.classList.remove("hidden");
    });

    // ==========
    // Arrancar
    // ==========
    buildTree();
