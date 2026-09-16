/* 화면 전체를 채우는 고정(sticky) 헤드라인들 — 스크롤하는 동안 한 글자씩 채워짐.
   DOM을 직접 순회해 텍스트 노드만 단어/글자 단위로 감싸므로, <span class="accent"> 같은
   내부 태그가 있어도 마크업이 깨지지 않는다. */
(() => {
  function wrapNode(node) {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const words = child.textContent.split(' ');
        const frag = document.createDocumentFragment();
        words.forEach((word, i) => {
          if (word.length) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'rc-word';
            Array.from(word).forEach((ch) => {
              const charSpan = document.createElement('span');
              charSpan.className = 'rc-char';
              charSpan.textContent = ch;
              wordSpan.appendChild(charSpan);
            });
            frag.appendChild(wordSpan);
          }
          if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        wrapNode(child);
      }
    });
  }

  function setupPin(titleId, pinSelector) {
    const titleEl = document.getElementById(titleId);
    const pinEl = document.querySelector(pinSelector);
    if (!titleEl || !pinEl) return null;

    wrapNode(titleEl);
    const chars = Array.from(titleEl.querySelectorAll('.rc-char'));

    return function update() {
      const rect = pinEl.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      let progress = scrollable > 0 ? -rect.top / scrollable : 0;
      progress = Math.min(1, Math.max(0, progress));

      const revealCount = Math.round(progress * chars.length);
      chars.forEach((c, i) => c.classList.toggle('is-filled', i < revealCount));
    };
  }

  const updaters = [
    setupPin('statementTitle', '.rc-statement__titlepin'),
    setupPin('midTitle', '.rc-mid__pin'),
  ].filter(Boolean);

  if (!updaters.length) return;

  let raf = null;
  function onScroll() {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = null;
      updaters.forEach((fn) => fn());
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
