const body = document.body;
const menuButton = document.querySelector('[data-menu-toggle]');
const mobilePanel = document.querySelector('[data-mobile-panel]');

if (menuButton && mobilePanel) {
  menuButton.addEventListener('click', () => {
    mobilePanel.classList.toggle('is-open');
  });
}

const hero = document.querySelector('[data-hero]');
if (hero) {
  const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(hero.querySelectorAll('[data-hero-dot]'));
  const prev = hero.querySelector('[data-hero-prev]');
  const next = hero.querySelector('[data-hero-next]');
  let index = 0;
  let timer;

  const showSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('is-active', slideIndex === index);
    });
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === index);
    });
  };

  const restart = () => {
    window.clearInterval(timer);
    timer = window.setInterval(() => showSlide(index + 1), 5200);
  };

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener('click', () => {
      showSlide(dotIndex);
      restart();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(index - 1);
      restart();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      showSlide(index + 1);
      restart();
    });
  }

  restart();
}

const normalize = (value) => (value || '').toString().trim().toLowerCase();
const params = new URLSearchParams(window.location.search);
const initialQuery = params.get('q') || '';

const fillSelectOptions = (selector, attribute) => {
  const select = document.querySelector(selector);
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  if (!select || select.options.length > 1) {
    return;
  }
  const values = Array.from(new Set(cards.map((card) => card.dataset[attribute]).filter(Boolean))).sort();
  values.forEach((value) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  });
};

fillSelectOptions('[data-region-filter]', 'region');
fillSelectOptions('[data-year-filter]', 'year');

const filterInput = document.querySelector('[data-filter-input]');
if (filterInput && initialQuery) {
  filterInput.value = initialQuery;
}

const filterCards = () => {
  const cards = Array.from(document.querySelectorAll('[data-card]'));
  if (!cards.length) {
    return;
  }

  const query = normalize(document.querySelector('[data-filter-input]')?.value);
  const category = normalize(document.querySelector('[data-category-filter]')?.value);
  const region = normalize(document.querySelector('[data-region-filter]')?.value);
  const year = normalize(document.querySelector('[data-year-filter]')?.value);
  const type = normalize(document.querySelector('[data-type-filter]')?.value);
  let visible = 0;

  cards.forEach((card) => {
    const text = normalize([
      card.dataset.title,
      card.dataset.region,
      card.dataset.type,
      card.dataset.year,
      card.dataset.category,
      card.dataset.tags,
      card.textContent
    ].join(' '));
    const matched = (!query || text.includes(query)) &&
      (!category || normalize(card.dataset.category) === category) &&
      (!region || normalize(card.dataset.region) === region) &&
      (!year || normalize(card.dataset.year).includes(year)) &&
      (!type || normalize(card.dataset.type) === type);

    card.classList.toggle('is-hidden', !matched);
    if (matched) {
      visible += 1;
    }
  });

  const state = document.querySelector('[data-search-state]');
  if (state) {
    state.textContent = visible ? `找到 ${visible} 个相关影片` : '没有匹配的影片';
  }
};

['input', 'change'].forEach((eventName) => {
  document.addEventListener(eventName, (event) => {
    if (event.target.matches('[data-filter-input], [data-category-filter], [data-region-filter], [data-year-filter], [data-type-filter]')) {
      filterCards();
    }
  });
});

if (document.querySelector('[data-card-list]')) {
  filterCards();
}
