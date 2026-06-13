document.addEventListener("DOMContentLoaded", function() {
  initMenu();
  initHero();
  initSearchPanel();
});

function initMenu() {
  const toggle = document.querySelector("[data-menu-toggle]");
  const nav = document.querySelector("[data-site-nav]");
  if (!toggle || !nav) {
    return;
  }
  toggle.addEventListener("click", function() {
    nav.classList.toggle("is-open");
  });
}

function initHero() {
  const hero = document.querySelector("[data-hero]");
  if (!hero) {
    return;
  }
  const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
  const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
  const prev = hero.querySelector("[data-hero-prev]");
  const next = hero.querySelector("[data-hero-next]");
  let current = 0;
  let timer = null;

  function showSlide(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === current);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === current);
    });
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(function() {
      showSlide(current + 1);
    }, 5200);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  if (prev) {
    prev.addEventListener("click", function() {
      showSlide(current - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener("click", function() {
      showSlide(current + 1);
      startTimer();
    });
  }

  dots.forEach(function(dot) {
    dot.addEventListener("click", function() {
      const index = Number(dot.getAttribute("data-hero-dot"));
      showSlide(index);
      startTimer();
    });
  });

  hero.addEventListener("mouseenter", stopTimer);
  hero.addEventListener("mouseleave", startTimer);
  showSlide(0);
  startTimer();
}

function initSearchPanel() {
  const catalog = document.getElementById("searchCatalog");
  if (!catalog) {
    return;
  }
  const input = document.getElementById("searchInput");
  const genre = document.getElementById("genreFilter");
  const region = document.getElementById("regionFilter");
  const reset = document.getElementById("resetFilter");
  const note = document.getElementById("searchResultText");
  const cards = Array.from(catalog.querySelectorAll(".movie-card"));
  const params = new URLSearchParams(window.location.search);

  if (params.get("q") && input) {
    input.value = params.get("q");
  }

  function applyFilter() {
    const keyword = (input ? input.value : "").trim().toLowerCase();
    const genreValue = genre ? genre.value : "";
    const regionValue = region ? region.value : "";
    let visible = 0;

    cards.forEach(function(card) {
      const haystack = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-genre"),
        card.getAttribute("data-year"),
        card.textContent
      ].join(" ").toLowerCase();
      const matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      const matchGenre = !genreValue || (card.getAttribute("data-genre") || "").indexOf(genreValue) !== -1;
      const matchRegion = !regionValue || card.getAttribute("data-region") === regionValue;
      const shouldShow = matchKeyword && matchGenre && matchRegion;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) {
        visible += 1;
      }
    });

    if (note) {
      note.textContent = visible > 0 ? "已为你筛选出匹配内容。" : "没有找到匹配内容，可以更换关键词。";
    }
  }

  [input, genre, region].forEach(function(control) {
    if (control) {
      control.addEventListener("input", applyFilter);
      control.addEventListener("change", applyFilter);
    }
  });

  if (reset) {
    reset.addEventListener("click", function() {
      if (input) {
        input.value = "";
      }
      if (genre) {
        genre.value = "";
      }
      if (region) {
        region.value = "";
      }
      applyFilter();
    });
  }

  applyFilter();
}
