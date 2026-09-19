/* =========================================================
   CONT.AI — HOME.JS
   1) Alternar tema claro / escuro (salvo no navegador)
   2) Abrir e fechar o menu no celular
========================================================= */

(function () {
    'use strict';

    var STORAGE_KEY = 'contai-theme';
    var root = document.documentElement;
    var header = document.querySelector('.site-header');
    var themeToggle = document.querySelector('[data-theme-toggle]');
    var menuToggle = document.querySelector('[data-menu-toggle]');


    /* ---------- Tema ---------- */

    function getTheme() {
        return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function updateThemeButton() {
        if (!themeToggle) return;
        themeToggle.setAttribute(
            'aria-label',
            getTheme() === 'light' ? 'Ativar modo escuro' : 'Ativar modo claro'
        );
    }

    function setTheme(theme) {
        root.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {}
        updateThemeButton();
    }

    if (themeToggle) {
        updateThemeButton();
        themeToggle.addEventListener('click', function () {
            setTheme(getTheme() === 'light' ? 'dark' : 'light');
        });
    }


    /* ---------- Menu mobile ---------- */

    function setMenu(open) {
        if (!header || !menuToggle) return;
        header.setAttribute('data-open', open ? 'true' : 'false');
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    }

    if (menuToggle && header) {
        menuToggle.addEventListener('click', function () {
            setMenu(header.getAttribute('data-open') !== 'true');
        });

        // fecha ao clicar em um link do menu
        header.querySelectorAll('.main-navigation a').forEach(function (link) {
            link.addEventListener('click', function () {
                setMenu(false);
            });
        });

        // fecha com a tecla Esc
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && header.getAttribute('data-open') === 'true') {
                setMenu(false);
                menuToggle.focus();
            }
        });

        // fecha ao voltar para a tela grande
        window.matchMedia('(min-width: 901px)').addEventListener('change', function (event) {
            if (event.matches) setMenu(false);
        });
    }
})();