(async function renderSonnet() {
  const mount = document.querySelector("[data-sonnet-reader]");

  if (!mount) return;

  try {
    const response = await fetch("sonnet.json", { cache: "no-cache" });
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

    setText("[data-title]", sonnet.displayTitle || sonnet.title);
    setText("[data-byline]", sonnet.author || "William Shakespeare");

    const headings = mount.querySelectorAll("[data-column-heading]");
    [labels.original, labels.english, labels.translation].forEach((label, index) => {
      if (headings[index]) headings[index].textContent = label;
    });

    const lines = mount.querySelector("[data-lines]");
    if (!lines) throw new Error("The reading-page template is missing its lines container.");
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

    let note = mount.querySelector("[data-translator-note]");
    if (sonnet.translatorNote) {
      if (!note) {
        note = document.createElement("section");
        note.className = "translator-note";
        note.dataset.translatorNote = "";
        note.innerHTML = '<h2 data-note-title></h2><p data-note-text></p>';
        mount.append(note);
      }

      note.querySelector("[data-note-title]").textContent =
        sonnet.translatorNoteTitle || "Çevirmenin Notu";
      note.querySelector("[data-note-text]").textContent = sonnet.translatorNote;
      note.hidden = false;
    } else if (note) {
      note.remove();
    }

    setNavigation("previous", sonnet.previous);
    setNavigation("next", sonnet.next);

    function setNavigation(direction, target) {
      const link = document.querySelector(`[data-${direction}]`);
      if (!link) return;

      if (!target) {
        link.hidden = true;
        return;
      }

      link.href = target.href;
      link.textContent = direction === "previous" ? `← ${target.label}` : `${target.label} →`;
    }

    function setText(selector, value) {
      const element = mount.querySelector(selector);
      if (element) element.textContent = value;
    }
  } catch (error) {
    const message = document.createElement("p");
    message.className = "error";
    message.textContent = `This sonnet could not be loaded. ${error.message}`;
    mount.replaceChildren(message);
  }
})();
