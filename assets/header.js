// ============================================================
// CABEÇALHO-PADRÃO — comum a todas as páginas do portal
// ============================================================
// Uso:
//   <header id="portal-header" data-code="RMN" data-title="Remanescentes"
//           data-subtitle="Dashboard" data-theme="dark|light"
//           data-back="../../home.html|none" data-subtitle-id="page-title">
//     <template data-slot="left">…</template>     (opcional: ex. hamburger)
//     <template data-slot="actions">…</template>  (opcional: links/botões à direita)
//     <template data-slot="strip">…</template>    (opcional: linha inteira por baixo, ex. tabs)
//   </header>
//   <script src=".../assets/header.js"></script>  ← logo a seguir ao elemento
// Cria também o <div id="acct-mount"> onde o account.js monta o chip.

(function () {
  const CSS = `
.ph{position:sticky;top:0;z-index:90;display:block;margin:0;padding:0;width:100%;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;box-sizing:border-box;}
.ph *,.ph *::before,.ph *::after{box-sizing:border-box;}
.ph--dark{background:#1a2e5a;color:#fff;box-shadow:0 2px 12px rgba(10,20,45,.28);}
.ph--light{background:#fff;color:#1a2332;border-bottom:1px solid #e2e6ed;}
.ph__bar{height:70px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:0 24px;}
.ph__left{display:flex;align-items:center;gap:14px;min-width:0;}
.ph__back{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;
  font-size:12.5px;font-weight:600;text-decoration:none;white-space:nowrap;transition:all .15s;}
.ph--dark .ph__back{color:rgba(255,255,255,.78);border:1px solid rgba(255,255,255,.25);}
.ph--dark .ph__back:hover{color:#fff;border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.08);}
.ph--light .ph__back{color:#5f6b74;border:1px solid #d5dde8;}
.ph--light .ph__back:hover{color:#1a2e5a;border-color:#1a2e5a;background:#f2f6fb;}
.ph__mark{width:42px;height:42px;border-radius:10px;display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:13px;letter-spacing:.06em;flex-shrink:0;}
.ph--dark .ph__mark{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.28);color:#fff;}
.ph--light .ph__mark{background:#1a2e5a;color:#fff;}
.ph__titles{line-height:1.18;min-width:0;}
.ph__kicker{font-size:9.5px;letter-spacing:.22em;text-transform:uppercase;font-weight:700;white-space:nowrap;}
.ph--dark .ph__kicker{color:rgba(255,255,255,.52);}
.ph--light .ph__kicker{color:#8b98ab;}
.ph__name{font-size:16.5px;font-weight:700;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.ph__sub{font-size:13px;font-weight:500;}
.ph--dark .ph__sub{color:rgba(255,255,255,.62);}
.ph--light .ph__sub{color:#6b7c93;}
.ph__sub:not(:empty)::before{content:'· ';}
.ph__right{display:flex;align-items:center;gap:12px;flex-shrink:0;}
.ph__link{display:inline-flex;align-items:center;gap:5px;padding:6px 12px;border-radius:8px;
  font-size:12.5px;font-weight:600;text-decoration:none;white-space:nowrap;transition:all .15s;}
.ph--dark .ph__link{color:rgba(255,255,255,.78);border:1px solid rgba(255,255,255,.25);}
.ph--dark .ph__link:hover{color:#fff;border-color:rgba(255,255,255,.5);background:rgba(255,255,255,.08);}
.ph--light .ph__link{color:#5f6b74;border:1px solid #d5dde8;}
.ph--light .ph__link:hover{color:#1a2e5a;border-color:#1a2e5a;background:#f2f6fb;}
.ph__clock{font-family:ui-monospace,Consolas,monospace;font-size:14px;font-weight:600;
  font-variant-numeric:tabular-nums;letter-spacing:.06em;}
.ph--dark .ph__clock{color:rgba(255,255,255,.8);}
.ph--light .ph__clock{color:#5f6b74;}
.ph__strip{padding:8px 24px;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.ph--dark .ph__strip{background:#16264b;border-top:1px solid rgba(255,255,255,.07);}
.ph--light .ph__strip{background:#f7f9fc;border-top:1px solid #e2e6ed;}
.ph__strip .nav-tabs{margin-left:0;}
@media (max-width:820px){
  .ph__bar{padding:0 14px;gap:10px;}
  .ph__kicker{display:none;}
  .ph__mark{display:none;}
  .ph__name{font-size:15px;}
  .ph__clock{display:none;}
  .ph__strip{padding:8px 14px;}
}
`;

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function build() {
    const el = document.getElementById('portal-header');
    if (!el || el.dataset.built) return;
    el.dataset.built = '1';

    if (!document.getElementById('ph-css')) {
      const st = document.createElement('style');
      st.id = 'ph-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }

    const slots = { left: '', actions: '', strip: '' };
    el.querySelectorAll('template[data-slot]').forEach((t) => { slots[t.dataset.slot] = t.innerHTML; });

    const code = el.dataset.code || 'OPO';
    const title = el.dataset.title || 'Portal';
    const sub = el.dataset.subtitle || '';
    const subId = el.dataset.subtitleId || '';
    const theme = el.dataset.theme === 'light' ? 'light' : 'dark';
    const back = ('back' in el.dataset) ? el.dataset.back : '../../home.html';

    const backHtml = (back && back !== 'none')
      ? `<a class="ph__back" href="${esc(back)}">← Portal</a>` : '';
    const subHtml = (sub || subId)
      ? ` <span class="ph__sub"${subId ? ` id="${esc(subId)}"` : ''}>${esc(sub)}</span>` : '';

    el.classList.add('ph', 'ph--' + theme);
    el.innerHTML =
      `<div class="ph__bar">` +
        `<div class="ph__left">${slots.left}${backHtml}` +
          `<div class="ph__mark">${esc(code)}</div>` +
          `<div class="ph__titles">` +
            `<div class="ph__kicker">Porto Airport Lounge</div>` +
            `<div class="ph__name">${esc(title)}${subHtml}</div>` +
          `</div>` +
        `</div>` +
        `<div class="ph__right">${slots.actions}` +
          `<div id="acct-mount"${theme === 'light' ? ' data-theme="light"' : ''}></div>` +
        `</div>` +
      `</div>` +
      (slots.strip ? `<div class="ph__strip">${slots.strip}</div>` : '');
  }

  build();
  document.addEventListener('DOMContentLoaded', build);
})();
