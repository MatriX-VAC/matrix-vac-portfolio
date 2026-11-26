# MatriX-VAC

Откройте `index.html` двойным щелчком. Сборка, сервер и установка пакетов не нужны. Интернет нужен для перехода в GitHub.

- В `index.html` находятся заголовки, тексты демо и ссылки на профиль и репозитории. Меню кофейни, блоки сайта-визитки и открытка переключаются средствами HTML и CSS.
- В `styles.css` меняются цвета, размеры, расположение галактики и вид демо. Положение кадра задаёт `.sky-galaxy`, а свечение вокруг него — `.sky-nebula`.
- В блоке `galaxy` в начале `script.js` можно изменить силу параллакса, запаздывание, частоту падающих звёзд и ограничения Canvas для разных экранов. Там же в файле обновляется прогресс в журнале задач.
- `galaxy.webp` — локальный статичный кадр. Он загружается и при отключённом JavaScript. При включённом уменьшенном движении параллакс, падающие звёзды и анимации отключаются.
- `milk-and-beans.webp` — фото для фона превью кофейни «Молоко и зёрна». Его подключает `.coffee-preview` в `styles.css`.
- `forma-i-svet-cover.webp` — фото для обложки карточки студии «Форма и свет». Оно подключается в `index.html`, кадрирование задаёт `.interiors-cover` в `styles.css`.


<details>
<summary>Промпт для исходного кадра галактики (встроенный ImageGen)</summary>

Use case: stylized-concept. Standalone square artwork for a premium developer portfolio background. A single enormous tilted spiral galaxy, nucleus at the center of the square, photographed from an oblique angle, elliptical disc on a diagonal from lower-left to upper-right. Multiple distinct sweeping, textured spiral arms spiraling around a compact intensely glowing white-lilac and pink core. Highly detailed star clusters, fine dust ribbons, luminous cobalt/periwinkle blue, violet, selective neon pink hydrogen knots. Natural dimensional depth with deep blacks between curved arms. Vast very dark almost-black blue space at the perimeter, softly receding into a nearly black vignette on all four edges. Galaxy fills 88% of frame, its luminous arms stay fully in view. Cinematic, rich and contrasty, astrophotography-inspired. Sparse tiny stars outside galaxy. No horizon, no planets, no figures, no type, no labels, no frames, no UI.

</details>
