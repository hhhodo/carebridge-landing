/* statement 섹션 타이틀: 200vh 고정(sticky) 구간을 스크롤하는 동안
   한 글자씩 채워지는 인터랙션. 단어 단위(.rc-word)로 감싸 word-break를 지키고,
   그 안에서 글자(.rc-char) 단위로 opacity를 스크롤 진행률에 맞춰 토글한다. */
(() => {
  const titleEl = document.getElementById('statementTitle');
  const pinEl = document.querySelector('.rc-statement__titlepin');
  if (!titleEl || !pinEl) return;

  function wrapChars(el) {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines
      .map((line) =>
        line
          .trim()
          .split(' ')
          .map((word) => {
            const chars = Array.from(word)
              .map((ch) => `<span class="rc-char">${ch}</span>`)
              .join('');
            return `<span class="rc-word">${chars}</span>`;
          })
          .join(' ')
      )
      .join('<br>');
  }

  wrapChars(titleEl);
  const chars = Array.from(titleEl.querySelectorAll('.rc-char'));

  let raf = null;
  function update() {
    raf = null;
    const rect = pinEl.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    let progress = scrollable > 0 ? -rect.top / scrollable : 0;
    progress = Math.min(1, Math.max(0, progress));

    const revealCount = Math.round(progress * chars.length);
    chars.forEach((c, i) => c.classList.toggle('is-filled', i < revealCount));
  }

  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
