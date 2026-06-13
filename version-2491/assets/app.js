(function () {
  function root() {
    return document.documentElement.getAttribute('data-root') || './';
  }

  function withRoot(path) {
    return root() + path.replace(/^\.\//, '');
  }

  function initHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;
    var toggle = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-mobile-menu]');
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    });
    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        menu.classList.toggle('is-open');
      });
    }
  }

  function initHero() {
    var hero = document.querySelector('[data-hero]');
    if (!hero) return;
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;
    if (!slides.length) return;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) window.clearInterval(timer);
    }

    if (prev) prev.addEventListener('click', function () { show(index - 1); start(); });
    if (next) next.addEventListener('click', function () { show(index + 1); start(); });
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () { show(i); start(); });
    });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function initQuickSearch() {
    var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-search-input]'));
    var list = window.MovieSearchList || [];
    if (!inputs.length || !list.length) return;

    inputs.forEach(function (input) {
      var panel = input.parentElement.querySelector('[data-search-panel]');
      if (!panel) return;

      input.addEventListener('input', function () {
        var q = input.value.trim().toLowerCase();
        panel.innerHTML = '';
        if (!q) {
          panel.classList.remove('is-open');
          return;
        }
        var matches = list.filter(function (item) {
          return (item.title + ' ' + item.meta + ' ' + item.tags).toLowerCase().indexOf(q) !== -1;
        }).slice(0, 8);
        matches.forEach(function (item) {
          var a = document.createElement('a');
          a.className = 'quick-search-result';
          a.href = withRoot(item.path);
          a.innerHTML = '<img src="' + withRoot(item.image) + '" alt=""><span><strong>' + escapeHtml(item.title) + '</strong><span>' + escapeHtml(item.meta) + '</span></span>';
          panel.appendChild(a);
        });
        panel.classList.toggle('is-open', matches.length > 0);
      });

      document.addEventListener('click', function (event) {
        if (!input.parentElement.contains(event.target)) panel.classList.remove('is-open');
      });
    });
  }

  function initPageFilter() {
    var input = document.querySelector('[data-page-filter]');
    var scope = document.querySelector('[data-filter-scope]');
    if (!input || !scope) return;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      cards.forEach(function (card) {
        var text = [card.dataset.title, card.dataset.region, card.dataset.year, card.dataset.tags].join(' ').toLowerCase();
        card.classList.toggle('is-hidden', q && text.indexOf(q) === -1);
      });
    });
  }

  function initPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll('video[data-hls]'));
    players.forEach(function (video) {
      var src = video.getAttribute('data-hls');
      if (!src) return;
      var start = video.parentElement ? video.parentElement.querySelector('.player-start') : null;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      } else {
        video.src = src;
      }
      if (start) {
        start.addEventListener('click', function () {
          start.classList.add('is-hidden');
          var play = video.play();
          if (play && typeof play.catch === 'function') play.catch(function () {});
        });
        video.addEventListener('play', function () {
          start.classList.add('is-hidden');
        });
        video.addEventListener('pause', function () {
          if (!video.ended) start.classList.remove('is-hidden');
        });
      }
    });

    var scrollButtons = Array.prototype.slice.call(document.querySelectorAll('[data-scroll-player]'));
    scrollButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        var player = document.querySelector('.player-card');
        if (player) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
        var start = document.querySelector('.player-start');
        if (start) start.click();
      });
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char];
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initHero();
    initQuickSearch();
    initPageFilter();
    initPlayers();
  });
})();
