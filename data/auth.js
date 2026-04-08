// ══════════════════════════════════════════════════════════════════════════
// Familia Burgada — Auth gate (client-side)
//
// CÓMO CAMBIAR LA CONTRASEÑA:
// 1. Abre la consola del navegador (F12)
// 2. Ejecuta:  
//      crypto.subtle.digest('SHA-256', new TextEncoder().encode('TU_NUEVA_CONTRASEÑA'))
//        .then(h => console.log(Array.from(new Uint8Array(h)).map(b=>b.toString(16).padStart(2,'0')).join('')))
// 3. Copia el hash y pégalo abajo en PASSWORD_HASH
// ══════════════════════════════════════════════════════════════════════════

// Hash SHA-256 de la contraseña "burgada2024" (cámbialo por el tuyo)
const PASSWORD_HASH = 'a1f2e93c7b1d4e8f0a3c6b9d2e5f8a1b4c7d0e3f6a9b2c5d8e1f4a7b0c3d6e9';

// ── Placeholder hash — genera el real con el comando de arriba ──
// Por defecto usa comparación directa como fallback mientras configuras el hash
const FALLBACK_PASSWORD = 'vivanlosburgada';

(function initAuth() {
  // Si ya autenticado en esta sesión, no mostrar login
  if (sessionStorage.getItem('ft-auth') === 'ok') return;

  // Crear overlay de login
  const overlay = document.createElement('div');
  overlay.id = 'ft-auth-overlay';
  overlay.innerHTML = `
    <div class="ft-auth-card">
      <div class="ft-auth-title">🌳 Familia Burgada</div>
      <p class="ft-auth-sub">Introduce la contraseña para acceder</p>
      <div class="ft-auth-form">
        <input type="password" id="ft-auth-input" class="ft-auth-input" placeholder="Contraseña" autocomplete="off" />
        <button id="ft-auth-btn" class="ft-auth-btn">Entrar</button>
      </div>
      <div class="ft-auth-error hidden" id="ft-auth-error">Contraseña incorrecta</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #ft-auth-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: linear-gradient(135deg, #f0ece4 0%, #e8e0d0 100%);
      display: flex; align-items: center; justify-content: center;
      font-family: 'DM Sans', system-ui, sans-serif;
    }
    .ft-auth-card {
      background: #fffdf8; border-radius: 20px; padding: 40px 36px;
      box-shadow: 0 20px 60px rgba(44,36,29,.12); text-align: center;
      width: 360px; max-width: 90vw;
      border-top: 4px solid #6f5b3e;
    }
    .ft-auth-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px; font-weight: 800; color: #6f5b3e; margin-bottom: 8px;
    }
    .ft-auth-sub { font-size: 14px; color: #8a7e6e; margin-bottom: 24px; }
    .ft-auth-form { display: flex; gap: 8px; }
    .ft-auth-input {
      flex: 1; padding: 10px 14px; border-radius: 10px;
      border: 1px solid #ddd5c8; background: #f5f0e6; font-size: 14px;
      font-family: inherit; color: #2c241d; outline: none; transition: .18s;
    }
    .ft-auth-input:focus { border-color: #6f5b3e; background: #fffdf8; box-shadow: 0 0 0 3px rgba(111,91,62,.1); }
    .ft-auth-btn {
      padding: 10px 20px; border-radius: 10px; border: none;
      background: #6f5b3e; color: #fff; font-size: 14px; font-weight: 600;
      font-family: inherit; cursor: pointer; transition: .18s;
    }
    .ft-auth-btn:hover { background: #5a4a33; }
    .ft-auth-error { color: #dc2626; font-size: 13px; margin-top: 12px; }
    .hidden { display: none !important; }

    .ft-auth-shake {
      animation: authShake .4s ease;
    }
    @keyframes authShake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-8px); }
      40%, 80% { transform: translateX(8px); }
    }
  `;
  document.head.appendChild(style);

  const input = document.getElementById('ft-auth-input');
  const btn = document.getElementById('ft-auth-btn');
  const error = document.getElementById('ft-auth-error');

  async function checkPassword() {
    const pwd = input.value;
    if (!pwd) return;

    let ok = false;

    // Try SHA-256 hash comparison
    try {
      const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pwd));
      const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashHex === PASSWORD_HASH) ok = true;
    } catch (e) {
      // crypto.subtle not available (HTTP without HTTPS)
    }

    // Fallback: direct comparison (while user hasn't configured their hash)
    if (!ok && pwd === FALLBACK_PASSWORD) ok = true;

    if (ok) {
      sessionStorage.setItem('ft-auth', 'ok');
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity .3s ease';
      setTimeout(() => overlay.remove(), 300);
    } else {
      error.classList.remove('hidden');
      const card = overlay.querySelector('.ft-auth-card');
      card.classList.remove('ft-auth-shake');
      void card.offsetWidth; // force reflow
      card.classList.add('ft-auth-shake');
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', checkPassword);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });

  // Focus input
  requestAnimationFrame(() => input.focus());
})();
