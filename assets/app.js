(() => {
  const cardsEl = document.getElementById('cards');
  const emptyEl = document.getElementById('empty');
  const searchEl = document.getElementById('search');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  let scripts = [];

  const escapeHTML = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[c]));

  const installCommand = (file) =>
    `curl -fsSL ${location.origin}${location.pathname.replace(/\/[^/]*$/, '/')}${file} | bash`;

  const cardTemplate = (s) => {
    const tags = (s.tags || [])
      .map((t) => `<span class="tag">${escapeHTML(t)}</span>`)
      .join('');
    const fileHref = encodeURI(s.file);
    return `
      <article class="card" data-id="${escapeHTML(s.id)}">
        <h3>${escapeHTML(s.name)}</h3>
        <p>${escapeHTML(s.description || '')}</p>
        <div class="tags">${tags}</div>
        <div class="card-actions">
          <a href="${fileHref}" download class="primary">Download</a>
          <a href="${fileHref}" target="_blank" rel="noopener">View source</a>
          <a href="#" class="copy" data-cmd="${escapeHTML(installCommand(s.file))}">Copy install</a>
        </div>
      </article>
    `;
  };

  const render = (items) => {
    if (!items.length) {
      cardsEl.innerHTML = '';
      emptyEl.hidden = false;
      return;
    }
    emptyEl.hidden = true;
    cardsEl.innerHTML = items.map(cardTemplate).join('');
  };

  const filter = (q) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return scripts;
    return scripts.filter((s) => {
      const hay = [s.name, s.description, ...(s.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(needle);
    });
  };

  const onCopy = async (e) => {
    const target = e.target.closest('.copy');
    if (!target) return;
    e.preventDefault();
    const cmd = target.getAttribute('data-cmd') || '';
    try {
      await navigator.clipboard.writeText(cmd);
      const original = target.textContent;
      target.textContent = 'Copied!';
      setTimeout(() => (target.textContent = original), 1400);
    } catch {
      window.prompt('Copy install command:', cmd);
    }
  };

  const init = async () => {
    try {
      const res = await fetch('scripts.json', { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      scripts = Array.isArray(data) ? data : (data.scripts || []);
      render(scripts);
    } catch (err) {
      cardsEl.innerHTML = `
        <div class="loading">
          Could not load <code>scripts.json</code>${err && err.message ? ` (${escapeHTML(err.message)})` : ''}.
        </div>
      `;
    }
  };

  searchEl?.addEventListener('input', (e) => render(filter(e.target.value)));
  cardsEl?.addEventListener('click', onCopy);

  init();
})();
