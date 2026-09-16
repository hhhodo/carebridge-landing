/* 보안 카드 5장이 왼쪽에 모여있다가, 스크롤에 맞춰 하나씩 오른쪽으로 펼쳐지는 연동 애니메이션.
   .rc-tech__cards-pin(200vh)을 스크롤하는 동안 진행률(0~1)을 구하고, 카드별 구간에 맞춰
   --reveal 커스텀 프로퍼티를 갱신한다. --stack-x는 각 카드가 카드1 자리에 겹쳐 보이도록 하는
   음수 오프셋(px)으로, 레이아웃 후 실측해서 채운다. */
(() => {
  const pin = document.querySelector('.rc-tech__cards-pin');
  const row = document.getElementById('techRow');
  if (!pin || !row) return;

  const cards = Array.from(row.querySelectorAll('.rc-tech__card'));

  function layout() {
    const rowLeft = row.getBoundingClientRect().left;
    cards.forEach((card) => {
      const offset = card.getBoundingClientRect().left - rowLeft;
      card.style.setProperty('--stack-x', `${-offset}px`);
    });
  }

  let raf = null;
  function update() {
    raf = null;
    const rect = pin.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    let progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));

    const n = cards.length;
    cards.forEach((card, i) => {
      const start = i / n;
      const end = (i + 0.7) / n;
      let t = (progress - start) / (end - start);
      t = Math.min(1, Math.max(0, t));
      card.style.setProperty('--reveal', t);
    });
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('load', () => {
    layout();
    update();
  });
  window.addEventListener('resize', () => {
    layout();
    update();
  });
  window.addEventListener('scroll', onScroll, { passive: true });

  layout();
  update();
})();
