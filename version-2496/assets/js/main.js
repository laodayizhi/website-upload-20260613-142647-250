(function () {
    var menuButton = document.querySelector('.mobile-menu-button');
    var mobileNav = document.querySelector('.mobile-nav');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            var isOpen = mobileNav.classList.toggle('is-open');
            menuButton.setAttribute('aria-expanded', String(isOpen));
        });
    }

    var hero = document.querySelector('.hero-slider');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('.hero-prev');
        var next = hero.querySelector('.hero-next');
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function play() {
            stop();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5000);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(index - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(index + 1);
                play();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                play();
            });
        });

        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', play);
        play();
    }

    var filterInput = document.querySelector('.page-filter-input');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.searchable-grid .movie-card'));
    var yearButtons = Array.prototype.slice.call(document.querySelectorAll('[data-filter-year]'));
    var selectedYear = 'all';

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
        if (!cards.length) {
            return;
        }

        var keyword = normalize(filterInput ? filterInput.value : '');

        cards.forEach(function (card) {
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-type'),
                card.getAttribute('data-region'),
                card.getAttribute('data-year'),
                card.getAttribute('data-tags')
            ].join(' '));
            var year = card.getAttribute('data-year') || '';
            var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
            var matchYear = selectedYear === 'all' || year === selectedYear;

            card.classList.toggle('is-hidden', !(matchKeyword && matchYear));
        });
    }

    if (filterInput) {
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q) {
            filterInput.value = q;
        }

        filterInput.addEventListener('input', applyFilter);
        applyFilter();
    }

    yearButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            selectedYear = button.getAttribute('data-filter-year') || 'all';

            yearButtons.forEach(function (item) {
                item.classList.toggle('is-active', item === button);
            });

            applyFilter();
        });
    });

    Array.prototype.slice.call(document.querySelectorAll('.site-search')).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';

            if (!value) {
                event.preventDefault();
                return;
            }
        });
    });
})();
