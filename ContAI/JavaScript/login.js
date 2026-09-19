//* Emanuel *



/* ========================================
   FUNCIONALIDADE DE TOGGLE DE TEMA
   Gerencia a alternância entre tema claro e escuro
   ======================================== */

// Elementos do DOM
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const htmlElement = document.documentElement;

// Constantes
const DEFAULT_THEME = 'light';
const STORAGE_KEY = 'theme-preference';

/**
 * Inicializa o tema ao carregar a página
 * Verifica localStorage ou usa tema padrão
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
    setTheme(savedTheme);
}

/**
 * Define o tema da página
 * @param {string} theme - 'light' ou 'dark'
 */
function setTheme(theme) {
    const isLight = theme === 'light';
    
    // Atualiza o atributo data-theme do HTML
    htmlElement.setAttribute('data-theme', isLight ? 'light' : 'dark');
    
    // Atualiza o ícone
    themeIcon.textContent = isLight ? '🌙' : '☀️';
    
    // Salva a preferência no localStorage
    localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// ========================================
// EVENT LISTENERS
// ========================================

// Botão de toggle de tema
themeToggle.addEventListener('click', toggleTheme);

// Inicializa o tema ao carregar a página
document.addEventListener('DOMContentLoaded', initializeTheme);

// ========================================
// FUNCIONALIDADES ADICIONAIS (Comentadas)
// ========================================

/**
 * OPCIONAL: Detectar preferência do sistema operacional
 * Descomente a linha abaixo para respeitar a preferência do SO
 */
// const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
// const initialTheme = localStorage.getItem(STORAGE_KEY) || (prefersDark ? 'dark' : 'light');
// setTheme(initialTheme);

/**
 * OPCIONAL: Manipular o envio do formulário de login
 * Descomente para adicionar lógica de autenticação
 */
// document.getElementById('loginForm').addEventListener('submit', (e) => {
//     e.preventDefault();
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;
//     console.log('Email:', email);
//     console.log('Password:', password);
//     // Aqui você adicionaria a lógica de autenticação com seu backend
// });
