/* GNB 아래 지금 어떤 섹션이 깔려있는지 실측해서, 흰 배경 섹션([data-gnb-theme="light"])이면
   .rc-gnb--on-light를 토글해 로고/메뉴 글씨를 네이비로 바꾼다. mix-blend-mode는 fixed
   포지션에서 신뢰할 수 없어 이 방식으로 대체했다. */
(() => {
  const gnb = document.getElementById('gnb');
  const lightSections = Array.from(document.querySelectorAll('[data-gnb-theme="light"]'));
  if (!gnb || !lightSections.length) return;

  let raf = null;

  function update() {
    raf = null;
    const probeY = gnb.getBoundingClientRect().height / 2 + 1;
    const onLight = lightSections.some((sec) => {
      const r = sec.getBoundingClientRect();
      return r.top <= probeY && r.bottom >= probeY;
    });
    gnb.classList.toggle('rc-gnb--on-light', onLight);
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
