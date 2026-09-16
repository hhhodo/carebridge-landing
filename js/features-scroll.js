/* 피처 카드 3장이 같은 자리에 고정된 채, 스크롤에 맞춰 오른쪽에서 한 장씩 날아와
   이전 카드 위로 겹쳐 쌓인다. 첫 카드는 처음부터 제자리(reveal=1)에 있고,
   .rc-features__pin(280vh)을 스크롤하는 동안 카드 2, 3이 순서대로 들어온다. */
(() => {
  const pin = document.querySelector('.rc-features__pin');
  const stack = document.getElementById('featuresStack');
  if (!pin || !stack) return;

  const cards = Array.from(stack.querySelectorAll('.rc-feature-card'));
  if (!cards.length) return;

  cards[0].style.setProperty('--reveal', 1);

  let raf = null;
  function update() {
    raf = null;
    const rect = pin.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    let progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));

    const n = cards.length - 1; // 첫 카드는 애니메이션 대상이 아님
    cards.forEach((card, i) => {
      if (i === 0) return;
      const idx = i - 1;
      const start = idx / n;
      const end = (idx + 0.7) / n;
      let t = (progress - start) / (end - start);
      t = Math.min(1, Math.max(0, t));
      card.style.setProperty('--reveal', t);
    });
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
