/* 히어로 뱃지가 마우스 근처에 오면 살짝 밀려나는 인터랙션.
   기본 시스템 커서는 그대로 두고(숨기지 않음), 뱃지 반응만 남긴다 —
   이전에 커스텀 커서 점(dot)을 그리던 방식이 마우스 자체를 안 보이게 만드는
   문제가 있어 제거했다. */
(() => {
  if (!window.matchMedia('(pointer:fine)').matches) return;

  const chips = Array.from(document.querySelectorAll('.rc-chip'));
  if (!chips.length) return;

  const REACH = 140;
  const PUSH = 36;
  let raf = null;

  function update(x, y) {
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
