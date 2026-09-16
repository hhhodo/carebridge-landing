/* 노란 원 커스텀 커서 + 히어로 뱃지가 커서에 닿으면 살짝 밀려나는 인터랙션.
   이전 버전은 `matchMedia('(pointer:fine)')` 결과에 따라 아예 만들지 않는 방식이었는데,
   일부 환경(트랙패드/브라우저 조합)에서 이 미디어 피처가 기대와 다르게 보고되면 점이
   영원히 display:none으로 남아 "마우스가 안 보이는" 상태가 됐다.
   대신: 항상 점을 만들어두되 opacity:0으로 숨겨두고, 실제 mousemove 이벤트가 처음 발생할
   때만(=진짜 마우스가 있는 환경에서만, 터치 기기는 mousemove가 사실상 발생하지 않음)
   보이게 전환한다. 시스템 커서 숨김(cursor:none)도 그 시점에만 body에 클래스로 건다. */
(() => {
  const dot = document.createElement('div');
  dot.id = 'rc-cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  const chips = Array.from(document.querySelectorAll('.rc-chip'));
  const REACH = 140;
  const PUSH = 36;

  let started = false;
  let raf = null;

  function update(x, y) {
    dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

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
    if (!started) {
      started = true;
      document.body.classList.add('rc-cursor-active');
    }
    if (raf) return;
    const { clientX, clientY } = e;
    raf = requestAnimationFrame(() => {
      raf = null;
      update(clientX, clientY);
    });
  }, { passive: true });

  // 창 밖으로 마우스가 나가면 점을 숨겨 구석에 고정된 것처럼 남지 않게 한다.
  document.addEventListener('mouseleave', () => {
    document.body.classList.remove('rc-cursor-active');
  });
  document.addEventListener('mouseenter', () => {
    if (started) document.body.classList.add('rc-cursor-active');
  });
})();
