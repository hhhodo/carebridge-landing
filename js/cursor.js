/* 노란 원 커스텀 커서 + 히어로 뱃지가 커서에 닿으면 살짝 밀려나는 인터랙션.
   포인터가 있는 기기(마우스)에서만 동작한다. */
(() => {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  const dot = document.createElement('div');
  dot.id = 'rc-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  const chips = Array.from(document.querySelectorAll('.rc-chip'));
  const REACH = 140;
  const PUSH = 36;

  let raf = null;

  function update(x, y) {
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    chips.forEach((chip) => {
      const r = chip.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = cx - x;
      const dy = cy - y;
      const dist = Math.hypot(dx, dy) || 1;

      if (dist < REACH) {
        const ratio = 1 - dist / REACH;
        chip.style.marginLeft = `${(dx / dist) * PUSH * ratio}px`;
        chip.style.marginTop = `${(dy / dist) * PUSH * ratio}px`;
      } else {
        chip.style.marginLeft = '';
        chip.style.marginTop = '';
      }
    });
  }

  window.addEventListener('mousemove', (e) => {
    if (raf) return;
    const { clientX, clientY } = e;
    raf = requestAnimationFrame(() => {
      raf = null;
      update(clientX, clientY);
    });
  }, { passive: true });
})();
