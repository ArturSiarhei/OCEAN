const container = document.querySelector('.snap-container');
const sections = document.querySelectorAll('.section');
const dots = document.querySelectorAll('.dot');
const tooltip = document.getElementById('tooltip');
const depthLabel = document.getElementById('fixed-depth-label'); // фиксированная надпись глубины
let isScrolling = false;

// Тексты глубины для каждой секции
const depthTexts = [
  '0 m',
  '0—200 m',
  '200—1000 m',
  '1000—4000 m'
];

function scrollToSection(index) {
  const sectionHeight = window.innerHeight;
  isScrolling = true;
  container.scrollTo({
    top: index * sectionHeight,
    behavior: 'smooth'
  });
  // Блокируем повторный скролл во время анимации
  setTimeout(() => { isScrolling = false; }, 800);
}

container.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (isScrolling) return;

  const direction = e.deltaY > 0 ? 1 : -1;
  const currentScroll = container.scrollTop;
  const currentIndex = Math.round(currentScroll / window.innerHeight);
  const nextIndex = Math.max(0, Math.min(sections.length - 1, currentIndex + direction));

  scrollToSection(nextIndex);
}, { passive: false });

// Обработка кликов и ховер-событий по точкам навигации
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = parseInt(dot.dataset.index, 10);
    scrollToSection(index);
  });

  dot.addEventListener('mouseenter', () => {
    tooltip.innerText = dot.dataset.tooltip;
    tooltip.classList.add('visible');
  });

  dot.addEventListener('mouseleave', () => {
    tooltip.classList.remove('visible');
  });

  dot.addEventListener('mousemove', (e) => {
    tooltip.style.left = (e.clientX + 12) + 'px';
    tooltip.style.top = (e.clientY - 10) + 'px';
  });
});

// При скролле обновляем активные элементы и текст глубины
container.addEventListener('scroll', () => {
  const currentIndex = Math.round(container.scrollTop / window.innerHeight);

  sections.forEach((section, idx) => {
    section.classList.toggle('active', idx === currentIndex);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentIndex);
  });

  if (depthLabel) {
    depthLabel.textContent = depthTexts[currentIndex] || '';
  }
});

// При загрузке страницы выставляем активный первый слайд и текст глубины
window.addEventListener('load', () => {
  sections.forEach((section, i) => section.classList.toggle('active', i === 0));
  if (depthLabel) {
    depthLabel.textContent = depthTexts[0];
  }
});
