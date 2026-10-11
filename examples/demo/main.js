import { getCreator, checkFile, VerumanoError } from 'verumano';
import 'verumano/badge';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const STATUS = { reviewed: 'Process reviewed', revoked: 'Badge revoked', declared: 'Self-declared' };

// 1. Look up a creator
async function lookup(id) {
  const out = $('creator');
  out.className = 'out';
  out.textContent = 'Checking…';
  try {
    const record = await getCreator(id);
    if (!record) {
      out.classList.add('bad');
      out.textContent = `${id} is not registered.`;
      showBadge(null);
      return;
    }
    const c = record.creator;
    out.classList.add(c.status === 'reviewed' ? 'ok' : 'bad');
    out.innerHTML = `
      <p class="status">${esc(STATUS[c.status] || c.status)}${c.demo ? ' <em>(demo record)</em>' : ''}</p>
      <dl>
        <dt>Creator</dt><dd>${esc(c.name)}</dd>
        <dt>Disciplines</dt><dd>${esc((c.disciplines || []).join(', '))}</dd>
        <dt>Scope</dt><dd>${esc(c.scope)}</dd>
        <dt>Reviewed on</dt><dd>${esc(c.reviewed_on)} · ${esc(c.method)}</dd>
      </dl>
      <a href="${esc(c.url)}" target="_blank" rel="noopener">Open the verification page →</a>`;
    showBadge(c);
  } catch (e) {
    out.classList.add('bad');
    out.textContent = e instanceof VerumanoError ? e.message : 'Network error, try again.';
  }
}

// 2. Show the live badge
function showBadge(c) {
  const box = $('badge');
  box.textContent = '';
  if (!c || !c.disciplines?.length) {
    $('snippet').textContent = '<!-- no badge for an unregistered ID -->';
    return;
  }
  const el = document.createElement('verumano-badge');
  el.setAttribute('creator', c.id);
  el.setAttribute('discipline', c.disciplines[0]);
  box.append(el);
  $('snippet').textContent =
    `<script type="module" src="https://cdn.jsdelivr.net/npm/verumano@0.1/badge.js"></script>\n` +
    `<verumano-badge creator="${c.id}" discipline="${c.disciplines[0]}"></verumano-badge>`;
}

// 3. Check an exact file
async function check(file) {
  const out = $('result');
  const bar = $('progress');
  out.className = 'out';
  out.textContent = `Hashing ${file.name}…`;
  bar.hidden = false;
  bar.value = 0;
  try {
    const res = await checkFile(file, { onProgress: (p) => (bar.value = p) });
    bar.hidden = true;
    const fp = `<code class="hash">${res.sha256}</code>`;
    if (!res.matches.length) {
      out.innerHTML = `<p class="status">Not registered</p><p>This exact file is not certified. A re-exported or resized copy would not match either.</p>${fp}`;
      return;
    }
    const m = res.matches[0];
    out.classList.add(m.status === 'reviewed' ? 'ok' : 'bad');
    out.innerHTML = `<p class="status">${esc(m.status === 'reviewed' ? 'Certified work' : 'Match on a revoked record')}</p>
      <p>${esc(m.title)} by ${esc(m.creator)} (${esc(m.creator_id)})</p>${fp}`;
  } catch (e) {
    bar.hidden = true;
    out.classList.add('bad');
    out.textContent = e instanceof VerumanoError ? e.message : 'Network error, try again.';
  }
}

$('lookup').addEventListener('submit', (e) => {
  e.preventDefault();
  lookup($('id').value.trim());
});
$('file').addEventListener('change', (e) => e.target.files[0] && check(e.target.files[0]));
const drop = $('drop');
['dragenter', 'dragover'].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((t) => drop.addEventListener(t, () => drop.classList.remove('over')));
drop.addEventListener('drop', (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) check(f); });

lookup($('id').value);
