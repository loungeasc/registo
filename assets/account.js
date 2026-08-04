// ============================================================
// WIDGET DE CONTA — comum a todas as páginas do portal
// ============================================================
// Uso: colocar <div id="acct-mount"></div> no canto direito do
// cabeçalho da página (data-theme="light" para cabeçalhos claros)
// e incluir este script depois do supabaseClient.js.
// Renderiza: avatar com iniciais + nome + perfil + menu com
// "Alterar palavra-passe" e "Terminar sessão".

(function () {
  const SRC = (document.currentScript && document.currentScript.src) || '';
  const BASE = SRC.replace(/assets\/account\.js.*$/, '');
  const ROLES = {
    admin: 'Administrador',
    supervisor_pse: 'Supervisor PSE',
    armazem: 'Armazém',
    operador_pse: 'Operador PSE',
  };

  const CSS = `
.pacct{position:relative;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;}
.pacct__chip{display:flex;align-items:center;gap:10px;border-radius:999px;padding:4px 12px 4px 5px;
  cursor:pointer;transition:background .15s,border-color .15s;user-select:none;border:1px solid transparent;}
.pacct--dark .pacct__chip{background:rgba(255,255,255,.08);border-color:rgba(255,255,255,.16);}
.pacct--dark .pacct__chip:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.3);}
.pacct--light .pacct__chip{background:#f2f5f9;border-color:#dbe3ec;}
.pacct--light .pacct__chip:hover{background:#e8eef6;border-color:#c3d0e0;}
.pacct__avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#2f6fb3,#1e4a86);
  display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;}
.pacct__meta{line-height:1.2;text-align:left;}
.pacct__name{font-size:12.5px;font-weight:600;white-space:nowrap;}
.pacct--dark .pacct__name{color:#fff;}
.pacct--light .pacct__name{color:#1a2332;}
.pacct__role{font-size:10px;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap;}
.pacct--dark .pacct__role{color:rgba(255,255,255,.6);}
.pacct--light .pacct__role{color:#6b7c93;}
.pacct__chev{font-size:9px;margin-left:1px;transition:transform .15s;}
.pacct--dark .pacct__chev{color:rgba(255,255,255,.55);}
.pacct--light .pacct__chev{color:#8b98ab;}
.pacct.open .pacct__chev{transform:rotate(180deg);}
.pacct__menu{position:absolute;right:0;top:calc(100% + 10px);background:#fff;color:#1a2332;
  border:1px solid #e2e6ed;border-radius:12px;min-width:232px;overflow:hidden;
  box-shadow:0 18px 44px rgba(15,25,50,.18);display:none;z-index:500;text-align:left;}
.pacct.open .pacct__menu{display:block;}
.pacct__mhead{padding:12px 16px 10px;border-bottom:1px solid #e2e6ed;background:#fafbfd;}
.pacct__mname{font-size:13px;font-weight:700;}
.pacct__mmail{font-size:11px;color:#6b7c93;margin-top:2px;word-break:break-all;}
.pacct__item{display:flex;align-items:center;gap:10px;width:100%;padding:11px 16px;background:none;
  border:none;font:inherit;font-size:13px;color:#1a2332;cursor:pointer;text-align:left;}
.pacct__item:hover{background:#e8f1fa;}
.pacct__item--exit{color:#b3261e;border-top:1px solid #e2e6ed;}
.pacct__item--exit:hover{background:#fbe9e7;}
.pacct__ico{width:16px;text-align:center;opacity:.75;}
#pacct-pw-overlay{position:fixed;inset:0;background:rgba(15,30,40,.55);display:none;
  align-items:center;justify-content:center;z-index:600;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;}
#pacct-pw-overlay .pacct-box{background:#fff;border-radius:14px;padding:26px 26px 22px;
  width:min(92vw,380px);box-shadow:0 18px 50px rgba(0,0,0,.25);color:#1a2332;}
#pacct-pw-overlay h2{margin:0 0 6px;font-size:17px;color:#14313f;font-weight:700;}
#pacct-pw-overlay p.sub{margin:0 0 16px;font-size:13px;color:#5f6b74;}
#pacct-pw-overlay label{display:block;font-size:12.5px;font-weight:600;color:#31434e;margin:10px 0 5px;}
#pacct-pw-overlay input{width:100%;box-sizing:border-box;border:1px solid #ccd6de;border-radius:8px;
  padding:10px 12px;font-size:14px;font-family:inherit;outline:none;}
#pacct-pw-overlay input:focus{border-color:#1e6bbf;box-shadow:0 0 0 3px rgba(30,107,191,.14);}
#pacct-pw-overlay .pacct-row{display:flex;gap:10px;margin-top:18px;}
#pacct-pw-overlay button{flex:1;border:none;border-radius:8px;padding:11px 0;font-size:14px;
  font-weight:600;cursor:pointer;font-family:inherit;}
#pacct-pw-overlay #pacct-pw-save{background:#1a2e5a;color:#fff;}
#pacct-pw-overlay #pacct-pw-save:disabled{opacity:.6;cursor:wait;}
#pacct-pw-overlay #pacct-pw-cancel{background:#eef2f4;color:#31434e;}
#pacct-pw-overlay #pacct-pw-msg{margin:12px 0 0;font-size:13px;text-align:center;}
`;

  function injectCss() {
    if (document.getElementById('pacct-css')) return;
    const st = document.createElement('style');
    st.id = 'pacct-css';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function iniciais(nome) {
    const parts = String(nome || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '·';
    const a = parts[0][0] || '';
    const b = parts.length > 1 ? parts[parts.length - 1][0] : '';
    return (a + b).toUpperCase();
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function buildModal() {
    if (document.getElementById('pacct-pw-overlay')) return;
    const div = document.createElement('div');
    div.id = 'pacct-pw-overlay';
    div.innerHTML = `
      <div class="pacct-box">
        <h2>Alterar palavra-passe</h2>
        <p class="sub">A nova palavra-passe passa a ser pedida no próximo login.</p>
        <form id="pacct-pw-form" novalidate>
          <label for="pacct-pw-new1">Nova palavra-passe</label>
          <input type="password" id="pacct-pw-new1" autocomplete="new-password" minlength="8" required />
          <label for="pacct-pw-new2">Repetir a nova palavra-passe</label>
          <input type="password" id="pacct-pw-new2" autocomplete="new-password" minlength="8" required />
          <div class="pacct-row">
            <button type="submit" id="pacct-pw-save">Guardar</button>
            <button type="button" id="pacct-pw-cancel">Cancelar</button>
          </div>
          <p id="pacct-pw-msg" role="alert" hidden></p>
        </form>
      </div>`;
    document.body.appendChild(div);

    const overlay = div;
    const msg = div.querySelector('#pacct-pw-msg');
    div.querySelector('#pacct-pw-cancel').addEventListener('click', () => { overlay.style.display = 'none'; });
    overlay.addEventListener('click', (ev) => { if (ev.target === overlay) overlay.style.display = 'none'; });
    div.querySelector('#pacct-pw-form').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const p1 = div.querySelector('#pacct-pw-new1').value;
      const p2 = div.querySelector('#pacct-pw-new2').value;
      msg.hidden = false;
      if (p1.length < 8) { msg.style.color = '#b3261e'; msg.textContent = 'Mínimo de 8 caracteres.'; return; }
      if (p1 !== p2) { msg.style.color = '#b3261e'; msg.textContent = 'As palavras-passe não coincidem.'; return; }
      const btn = div.querySelector('#pacct-pw-save');
      btn.disabled = true; btn.textContent = 'A guardar…';
      try {
        const { error } = await window.supabaseClient.auth.updateUser({ password: p1 });
        if (error) throw error;
        msg.style.color = '#1a7f37';
        msg.textContent = '✓ Palavra-passe alterada.';
        setTimeout(() => { overlay.style.display = 'none'; }, 1200);
      } catch (err) {
        msg.style.color = '#b3261e';
        msg.textContent = 'Erro: ' + (err.message || err);
      } finally {
        btn.disabled = false; btn.textContent = 'Guardar';
      }
    });
  }

  function openModal() {
    const overlay = document.getElementById('pacct-pw-overlay');
    overlay.querySelector('#pacct-pw-new1').value = '';
    overlay.querySelector('#pacct-pw-new2').value = '';
    overlay.querySelector('#pacct-pw-msg').hidden = true;
    overlay.style.display = 'flex';
    overlay.querySelector('#pacct-pw-new1').focus();
  }

  async function mount() {
    const el = document.getElementById('acct-mount');
    if (!el || !window.supabaseClient) return;

    let session = null;
    try { session = (await window.supabaseClient.auth.getSession()).data.session; } catch (e) { return; }
    if (!session) return;

    let profile = null;
    try {
      profile = (await window.supabaseClient
        .from('profiles').select('full_name, role').eq('id', session.user.id).single()).data;
    } catch (e) { /* segue com o email */ }

    const nome = (profile && profile.full_name) || session.user.email || '—';
    const role = (profile && (ROLES[profile.role] || profile.role)) || '';
    const email = session.user.email || '';
    const tema = el.dataset.theme === 'light' ? 'light' : 'dark';

    injectCss();
    buildModal();

    el.classList.add('pacct', 'pacct--' + tema);
    el.innerHTML = `
      <div class="pacct__chip" role="button" tabindex="0" title="A minha conta">
        <div class="pacct__avatar">${esc(iniciais(nome))}</div>
        <div class="pacct__meta">
          <div class="pacct__name">${esc(nome)}</div>
          <div class="pacct__role">${esc(role)}</div>
        </div>
        <span class="pacct__chev">▼</span>
      </div>
      <div class="pacct__menu">
        <div class="pacct__mhead">
          <div class="pacct__mname">${esc(nome)}</div>
          <div class="pacct__mmail">${esc(email)}</div>
        </div>
        <button type="button" class="pacct__item" data-act="pw"><span class="pacct__ico">🔑</span> Alterar palavra-passe</button>
        <button type="button" class="pacct__item pacct__item--exit" data-act="out"><span class="pacct__ico">⏻</span> Terminar sessão</button>
      </div>`;

    const chip = el.querySelector('.pacct__chip');
    chip.addEventListener('click', () => el.classList.toggle('open'));
    chip.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); el.classList.toggle('open'); } });
    document.addEventListener('click', (ev) => { if (!el.contains(ev.target)) el.classList.remove('open'); });
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') el.classList.remove('open'); });

    el.querySelector('[data-act="pw"]').addEventListener('click', () => { el.classList.remove('open'); openModal(); });
    el.querySelector('[data-act="out"]').addEventListener('click', async () => {
      try { await window.supabaseClient.auth.signOut(); } catch (e) {}
      window.location.href = BASE + 'index.html';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
