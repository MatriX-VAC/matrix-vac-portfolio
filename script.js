const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const galaxy = {
  // Смещения слоёв от самых дальних звёзд до ближайших частиц, в CSS-пикселях.
  depths: [7, 15, 25, 39],
  easing: 0.095,
  visibleRatio: 0.05,
  desktop: { canvasWidth: 1440, canvasHeight: 1000, particles: 105, pixelRatio: 1.25 },
  mobile: { canvasWidth: 560, canvasHeight: 740, particles: 44, pixelRatio: 1 },
  shootingStar: { firstDelay: 3600, minDelay: 8500, delayRange: 5500, duration: 690 }
};

function initSky(hero) {
  const layers = Array.from(hero.querySelectorAll('.sky-layer'));
  const canvas = hero.querySelector('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;

  let visible = true;
  let frame = 0;
  let timer = 0;
  let star = null;
  let x = 0;
  let y = 0;
  let targetX = 0;
  let targetY = 0;
  let lastTime = 0;
  let staticStars;
  let width;
  let height;

  const canAnimate = () => visible && !document.hidden && !reducedMotion.matches;
  const random = Math.random;

  function paint(now) {
    context.clearRect(0, 0, width, height);
    context.drawImage(staticStars, 0, 0);
    if (!star) return;

    const progress = (now - star.start) / galaxy.shootingStar.duration;
    if (progress >= 1) {
      star = null;
      scheduleStar();
      return;
    }

    const headX = (star.x + .27 * progress) * width;
    const headY = (star.y + .12 * progress) * height;
    const tailX = headX - Math.min(width * .11, 120);
    const tailY = headY - Math.min(height * .055, 54);
    const gradient = context.createLinearGradient(tailX, tailY, headX, headY);
    gradient.addColorStop(0, '#b888ff00');
    gradient.addColorStop(.72, '#c9a9ff90');
    gradient.addColorStop(1, '#ffedff');
    context.globalAlpha = Math.min(progress * 7, 1, (1 - progress) * 3.5);
    context.strokeStyle = gradient;
    context.lineWidth = 1.45;
    context.beginPath();
    context.moveTo(tailX, tailY);
    context.lineTo(headX, headY);
    context.stroke();
    context.globalAlpha = 1;
  }

  function resize() {
    const bounds = hero.getBoundingClientRect();
    const mobile = bounds.width < 640;
    const limit = mobile ? galaxy.mobile : galaxy.desktop;
    const scale = Math.min(window.devicePixelRatio || 1, limit.pixelRatio, limit.canvasWidth / bounds.width, limit.canvasHeight / bounds.height);
    width = canvas.width = Math.max(1, Math.floor(bounds.width * scale));
    height = canvas.height = Math.max(1, Math.floor(bounds.height * scale));
    staticStars = document.createElement('canvas');
    staticStars.width = width;
    staticStars.height = height;
    const stars = staticStars.getContext('2d');

    for (let index = 0; index < limit.particles; index++) {
      const pointX = (mobile ? random() : .18 + random() * .82) * width;
      const pointY = (mobile ? .42 + random() * .58 : random()) * height;
      const bright = index % 12 === 0;
      const radius = bright ? 1.18 : .36 + random() * .42;
      stars.globalAlpha = bright ? .84 : .23 + random() * .43;
      stars.fillStyle = index % 3 ? '#e4d8ff' : '#b3cfff';
      stars.shadowBlur = bright ? 9 : 0;
      stars.shadowColor = '#bba1ff';
      stars.beginPath();
      stars.arc(pointX, pointY, radius, 0, Math.PI * 2);
      stars.fill();
    }
    if (visible && !document.hidden) paint(performance.now());
  }

  function setLayers() {
    layers.forEach((layer, index) => {
      const depth = galaxy.depths[index];
      layer.style.transform = `translate3d(${(x * depth).toFixed(2)}px, ${(y * depth).toFixed(2)}px, 0)`;
    });
  }

  function scheduleStar(delay = galaxy.shootingStar.minDelay + random() * galaxy.shootingStar.delayRange) {
    if (!canAnimate() || timer) return;
    timer = window.setTimeout(() => {
      timer = 0;
      if (!canAnimate()) return;
      const mobile = hero.clientWidth < 640;
      star = { x: .47 + random() * .25, y: (mobile ? .54 : .16) + random() * .22, start: performance.now() };
      requestFrame();
    }, delay);
  }

  function requestFrame() {
    if (!frame && canAnimate()) frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    if (!canAnimate()) return;
    const step = lastTime ? Math.min((now - lastTime) / 16.67, 3) : 1;
    const ease = 1 - (1 - galaxy.easing) ** step;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    const moving = Math.abs(targetX - x) + Math.abs(targetY - y) > .004;
    if (!moving) {
      x = targetX;
      y = targetY;
    }
    setLayers();
    if (star) paint(now);

    if (moving || star) {
      lastTime = now;
      requestFrame();
    } else {
      lastTime = 0;
    }
  }

  function syncPlayback() {
    if (canAnimate()) {
      scheduleStar(galaxy.shootingStar.firstDelay);
      return;
    }

    cancelAnimationFrame(frame);
    clearTimeout(timer);
    frame = timer = lastTime = 0;
    star = null;
    x = y = targetX = targetY = 0;
    setLayers();
    if (visible && !document.hidden) paint(performance.now());
  }

  hero.addEventListener('pointermove', (event) => {
    if (!finePointer.matches || event.pointerType !== 'mouse' || !canAnimate()) return;
    const bounds = hero.getBoundingClientRect();
    const clamp = (value) => Math.max(-1, Math.min(1, value));
    targetX = clamp(2 * (event.clientX - bounds.left) / bounds.width - 1);
    targetY = clamp(2 * (event.clientY - bounds.top) / bounds.height - 1);
    requestFrame();
  }, { passive: true });
  function returnToCenter() {
    targetX = targetY = 0;
    requestFrame();
  }
  hero.addEventListener('pointerleave', returnToCenter);
  finePointer.addEventListener('change', returnToCenter);
  reducedMotion.addEventListener('change', syncPlayback);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && visible) paint(performance.now());
    syncPlayback();
  });

  resize();
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
  else window.addEventListener('resize', resize, { passive: true });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= galaxy.visibleRatio;
      if (visible && !document.hidden) paint(performance.now());
      syncPlayback();
    }, { threshold: galaxy.visibleRatio }).observe(hero);
  } else {
    syncPlayback();
  }
}

initSky(document.querySelector('.hero'));

const taskList = document.querySelector('.task-list');
const taskInputs = Array.from(taskList.querySelectorAll('input'));
const taskProgress = document.querySelector('.task-progress');
const taskCount = document.querySelector('.task-count');
function updateTasks() {
  const completed = taskInputs.filter((task) => task.checked).length;
  taskProgress.max = taskInputs.length;
  taskProgress.value = completed;
  taskCount.textContent = `${completed} из ${taskInputs.length}`;
}
taskList.addEventListener('change', updateTasks);
window.addEventListener('pageshow', updateTasks);
updateTasks();

if ('IntersectionObserver' in window && 'animate' in Element.prototype) {
  const demos = Array.from(document.querySelectorAll('.demo'));
  const activeAnimations = new Set();
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.matches(':focus-within')) continue;

      const animation = entry.target.animate([
        { opacity: .76, transform: 'translateY(10px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 290, delay: (demos.indexOf(entry.target) % 2) * 57, easing: 'ease-out', fill: 'backwards' });
      activeAnimations.add(animation);
      const stopOnFocus = () => animation.cancel();
      const cleanup = () => {
        activeAnimations.delete(animation);
        entry.target.removeEventListener('focusin', stopOnFocus);
      };
      entry.target.addEventListener('focusin', stopOnFocus, { once: true });
      animation.finished.then(cleanup, cleanup);
    }
  }, { threshold: .13 });

  demos.forEach((demo) => observer.observe(demo));
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) activeAnimations.forEach((animation) => animation.cancel());
  });
}

