// <verumano-badge creator="HO-2026-0001" discipline="illustration"></verumano-badge>
// Shows the official badge, rendered live by the label (so a revocation
// appears automatically), linked to the creator's verification page.
import { DEFAULT_BASE, ID_PATTERN, verifyUrl } from './index.js';

const DISCIPLINES = ['writing', 'illustration', 'photography', 'music', 'video'];
const SIZES = { l: [380, 112], m: [300, 88], s: [230, 48] };

if (typeof customElements !== 'undefined' && !customElements.get('verumano-badge')) {
  class VerumanoBadge extends HTMLElement {
    static get observedAttributes() { return ['creator', 'discipline', 'theme', 'size', 'base']; }
    connectedCallback() { this.render(); }
    attributeChangedCallback() { if (this.isConnected) this.render(); }
    render() {
      const id = this.getAttribute('creator') || '';
      const discipline = this.getAttribute('discipline') || '';
      const theme = this.getAttribute('theme') === 'dark' ? 'dark' : 'light';
      const size = SIZES[this.getAttribute('size')] ? this.getAttribute('size') : 'l';
      const base = (this.getAttribute('base') || DEFAULT_BASE).replace(/\/+$/, '');
      this.textContent = '';
      if (!ID_PATTERN.test(id) || !DISCIPLINES.includes(discipline)) {
        console.warn('[verumano-badge] needs a valid creator ID and discipline', { id, discipline });
        return;
      }
      const number = id.split('-')[2];
      const a = document.createElement('a');
      a.href = verifyUrl(id, base);
      a.rel = 'noopener';
      const img = document.createElement('img');
      img.src = `${base}/badges/badge-${discipline}-reviewed-${theme}-${number}${size === 'l' ? '' : '-' + size}.svg`;
      img.width = SIZES[size][0];
      img.height = SIZES[size][1];
      img.alt = `Verumano: human-made ${discipline}, check status for ${id}`;
      img.loading = 'lazy';
      img.decoding = 'async';
      a.append(img);
      this.append(a);
    }
  }
  customElements.define('verumano-badge', VerumanoBadge);
}
