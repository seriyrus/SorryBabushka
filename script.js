/* ==========================================================
   Кофейня «Аромат» — интерактив
   Intersection Observer, бургер-меню, header blur,
   кнопка «Наверх», lightbox, модальное окно
   ========================================================== */
(() => {
    'use strict';

    /* ---------- Header: blur-эффект + кнопка «Наверх» ---------- */
    const header = document.getElementById('header');
    const toTop = document.getElementById('to-top');

    const onScroll = () => {
        const scrolled = window.scrollY > 40;
        header.classList.toggle('header--scrolled', scrolled);
        toTop.classList.toggle('to-top--visible', window.scrollY > 400);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---------- Бургер-меню (мобильная навигация) ---------- */
    const burger = document.getElementById('nav-burger');
    const menu = document.getElementById('nav-menu');

    const closeMenu = () => {
        menu.classList.remove('nav__menu--open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Открыть меню');
    };

    burger.addEventListener('click', () => {
        const isOpen = burger.getAttribute('aria-expanded') === 'true';
        if (isOpen) {
            closeMenu();
        } else {
            menu.classList.add('nav__menu--open');
            burger.setAttribute('aria-expanded', 'true');
            burger.setAttribute('aria-label', 'Закрыть меню');
        }
    });

    // Закрываем меню при клике по ссылке или по Escape
    menu.addEventListener('click', (e) => {
        if (e.target.closest('.nav__link')) closeMenu();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
            closeModal();
            closeLightbox();
        }
    });

    /* ---------- Reveal-анимация при скролле ---------- */
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback для старых браузеров
        revealEls.forEach((el) => el.classList.add('reveal--visible'));
    }

    /* ---------- Lightbox галереи ---------- */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');

    const openLightbox = (src) => {
        lightboxImg.src = src;
        lightbox.hidden = false;
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('[data-lightbox-close]').focus();
    };

    const closeLightbox = () => {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        document.body.style.overflow = '';
    };

    document.querySelectorAll('[data-lightbox]').forEach((item) => {
        item.addEventListener('click', () => openLightbox(item.dataset.lightbox));
    });
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.hasAttribute('data-lightbox-close')) closeLightbox();
    });

    /* ---------- Модальное окно «Быстрая связь» ---------- */
    const modal = document.getElementById('modal');
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');

    const openModal = () => {
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        form.elements.name.focus();
    };

    const closeModal = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.style.overflow = '';
        status.textContent = '';
        form.reset();
    };

    document.querySelectorAll('[data-modal-close]').forEach((el) => {
        el.addEventListener('click', closeModal);
    });

    // Открытие модалки с кнопок «Забронировать» / «Купить»
    document.querySelectorAll('.nav__link--cta').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openModal();
        });
    });
    document.querySelectorAll('.product-card__buy').forEach((btn) => {
        btn.addEventListener('click', openModal);
    });

    /* ---------- Валидация и отправка формы ---------- */
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Демо-обработка: здесь мог бы быть запрос к backend/API
        status.textContent = 'Спасибо! Мы перезвоним вам в течение 15 минут. ☕';
        status.style.color = 'var(--color-rainforest)';

        setTimeout(() => {
            closeModal();
        }, 2200);
    });

    /* ---------- Параллакс-фоны для iOS (fallback на scroll) ---------- */
    // iOS Safari не поддерживает background-attachment: fixed.
    // Эмулируем эффект через background-position на планшетах и десктопах.
    const parallaxSections = document.querySelectorAll('.hero, .location');
    const supportsFixedBg = CSS.supports && CSS.supports('background-attachment', 'fixed');

    if (!supportsFixedBg && window.matchMedia('(min-width: 768px)').matches) {
        const onParallax = () => {
            parallaxSections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) {
                    const offset = rect.top * 0.35;
                    section.style.backgroundPosition = `center ${offset}px`;
                }
            });
        };
        window.addEventListener('scroll', onParallax, { passive: true });
        onParallax();
    }
})();
