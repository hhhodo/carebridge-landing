/* 서비스 뱃지 낙하 인터랙션 — Matter.js로 실제 중력/충돌/쌓임을 시뮬레이션하고
   그 결과를 각 뱃지 DOM 엘리먼트의 transform에 그대로 반영한다 (캔버스 렌더링 없음). */
(() => {
  const container = document.querySelector('.rc-cloud');
  if (!container || typeof Matter === 'undefined') return;

  const tags = Array.from(container.querySelectorAll('.rc-cloud__tag'));
  let started = false;

  function start() {
    if (started) return;
    started = true;

    const { Engine, World, Bodies, Body, Runner } = Matter;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 1.1;
    const world = engine.world;

    const wallThickness = 80;
    const ground = Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, { isStatic: true });
    const leftWall = Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true });
    const rightWall = Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height * 3, { isStatic: true });
    World.add(world, [ground, leftWall, rightWall]);

    const bodies = tags.map((el, i) => {
      const rect = el.getBoundingClientRect();
      const w = rect.width || 80;
      const h = rect.height || 40;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;

      const startX = Math.random() * Math.max(width - w, w) + w / 2;
      const startY = -(120 + Math.random() * 500 + i * 60);
      // 아주 살짝만 기울이고(±8도) 고정 — 텍스트가 뒤집히거나 거꾸로 읽히는 일이 없도록
      const startAngle = (Math.random() - 0.5) * 0.28;

      const body = Bodies.rectangle(startX, startY, w, h, {
        restitution: 0.32,
        friction: 0.55,
        frictionAir: 0.012,
        density: 0.0018,
        chamfer: { radius: Math.min(h / 2, 24) },
        angle: startAngle,
      });
      // 회전 관성을 무한대로 고정 — 낙하/충돌/쌓임은 실제 물리 그대로 계산하되
      // 텍스트가 회전(특히 뒤집힘)하지 않도록 각속도에는 영향받지 않게 한다.
      Body.setInertia(body, Infinity);
      Body.setAngularVelocity(body, 0);
      World.add(world, body);
      el.classList.add('is-ready');

      return { el, body, w, h };
    });

    const runner = Runner.create();
    Runner.run(runner, engine);

    (function render() {
      bodies.forEach(({ el, body, w, h }) => {
        const x = body.position.x - w / 2;
        const y = body.position.y - h / 2;
        el.style.transform = `translate(${x}px, ${y}px) rotate(${body.angle}rad)`;
      });
      requestAnimationFrame(render);
    })();
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        start();
        io.disconnect();
      }
    });
  }, { threshold: 0.25 });
  io.observe(container);
})();
