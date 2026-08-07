/* ─────────────────────────────────────────────────────────
   Date Invitation — script.js
   ───────────────────────────────────────────────────────── */

'use strict';

// ── State ────────────────────────────────────────────────
let currentPage = 1;
let loadingDone = false;

// ── Boot ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  spawnFloatingHearts();
  startLoadingBar();

  // Mobile: also run away on touchmove (finger dragging toward button)
  document.addEventListener('touchmove', (e) => {
    const btn = document.getElementById('noBtnPage6');
    if (!btn || !noFixed) return;
    const touch = e.touches[0];
    const rect  = btn.getBoundingClientRect();
    const bx    = rect.left + rect.width  / 2;
    const by    = rect.top  + rect.height / 2;
    const dist  = Math.hypot(touch.clientX - bx, touch.clientY - by);
    if (dist < 120) runAwayNo(e);
  }, { passive: true });
});

// ── Floating hearts background ───────────────────────────
function spawnFloatingHearts() {
  const container = document.getElementById('heartsBg');
  const emojis = ['🩷', '💕', '💗', '💖', '❤️', '🌸', '✨'];
  const count = 18;

  for (let i = 0; i < count; i++) {
    const span = document.createElement('span');
    span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    span.style.left = Math.random() * 100 + 'vw';
    span.style.fontSize = (Math.random() * 1.2 + 0.8) + 'rem';
    span.style.animationDuration = (Math.random() * 10 + 8) + 's';
    span.style.animationDelay = (Math.random() * 12) + 's';
    container.appendChild(span);
  }
}

// ── Loading bar (Page 1) ─────────────────────────────────
function startLoadingBar() {
  const bar  = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  let progress = 0;

  const interval = setInterval(() => {
    const step = Math.random() * 4 + 1;
    progress = Math.min(progress + step, 100);

    bar.style.width  = progress + '%';
    text.textContent = Math.floor(progress) + '%';

    if (progress >= 100) {
      clearInterval(interval);
      loadingDone = true;
      bar.style.width  = '100%';
      text.textContent = '100%';

      // Auto-advance to page 2 after a short delay
      setTimeout(() => goToPage(2), 900);
    }
  }, 60);
}

// ── Navigation ───────────────────────────────────────────
function goToPage(pageId) {
  const current = document.querySelector('.page.active');
  if (!current) return;

  const prevPageId = current.id.replace('page', '');   // e.g. "6"
  const nextId   = 'page' + pageId;
  const nextPage = document.getElementById(nextId);
  if (!nextPage) return;

  // Slide out current
  current.style.animation = 'fadeSlideOut 0.4s ease forwards';
  setTimeout(() => {
    current.style.animation = '';
    current.classList.remove('active');
    current.style.display   = 'none';

    nextPage.style.display = 'flex';
    // Force reflow
    void nextPage.offsetWidth;
    nextPage.classList.add('active');
    nextPage.style.animation = 'fadeSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';

    currentPage = pageId;

    // Trigger page-specific effects
    if (pageId === '7a') triggerConfetti();
    // Reset No button if leaving page 6
    if (prevPageId === '6') resetNoBtn();

  }, 380);
}

// ── Confetti (page 7A) ───────────────────────────────────
function triggerConfetti() {
  const layer = document.getElementById('confettiLayer');
  if (!layer) return;
  layer.innerHTML = '';

  const pieces = ['🩷', '💖', '🎊', '✨', '💕', '🌸', '🎉'];
  for (let i = 0; i < 50; i++) {
    const el = document.createElement('span');
    el.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    el.style.cssText = `
      position: absolute;
      font-size: ${Math.random() * 1.2 + 0.7}rem;
      left: ${Math.random() * 100}%;
      top: -40px;
      animation: confettiFall ${Math.random() * 2.5 + 1.5}s ease-in ${Math.random() * 1.5}s forwards;
      pointer-events: none;
    `;
    layer.appendChild(el);
  }

  // Add confetti keyframes if not present
  if (!document.getElementById('confettiStyle')) {
    const s = document.createElement('style');
    s.id = 'confettiStyle';
    s.textContent = `
      @keyframes confettiFall {
        0%   { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        100% { opacity: 0; transform: translateY(500px) rotate(${360 + Math.random() * 360}deg) scale(0.6); }
      }
    `;
    document.head.appendChild(s);
  }
}

// ── Celebrate button ─────────────────────────────────────
function celebrate() {
  triggerConfetti();
  const btn = document.getElementById('cantWaitBtn');
  if (btn) {
    btn.textContent = '🩷 This is going to be wonderful! 🩷';
    btn.style.background = 'linear-gradient(135deg, #ff9dbf, #ffb8d4)';
    btn.disabled = true;
  }
  showToast('💕 You made his day just by saying YES!');
}

// ── Thank you toast (page 7B) ────────────────────────────
function showThankYou() {
  showToast('🩷 Whenever you\'re ready, he\'ll be waiting. 🌙');
  const btn = document.getElementById('thankYouBtn');
  if (btn) {
    btn.textContent = '💜 Thank you';
    btn.disabled = true;
  }
}

// ── Date Picker (page 7A) ────────────────────────────────
function onDatePicked() {
  const input   = document.getElementById('datePick');
  const preview = document.getElementById('dateChosenPreview');
  const text    = document.getElementById('dateChosenText');
  if (!input || !input.value) return;

  // Format date beautifully: "Saturday, 16 August 2025"
  const date = new Date(input.value + 'T00:00:00');
  const formatted = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric',
  });

  text.textContent = formatted;
  preview.style.display = 'flex';

  // Mini confetti burst on date pick
  triggerConfetti();
  showToast('📅 ' + formatted + ' — can\'t wait! 🩷');
}

// ── Toast helper ─────────────────────────────────────────
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}

// ═══════════════════════════════════════════════════════════
//   RUNAWAY "NO" BUTTON LOGIC
// ═══════════════════════════════════════════════════════════

let noDodgeCount = 0;
let noFixed = false;          // once the button goes fixed it stays that way
const noLabels = [
  'No 🙅',
  'Nope 🏃',
  'Never! 😤',
  'Can\'t catch me 😂',
  'Too slow! 👀',
  'Not a chance 😜',
  'Stop it 😩',
  'Please no 🫣',
  'Go away cursor 😂',
  'Fine... almost 😳',
  '... 🤔',
  'Hmm... 😅',
  'Maybe? 🤭',
  '*runs faster* 🏃‍♂️',
  'Just click YES! 💅',
];

function runAwayNo(e) {
  const btn = document.getElementById('noBtnPage6');
  const hint = document.getElementById('noHint');
  if (!btn) return;

  noDodgeCount++;

  // Update label with a funny rotating message
  const label = noLabels[Math.min(noDodgeCount - 1, noLabels.length - 1)];
  btn.textContent = label;

  // Shrink button after several dodges
  btn.classList.remove('shrink-1','shrink-2','shrink-3','shrink-4');
  if (noDodgeCount >= 10) btn.classList.add('shrink-4');
  else if (noDodgeCount >= 7) btn.classList.add('shrink-3');
  else if (noDodgeCount >= 4) btn.classList.add('shrink-2');
  else if (noDodgeCount >= 2) btn.classList.add('shrink-1');

  // Update hint
  if (hint) {
    const hintMsgs = [
      '⬆️ Click YES above!',
      '😂 It keeps running!',
      '🫣 Catch it if you can...',
      '💅 Just say YES already!',
      '🏃 It never stops!',
    ];
    hint.textContent = hintMsgs[Math.min(Math.floor(noDodgeCount / 2), hintMsgs.length - 1)];
  }

  // Make button position: fixed so it can escape anywhere on screen
  if (!noFixed) {
    const rect = btn.getBoundingClientRect();
    btn.style.position = 'fixed';
    btn.style.left     = rect.left + 'px';
    btn.style.top      = rect.top  + 'px';
    btn.style.zIndex   = '9000';
    btn.style.margin   = '0';
    noFixed = true;
  }

  // Get current button center
  const rect   = btn.getBoundingClientRect();
  const btnCx  = rect.left + rect.width  / 2;
  const btnCy  = rect.top  + rect.height / 2;

  // Get cursor position
  let cursorX, cursorY;
  if (e.touches) {
    cursorX = e.touches[0].clientX;
    cursorY = e.touches[0].clientY;
  } else {
    cursorX = e.clientX;
    cursorY = e.clientY;
  }

  // Escape vector (opposite direction of cursor)
  const dx = btnCx - cursorX;
  const dy = btnCy - cursorY;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;

  const escapeForce = 160 + noDodgeCount * 15;
  let newX = btnCx + (dx / dist) * escapeForce - rect.width  / 2;
  let newY = btnCy + (dy / dist) * escapeForce - rect.height / 2;

  // Keep button inside viewport with a margin
  const margin = 10;
  const maxX = window.innerWidth  - rect.width  - margin;
  const maxY = window.innerHeight - rect.height - margin;

  newX = Math.max(margin, Math.min(newX, maxX));
  newY = Math.max(margin, Math.min(newY, maxY));

  // If it would stay close to cursor (hit a wall), teleport it randomly
  const newCx = newX + rect.width  / 2;
  const newCy = newY + rect.height / 2;
  const newDist = Math.hypot(newCx - cursorX, newCy - cursorY);

  if (newDist < 80) {
    // Teleport to a random corner region
    const regions = [
      { x: margin,                                    y: margin },
      { x: window.innerWidth  - rect.width  - margin, y: margin },
      { x: margin,                                    y: window.innerHeight - rect.height - margin },
      { x: window.innerWidth  - rect.width  - margin, y: window.innerHeight - rect.height - margin },
      { x: (window.innerWidth  - rect.width)  / 2,    y: margin },
      { x: margin,                                    y: (window.innerHeight - rect.height) / 2 },
    ];
    // Pick the region furthest from the cursor
    let bestRegion = regions[0];
    let bestDist   = 0;
    for (const r of regions) {
      const d = Math.hypot(r.x + rect.width / 2 - cursorX, r.y + rect.height / 2 - cursorY);
      if (d > bestDist) { bestDist = d; bestRegion = r; }
    }
    newX = bestRegion.x;
    newY = bestRegion.y;
  }

  btn.style.transition = 'left 0.18s cubic-bezier(0.34,1.56,0.64,1), top 0.18s cubic-bezier(0.34,1.56,0.64,1)';
  btn.style.left = newX + 'px';
  btn.style.top  = newY + 'px';

  // Tiny shake animation
  btn.animate([
    { transform: 'rotate(-4deg) scale(1.05)' },
    { transform: 'rotate(4deg)  scale(0.95)' },
    { transform: 'rotate(0deg)  scale(1)'    },
  ], { duration: 220, easing: 'ease-out' });
}

// If somehow clicked (shouldn't happen), just flash NO
function noBtnClicked() {
  const btn = document.getElementById('noBtnPage6');
  if (btn) {
    btn.textContent = 'Nope! 😂';
    runAwayNo({ clientX: 0, clientY: 0 });
  }
}

// Reset No button when leaving page 6
function resetNoBtn() {
  noDodgeCount = 0;
  noFixed = false;
  const btn = document.getElementById('noBtnPage6');
  if (btn) {
    btn.style.position   = 'relative';
    btn.style.left       = '';
    btn.style.top        = '';
    btn.style.transition = '';
    btn.textContent      = 'No 🙅';
    btn.classList.remove('shrink-1','shrink-2','shrink-3','shrink-4');
  }
  const hint = document.getElementById('noHint');
  if (hint) hint.textContent = '⬆️ Click YES above!';
}
