(async function renderSonnet() {
  const mount = document.querySelector("[data-sonnet-reader]");

  if (!mount) return;

  try {
    const response = await fetch("sonnet.json");
    if (!response.ok) throw new Error(`Could not load sonnet.json (${response.status})`);

    const sonnet = await response.json();
    const labels = {
      original: "Original",
      english: "Modern English",
      translation: "Türkçe",
      ...(sonnet.columnLabels || {}),
    };

    document.title = `${sonnet.displayTitle || sonnet.title} — Dağhan Erdönmez`;
    document.documentElement.lang = sonnet.pageLanguage || "en";

    mount.querySelector("[data-title]").textContent = sonnet.displayTitle || sonnet.title;
    mount.querySelector("[data-byline]").textContent = sonnet.author || "William Shakespeare";

    const headings = mount.querySelectorAll("[data-column-heading]");
    headings[0].textContent = labels.original;
    headings[1].textContent = labels.english;
    headings[2].textContent = labels.translation;

    const lines = mount.querySelector("[data-lines]");
    const fragment = document.createDocumentFragment();

    sonnet.lines.forEach((line, index) => {
      const row = document.createElement("div");
      row.className = "line-row";
      row.dataset.group = line.group || "quatrain-1";

      const number = document.createElement("span");
      number.className = "line-number";
      number.textContent = String(index + 1);
      number.setAttribute("aria-hidden", "true");
      row.append(number);

      ["original", "english", "translation"].forEach((key) => {
        const cell = document.createElement("div");
        cell.className = `line-cell ${key}`;
        cell.dataset.label = labels[key];

        const text = document.createElement("span");
        text.className = "line-text";
        text.textContent = line[key] || "—";
        if (!line[key]) text.classList.add("is-empty");

        cell.append(text);
        row.append(cell);
      });

      fragment.append(row);
    });

    lines.replaceChildren(fragment);

    const note = mount.querySelector("[data-translator-note]");
    if (sonnet.translatorNote) {
      note.querySelector("[data-note-title]").textContent =
        sonnet.translatorNoteTitle || "Çevirmenin Notu";
      note.querySelector("[data-note-text]").textContent = sonnet.translatorNote;
      note.hidden = false;
    } else {
      note.remove();
    }

    setNavigation("previous", sonnet.previous);
    setNavigation("next", sonnet.next);

    function setNavigation(direction, target) {
      const link = document.querySelector(`[data-${direction}]`);
      if (!target) {
        link.hidden = true;
        return;
      }

      link.href = target.href;
      link.textContent = direction === "previous" ? `← ${target.label}` : `${target.label} →`;
    }
  } catch (error) {
    mount.innerHTML = `<p class="error">This sonnet could not be loaded. ${error.message}</p>`;
  }
})();
