/* 보안 카드 5장 인터랙션.
   데스크톱: 카드가 왼쪽에 타로카드처럼 겹쳐 있다가 스크롤에 맞춰 하나씩 오른쪽으로 펼쳐짐
   (pin/sticky + --reveal 커스텀 프로퍼티 기반, 아래 setupDesktop).
   모바일(<=700px): 그 연출은 카드가 깨지고 가로 스크롤이 생기는 문제가 있어 완전히 다른
   방식으로 교체 — 세로로 쌓인 카드가 스크롤에 맞춰 하나씩 아래에서 올라오는 단순한
   IntersectionObserver reveal (setupMobile). CSS의 @media(max-width:700px)가 실제
   레이아웃(세로 스택, position:static 등)을 담당하고, 여기서는 .is-in 클래스만 토글한다. */
(() => {
  const pin = document.querySelector('.rc-tech__cards-pin');
  const row = document.getElementById('techRow');
  if (!pin || !row) return;

  const cards = Array.from(row.querySelectorAll('.rc-tech__card'));
  if (!cards.length) return;

  const isMobile = window.matchMedia('(max-width:700px)').matches;

  if (isMobile) {
    setupMobile();
  } else {
    setupDesktop();
  }

  function setupMobile() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    cards.forEach((c) => io.observe(c));
  }

  function setupDesktop() {
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
  }
})();
