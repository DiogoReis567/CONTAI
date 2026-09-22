const KEY = "contai_app_state_v1";
const seed = {
  products: [
    {
      id: "p1",
      name: 'Monitor 27"',
      category: "Eletrônicos",
      price: 1299.9,
      costPrice: 780,
      quantity: 18,
      lowLimit: 5,
      icon: "▣",
    },
    {
      id: "p2",
      name: "Teclado mecânico",
      category: "Acessórios",
      price: 349.9,
      costPrice: 190,
      quantity: 32,
      lowLimit: 8,
      icon: "⌨",
    },
    {
      id: "p3",
      name: "Mouse sem fio",
      category: "Acessórios",
      price: 129.9,
      costPrice: 55,
      quantity: 7,
      lowLimit: 10,
      icon: "◉",
    },
    {
      id: "p4",
      name: "Cabo USB-C",
      category: "Cabos",
      price: 49.9,
      costPrice: 18,
      quantity: 25,
      lowLimit: 10,
      icon: "⌁",
    },
    {
      id: "p5",
      name: "HDMI 2.1",
      category: "Cabos",
      price: 89.9,
      costPrice: 35,
      quantity: 4,
      lowLimit: 6,
      icon: "↔",
    },
  ],
  sales: [
    {
      id: "V-1048",
      productId: "p1",
      product: 'Monitor 27"',
      customer: "Marina Costa",
      quantity: 1,
      date: "2026-09-20",
      time: "09:42",
      address: "São Paulo, SP",
      coupon: "BEMVINDO",
      discount: 50,
      payment: "Cartão",
      paymentStatus: "Pago",
      shippingStatus: "Enviado",
      value: 1299.9,
      total: 1249.9,
    },
    {
      id: "V-1047",
      productId: "p2",
      product: "Teclado mecânico",
      customer: "Lucas Almeida",
      quantity: 2,
      date: "2026-09-19",
      time: "16:18",
      address: "Curitiba, PR",
      coupon: "",
      discount: 0,
      payment: "Pix",
      paymentStatus: "Pago",
      shippingStatus: "Entregue",
      value: 699.8,
      total: 699.8,
    },
    {
      id: "V-1046",
      productId: "p3",
      product: "Mouse sem fio",
      customer: "Nexa Café",
      quantity: 3,
      date: "2026-09-18",
      time: "11:06",
      address: "Belo Horizonte, MG",
      coupon: "EMPRESA10",
      discount: 39,
      payment: "Boleto",
      paymentStatus: "Pendente",
      shippingStatus: "Aguardando",
      value: 389.7,
      total: 350.7,
    },
    {
      id: "V-1045",
      productId: "p4",
      product: "Cabo USB-C",
      customer: "Vitta Studio",
      quantity: 5,
      date: "2026-09-16",
      time: "14:30",
      address: "Recife, PE",
      coupon: "",
      discount: 0,
      payment: "Pix",
      paymentStatus: "Pago",
      shippingStatus: "Enviado",
      value: 249.5,
      total: 249.5,
    },
  ],
  expenses: [
    { id: "e1", label: "Operacional", value: 2100 },
    { id: "e2", label: "Logística", value: 840 },
    { id: "e3", label: "Marketing", value: 520 },
  ],
  expenseGroups: ["Operacional", "Logística", "Marketing"],
  notifications: [],
  automation: {
    syncEnabled: false,
    supplierEmail: "fornecedor@exemplo.com",
    supplierName: "Fornecedor principal",
    lastSync: null,
  },
};
const clone = (value) => JSON.parse(JSON.stringify(value));
function loadState() {
  try {
    const saved = localStorage.getItem(KEY);
    const loaded = saved
      ? { ...clone(seed), ...JSON.parse(saved) }
      : clone(seed);
    loaded.products = (loaded.products || []).map((product) => ({
      ...product,
      costPrice: Number(product.costPrice ?? product.price * 0.6),
    }));
    loaded.expenses = (loaded.expenses || []).map((expense) => ({
      ...expense,
      name: expense.name || expense.label || "Despesa",
      group: expense.group || expense.label || "Outros",
    }));
    loaded.expenseGroups = [
      ...new Set([
        ...(loaded.expenseGroups || []),
        ...loaded.expenses.map((expense) => expense.group),
      ]),
    ];
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const recurringCopies = [];
    loaded.expenses
      .filter((expense) => expense.recurring && expense.date)
      .forEach((expense) => {
        const origin = new Date(`${expense.date}T12:00:00`);
        const month = new Date(
          origin.getFullYear(),
          origin.getMonth() + 1,
          1,
          12,
        );
        while (month <= today) {
          const lastDay = new Date(
            month.getFullYear(),
            month.getMonth() + 1,
            0,
          ).getDate();
          const day = Math.min(origin.getDate(), lastDay);
          const date = new Date(month.getFullYear(), month.getMonth(), day, 12)
            .toISOString()
            .slice(0, 10);
          const id = `${expense.id}-${date}`;
          if (!loaded.expenses.some((item) => item.id === id)) {
            recurringCopies.push({
              ...expense,
              id,
              date,
              recurring: false,
              recurringFrom: expense.id,
            });
          }
          month.setMonth(month.getMonth() + 1);
        }
      });
    loaded.expenses.push(...recurringCopies);
    return loaded;
  } catch {
    return clone(seed);
  }
}
let state = loadState();
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("contai-state-updated"));
}
function playNotificationSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(740, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      1040,
      context.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.07, context.currentTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
    oscillator.addEventListener("ended", () => context.close());
  } catch {
    // Browsers may block audio until the user interacts with the page.
  }
}
function addNotification(title, message, type = "info", metadata = {}) {
  state.notifications = [
    {
      id: `n${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false,
      ...metadata,
    },
    ...(state.notifications || []),
  ];
  save();
  window.dispatchEvent(new CustomEvent("contai-notification"));
  playNotificationSound();
}
function notificationBadgeValue(count) {
  return count >= 100 ? "99+" : String(count);
}
function notifyOutOfStock(product) {
  if (product.quantity === 0) {
    addNotification(
      "Estoque em falta",
      `${product.name} chegou a zero unidades.`,
      "stock-critical",
    );
  }
}
function ensureStockNotifications() {
  state.products
    .filter((product) => product.quantity === 0)
    .forEach((product) => {
      const exists = (state.notifications || []).some(
        (item) =>
          item.type === "stock-critical" &&
          item.message === `${product.name} chegou a zero unidades.`,
      );
      if (!exists) notifyOutOfStock(product);
    });
}
function getTheme() {
  return "dark";
}
function setTheme(theme) {
  document.body.classList.remove("light-mode");
  localStorage.removeItem("contai_theme");
}
function getUser() {
  try {
    const company = JSON.parse(localStorage.getItem("empresaContAI") || "null");
    const name =
      company?.responsavel?.nome || company?.nomeFantasia || "Usuário";
    return {
      name: String(name).trim() || "Usuário",
      email:
        company?.responsavel?.email ||
        company?.contato?.email ||
        "admin@contai.app",
      plan: "Plano Pro",
    };
  } catch {
    return { name: "Usuário", email: "admin@contai.app", plan: "Plano Pro" };
  }
}
function initials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
const money = (value) =>
  Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
const dateBR = (value) =>
  new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
const sumSales = () =>
  state.sales.reduce((total, sale) => total + Number(sale.total || 0), 0);
const costOfSales = () =>
  state.sales.reduce((total, sale) => {
    const product = state.products.find((item) => item.id === sale.productId);
    return (
      total +
      Number(
        sale.costTotal ??
          (product?.costPrice || 0) * Number(sale.quantity || 0),
      )
    );
  }, 0);
const totals = () => ({
  revenue: sumSales(),
  costOfSales: costOfSales(),
  expenses: state.expenses.reduce(
    (total, item) => total + Number(item.value || 0),
    0,
  ),
  sales: state.sales.length,
  stock: state.products.reduce(
    (total, product) => total + Number(product.quantity || 0),
    0,
  ),
  low: state.products.filter((product) => product.quantity <= product.lowLimit)
    .length,
  out: state.products.filter((product) => product.quantity === 0).length,
  profit:
    sumSales() -
    costOfSales() -
    state.expenses.reduce((total, item) => total + Number(item.value || 0), 0),
});
const percentage = (value, base) =>
  Number(base) ? (Number(value) / Number(base)) * 100 : 0;
const signedPercentage = (value) => {
  const rounded = Number(value || 0)
    .toFixed(1)
    .replace(".", ",");
  return `${Number(value || 0) > 0 ? "+" : ""}${rounded}%`;
};
const resultClass = (value) =>
  Number(value || 0) < 0 ? "negative" : "positive";
const financialMetrics = (values = totals()) => ({
  grossProfit: values.revenue - values.costOfSales,
  netMargin: percentage(values.profit, values.revenue),
  expenseRate: percentage(values.expenses, values.revenue),
  costRate: percentage(values.costOfSales, values.revenue),
});
const el = (selector, root = document) => root.querySelector(selector);
const els = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>\"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );
const AI_CHATS_KEY = "contai_ai_chats_v1";
const AI_ACTIVE_CHAT_KEY = "contai_ai_active_chat_v1";

function createAIChat(title = "Novo chat") {
  return {
    id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    archived: false,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        text: `Seja bem-vindo, ${getUser().name}!`,
      },
    ],
  };
}

function saveAIChats(chats) {
  localStorage.setItem(AI_CHATS_KEY, JSON.stringify(chats));
  window.dispatchEvent(new Event("contai-ai-updated"));
}

function loadAIChats() {
  try {
    const saved = JSON.parse(localStorage.getItem(AI_CHATS_KEY) || "null");
    if (Array.isArray(saved) && saved.length) {
      const currentName = getUser().name;
      let changed = false;
      saved.forEach((chat) => {
        (chat.messages || []).forEach((message) => {
          if (
            message.role === "assistant" &&
            /^Seja bem-vindo, .+!$/.test(message.text)
          ) {
            const welcome = `Seja bem-vindo, ${currentName}!`;
            if (message.text !== welcome) {
              message.text = welcome;
              changed = true;
            }
          }
        });
      });
      if (changed) localStorage.setItem(AI_CHATS_KEY, JSON.stringify(saved));
      return saved;
    }
  } catch {
    localStorage.removeItem(AI_CHATS_KEY);
  }

  let chats = [];
  try {
    const legacy = JSON.parse(
      localStorage.getItem("contai_ai_conversation_v1") || "null",
    );
    if (Array.isArray(legacy) && legacy.length) {
      chats = [
        {
          ...createAIChat("Chat principal"),
          id: "chat-principal",
          messages: legacy,
        },
      ];
    }
  } catch {
    localStorage.removeItem("contai_ai_conversation_v1");
  }

  if (!chats.length) chats = [createAIChat("Chat principal")];
  localStorage.setItem(AI_CHATS_KEY, JSON.stringify(chats));
  localStorage.setItem(AI_ACTIVE_CHAT_KEY, chats[0].id);
  return chats;
}

function getActiveAIChat(chats = loadAIChats()) {
  let activeId = localStorage.getItem(AI_ACTIVE_CHAT_KEY);
  let active = chats.find((chat) => chat.id === activeId && !chat.archived);
  if (!active) {
    active = chats.find((chat) => !chat.archived);
    if (!active) {
      active = createAIChat("Novo chat");
      chats.push(active);
      saveAIChats(chats);
    }
    localStorage.setItem(AI_ACTIVE_CHAT_KEY, active.id);
  }
  return active;
}

function setActiveAIChat(id) {
  const chats = loadAIChats();
  if (!chats.some((chat) => chat.id === id && !chat.archived)) {
    return;
  }
  localStorage.setItem(AI_ACTIVE_CHAT_KEY, id);
  window.dispatchEvent(new Event("contai-ai-updated"));
}

function simulatedAIAnswer(question) {
  return `Resposta simulada da ContAI: recebi sua pergunta sobre "${question}". A integração com uma IA real poderá analisar seus dados aqui.`;
}

function openAIChatDialog({
  title,
  message,
  inputValue = "",
  confirmLabel,
  danger = false,
}) {
  return new Promise((resolve) => {
    const backdrop = document.createElement("div");
    backdrop.className = "ai-dialog-backdrop";
    backdrop.innerHTML = `<div class="ai-dialog${danger ? " danger" : ""}" role="dialog" aria-modal="true" aria-labelledby="aiDialogTitle"><div class="ai-dialog-icon">${danger ? "!" : "✎"}</div><h2 id="aiDialogTitle">${escapeHTML(title)}</h2><p>${escapeHTML(message)}</p>${danger ? "" : `<input class="ai-dialog-input" value="${escapeHTML(inputValue)}" maxlength="60" autocomplete="off" />`}<div class="ai-dialog-actions"><button class="btn ai-dialog-cancel" type="button">Não</button><button class="btn ai-dialog-confirm${danger ? " danger" : ""}" type="button">${escapeHTML(confirmLabel)}</button></div></div>`;
    document.body.append(backdrop);
    const input = el(".ai-dialog-input", backdrop);
    let finished = false;
    const finish = (value) => {
      if (finished) return;
      finished = true;
      backdrop.classList.remove("is-open");
      window.setTimeout(() => {
        backdrop.remove();
        resolve(value);
      }, 180);
    };
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    el(".ai-dialog-cancel", backdrop).addEventListener("click", () =>
      finish(null),
    );
    el(".ai-dialog-confirm", backdrop).addEventListener("click", () =>
      finish(danger ? true : input.value.trim()),
    );
    backdrop.addEventListener("click", (event) => {
      if (event.target === backdrop) finish(null);
    });
    backdrop.addEventListener("keydown", (event) => {
      if (event.key === "Escape") finish(null);
      if (event.key === "Enter" && !danger) finish(input.value.trim());
    });
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function renderAIChat(mount, compact = false) {
  const historyOpen = mount.classList.contains("history-open");
  mount.innerHTML = `<article class="card chat-shell${compact ? " compact-chat-shell" : ""}"><div class="ai-chat-layout"><aside class="ai-history-panel"><div class="ai-history-heading"><strong>Histórico de chats</strong><button class="btn btn-small" type="button" data-new-chat>+ Novo</button></div><div class="ai-history-list" data-ai-history></div></aside><div class="ai-conversation"><div class="ai-conversation-toolbar"><strong data-ai-title></strong><div><button class="btn btn-small" type="button" data-toggle-history>Histórico</button><button class="btn btn-small" type="button" data-new-chat>+ Novo chat</button><button class="btn btn-small ai-delete-chat" type="button" data-delete-active title="Apagar este chat" aria-label="Apagar este chat"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v10m4-10v10m4-10v10M5 6h14m-9-3h4l1 3H9l1-3Zm-3 3 1 14h10l1-14" /></svg></button></div></div><div class="messages" data-ai-messages></div><form class="chat-form" data-ai-form><input data-ai-input placeholder="Pergunte sobre seus dados..." autocomplete="off" /><button class="btn btn-primary" type="submit">Enviar ↗</button></form></div></div></article>`;
  mount.classList.toggle("history-open", historyOpen);
  const messages = el("[data-ai-messages]", mount);
  const input = el("[data-ai-input]", mount);
  const history = el("[data-ai-history]", mount);

  const renderHistory = () => {
    const chats = loadAIChats();
    const active = getActiveAIChat(chats);
    el("[data-ai-title]", mount).textContent = active.title;
    history.innerHTML = chats
      .map(
        (chat) =>
          `<div class="ai-history-item${chat.id === active.id ? " active" : ""}${chat.archived ? " archived" : ""}" data-chat-id="${escapeHTML(chat.id)}"><button class="ai-history-select" type="button" data-action="select" data-chat-id="${escapeHTML(chat.id)}">${escapeHTML(chat.title)}${chat.archived ? " <small>(arquivado)</small>" : ""}</button><span class="ai-history-actions"><button class="ai-edit-action" type="button" title="Renomear chat" aria-label="Renomear chat" data-action="rename" data-chat-id="${escapeHTML(chat.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.1 2.1 0 0 0-3-3L5 17Z" /><path d="m14.5 7.5 2 2" /></svg></button>${chat.archived ? `<button class="ai-archive-action" type="button" title="Restaurar chat" aria-label="Restaurar chat" data-action="restore" data-chat-id="${escapeHTML(chat.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14v11H5zM3 5h18v3H3z" /><path d="M9 12h6" /></svg></button>` : `<button class="ai-archive-action" type="button" title="Arquivar chat" aria-label="Arquivar chat" data-action="archive" data-chat-id="${escapeHTML(chat.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16v13H4zM2 4h20v3H2z" /><path d="M9 11h6" /></svg></button>`}<button class="ai-delete-chat" type="button" title="Apagar chat" aria-label="Apagar chat" data-action="delete" data-chat-id="${escapeHTML(chat.id)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v10m4-10v10m4-10v10M5 6h14m-9-3h4l1 3H9l1-3Zm-3 3 1 14h10l1-14" /></svg></button></span></div>`,
      )
      .join("");
  };

  const renderMessages = () => {
    const active = getActiveAIChat();
    messages.innerHTML = active.messages
      .map(
        (message) =>
          `<div class="message${message.role === "user" ? " user" : ""}">${message.role === "assistant" ? "<strong>Future AI</strong>" : ""}${escapeHTML(message.text)}</div>`,
      )
      .join("");
    messages.scrollTop = messages.scrollHeight;
  };

  const createNewChat = () => {
    const chats = loadAIChats();
    const chat = createAIChat();
    chats.push(chat);
    localStorage.setItem(AI_ACTIVE_CHAT_KEY, chat.id);
    saveAIChats(chats);
  };

  const deleteChat = (chatId) => {
    const chats = loadAIChats();
    if (!chats.some((chat) => chat.id === chatId)) return;
    openAIChatDialog({
      title: "Apagar chat",
      message: "Deseja apagar este chat? Esta ação não pode ser desfeita.",
      confirmLabel: "Sim",
      danger: true,
    }).then((confirmed) => {
      if (!confirmed) return;
      const remaining = chats.filter((chat) => chat.id !== chatId);
      localStorage.removeItem(AI_ACTIVE_CHAT_KEY);
      saveAIChats(
        remaining.length ? remaining : [createAIChat("Chat principal")],
      );
    });
  };

  mount.addEventListener("click", (event) => {
    if (event.target.closest("[data-new-chat]")) {
      event.preventDefault();
      createNewChat();
      return;
    }
    if (event.target.closest("[data-toggle-history]")) {
      event.preventDefault();
      mount.classList.toggle("history-open");
      return;
    }
    if (event.target.closest("[data-delete-active]")) {
      event.preventDefault();
      deleteChat(getActiveAIChat().id);
    }
  });
  history.addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const action = button.dataset.action;
    const chatId = button.dataset.chatId;
    const chats = loadAIChats();
    const chat = chats.find((item) => item.id === chatId);
    if (!chat) return;

    if (action === "select" && !chat.archived) {
      setActiveAIChat(chatId);
      return;
    }
    if (action === "rename") {
      openAIChatDialog({
        title: "Renomear chat",
        message: "Escolha um nome para identificar esta conversa.",
        inputValue: chat.title,
        confirmLabel: "Salvar",
      }).then((title) => {
        if (!title) return;
        chat.title = title;
        saveAIChats(chats);
      });
      return;
    }
    if (action === "archive" || action === "restore") {
      chat.archived = action === "archive";
      if (chat.archived && localStorage.getItem(AI_ACTIVE_CHAT_KEY) === chat.id)
        localStorage.removeItem(AI_ACTIVE_CHAT_KEY);
      saveAIChats(chats);
      return;
    }
    if (action === "delete") {
      deleteChat(chatId);
    }
  });

  el("[data-ai-form]", mount).addEventListener("submit", (event) => {
    event.preventDefault();
    const question = input.value.trim();
    if (!question) return;

    input.value = "";
    const chats = loadAIChats();
    const active = getActiveAIChat(chats);
    active.messages.push({
      id: `user-${Date.now()}`,
      role: "user",
      text: question,
    });
    saveAIChats(chats);
    renderMessages();

    window.setTimeout(() => {
      const currentChats = loadAIChats();
      const currentChat = currentChats.find((chat) => chat.id === active.id);
      if (!currentChat) return;
      currentChat.messages.push({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        text: simulatedAIAnswer(question),
      });
      saveAIChats(currentChats);
    }, 350);
  });

  renderHistory();
  renderMessages();
}

function renderAIChatInstances() {
  document.querySelectorAll("[data-ai-chat-mount]").forEach((mount) => {
    const input = el("[data-ai-input]", mount);
    const value = input?.value || "";
    renderAIChat(mount, mount.dataset.aiChatMount === "compact");
    const nextInput = el("[data-ai-input]", mount);
    if (nextInput) nextInput.value = value;
  });
}
function toast(message) {
  const item = document.createElement("div");
  item.className = "toast";
  item.textContent = message;
  document.body.append(item);
  setTimeout(() => item.remove(), 2600);
}
function iconFor(page) {
  return (
    {
      dashboard: "⌂",
      vendas: "↗",
      estoque: "▣",
      financeiro: "R$",
      despesas: "−",
      relatorios: "▤",
      calendario: "▦",
      ia: "AI",
      configuracoes: "⚙",
      automacao: "↻",
    }[page] || "•"
  );
}
function navMarkup(page) {
  const links = [
    { id: "dashboard", label: "Dashboard", href: "painel.html" },
    { id: "vendas", label: "Vendas", href: "vendas.html" },
    { id: "estoque", label: "Estoque", href: "estoque.html" },
    { id: "financeiro", label: "Financeiro", href: "financeiro.html" },
    { id: "despesas", label: "Despesas", href: "despesas.html" },
    { id: "relatorios", label: "Relatórios", href: "relatorios.html" },
    { id: "calendario", label: "Calendário", href: "calendario.html" },
    { id: "ia", label: "Inteligência Artificial", href: "ia.html" },
    { id: "automacao", label: "Automação", href: "automacao.html" },
    { id: "configuracoes", label: "Configurações", href: "configuracoes.html" },
  ];
  return links
    .map(
      (item) =>
        `<a class="${page === item.id ? "active" : ""}" href="${item.href}"><span class="nav-icon">${iconFor(item.id)}</span>${item.label}</a>`,
    )
    .join("");
}
function shell(page, title, subtitle) {
  const user = getUser();
  const aiStatus =
    page === "ia"
      ? `<span class="ai-page-status" data-ai-status><i></i><span data-ai-status-label>Funcionando</span></span>`
      : "";
  const unread = (state.notifications || []).filter(
    (item) => !item.read,
  ).length;
  const unreadBadge = notificationBadgeValue(unread);
  document.title = `${title} | ContAI`;
  el("#app").innerHTML =
    `<div class="app-shell"><aside class="sidebar"><a class="brand" href="painel.html"><span class="brand-mark">C</span><span>ContAI</span></a><p class="side-label">Workspace</p><nav class="side-nav" aria-label="Navegação principal">${navMarkup(page)}</nav><div class="plan-card"><strong>Plano Pro</strong><span>Seu plano está ativo</span><a href="configuracoes.html">Ver detalhes</a></div></aside><main class="main"><header class="topbar"><div>${page === "dashboard" ? `<span class="eyebrow">Resumo de hoje</span><h1>Olá, ${escapeHTML(user.name)}.</h1><p>Aqui está um resumo do seu negócio.</p>` : `<span class="eyebrow">Visão geral</span>${page === "ia" ? `<div class="page-heading-row"><h1>${title}</h1>${aiStatus}</div>` : `<h1>${title}</h1>`}<p>${subtitle}</p>`}</div><div class="top-actions"><div class="notification-wrap"><button class="icon-btn notification-btn" title="Notificações" aria-label="Notificações" aria-expanded="false">🔔${unread ? `<b class="notification-badge">${unreadBadge}</b>` : ""}</button><div class="notification-panel" hidden></div></div><button class="icon-btn" id="themeToggle" title="Alternar tema" aria-label="Alternar tema">☼</button><button class="profile" type="button" aria-expanded="false"><div class="avatar">${escapeHTML(initials(user.name))}</div><div class="profile-info"><strong>${escapeHTML(user.name)}</strong><span>Administrador</span></div></button><div class="profile-menu" hidden><strong>${escapeHTML(user.name)}</strong><span>${escapeHTML(user.email)}</span><small>${escapeHTML(user.plan)}</small><a href="configuracoes.html">Meu perfil</a><a href="configuracoes.html">Configurações</a><button type="button" data-logout>Sair</button></div></div></header><div id="page-content"></div></main></div>`;
  setTheme(getTheme());
  el("#themeToggle")?.remove();
  const setPanel = (panel, open) => {
    if (open) {
      panel.hidden = false;
      requestAnimationFrame(() => panel.classList.add("is-open"));
      return;
    }
    panel.classList.remove("is-open");
    setTimeout(() => {
      if (!panel.classList.contains("is-open")) panel.hidden = true;
    }, 160);
  };
  const notificationButton = el(".notification-btn");
  const notificationPanel = el(".notification-panel");
  const renderNotifications = () => {
    const notifications = state.notifications || [];
    notificationPanel.innerHTML = `<div class="panel-heading"><strong>Notificações</strong><div class="notification-actions"><button type="button" data-read-all>Marcar como lidas</button><button type="button" data-clear-notifications onclick="window.dispatchEvent(new Event('contai-clear-notifications'))">Limpar</button></div></div>${notifications.length ? notifications.map((item) => `<article class="notification-item ${item.read ? "read" : "unread"}"><strong>${escapeHTML(item.title)}</strong><span>${escapeHTML(item.message)}</span><small>${new Date(item.date).toLocaleString("pt-BR")}</small></article>`).join("") : `<p class="empty-panel">Nenhuma notificação nova.</p>`}`;
    notificationPanel
      .querySelector("[data-read-all]")
      ?.addEventListener("click", () => {
        state.notifications = notifications.map((item) => ({
          ...item,
          read: true,
        }));
        save();
        renderNotifications();
        notificationButton.querySelector(".notification-badge")?.remove();
      });
    notificationPanel
      .querySelector("[data-clear-notifications]")
      ?.addEventListener("click", () => {
        state.notifications = [];
        save();
        renderNotifications();
        notificationButton.querySelector(".notification-badge")?.remove();
      });
  };
  renderNotifications();
  window.addEventListener("contai-clear-notifications", () => {
    state.notifications = [];
    save();
    renderNotifications();
    notificationButton.querySelector(".notification-badge")?.remove();
  });
  document.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest("[data-clear-notifications]")) return;
      state.notifications = [];
      save();
      renderNotifications();
      notificationButton.querySelector(".notification-badge")?.remove();
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
  notificationPanel.addEventListener("click", (event) => {
    const clearButton = event.target.closest("[data-clear-notifications]");
    if (!clearButton) return;
    event.stopPropagation();
    state.notifications = [];
    save();
    renderNotifications();
    notificationButton.querySelector(".notification-badge")?.remove();
  });
  window.addEventListener("contai-notification", () => {
    renderNotifications();
    notificationButton.querySelector(".notification-badge")?.remove();
    const unreadCount = (state.notifications || []).filter(
      (item) => !item.read,
    ).length;
    if (unreadCount)
      notificationButton.insertAdjacentHTML(
        "beforeend",
        `<b class="notification-badge">${notificationBadgeValue(unreadCount)}</b>`,
      );
  });
  notificationButton.addEventListener("click", () => {
    const open = notificationPanel.hidden;
    setPanel(notificationPanel, open);
    notificationButton.setAttribute("aria-expanded", String(open));
  });
  const profile = el(".profile");
  const profileMenu = el(".profile-menu");
  profile.addEventListener("click", () => {
    const open = profileMenu.hidden;
    setPanel(profileMenu, open);
    profile.setAttribute("aria-expanded", String(open));
  });
  el("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("cadastroConcluido");
    window.location.href = "../home.html";
  });
  document.addEventListener(
    "click",
    (event) => {
      if (!event.target.closest(".notification-wrap")) {
        setPanel(notificationPanel, false);
        notificationButton.setAttribute("aria-expanded", "false");
      }
      if (!event.target.closest(".profile, .profile-menu")) {
        setPanel(profileMenu, false);
        profile.setAttribute("aria-expanded", "false");
      }
    },
    { once: false },
  );
}
function modal(title, content) {
  const backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop open";
  backdrop.innerHTML = `<div class="card modal"><div class="modal-header"><div><span class="eyebrow">ContAI</span><h2>${title}</h2></div><button class="close-btn" aria-label="Fechar">×</button></div>${content}</div>`;
  document.body.append(backdrop);
  const close = () => backdrop.remove();
  el(".close-btn", backdrop).addEventListener("click", close);
  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) close();
  });
  return { backdrop, close };
}
function lineData(period) {
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
  const buckets = period === "3m" ? 12 : days;
  const bucketSize = period === "3m" ? 7 : 1;
  return Array.from({ length: buckets }, (_, index) => {
    const endOffset = days - 1 - index * bucketSize;
    const end = new Date(today);
    end.setDate(today.getDate() - endOffset);
    const start = new Date(end);
    start.setDate(end.getDate() - bucketSize + 1);
    const value = state.sales.reduce((sum, sale) => {
      const date = new Date(`${sale.date}T12:00:00`);
      return date >= start && date <= end ? sum + Number(sale.total || 0) : sum;
    }, 0);
    return {
      label:
        period === "3m"
          ? `${start.getDate()}/${start.getMonth() + 1}`
          : `${end.getDate()}/${end.getMonth() + 1}`,
      value,
    };
  });
}
function renderLineChart(target, period = "7d") {
  const data = lineData(period);
  const width = 700;
  const height = 245;
  const max = Math.max(1, ...data.map((item) => item.value)) * 1.15;
  const chartLeft = 76;
  const chartRight = width - 20;
  const chartTop = 25;
  const chartBottom = height - 30;
  const points = data.map(
    (item, index) =>
      `${chartLeft + (index * (chartRight - chartLeft)) / Math.max(1, data.length - 1)},${chartBottom - (item.value / max) * (chartBottom - chartTop)}`,
  );
  const axisValues = [max, max * 0.66, max * 0.33, 0];
  target.innerHTML = `<svg class="line-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Desempenho geral"><g class="chart-axis-labels">${axisValues.map((value, index) => `<text x="4" y="${chartTop + index * ((chartBottom - chartTop) / 3) + 4}">${money(value).replace(",00", "")}</text>`).join("")}</g>${[chartTop, chartTop + (chartBottom - chartTop) / 3, chartTop + ((chartBottom - chartTop) * 2) / 3, chartBottom].map((y) => `<line class="gridline" x1="${chartLeft}" y1="${y}" x2="${chartRight}" y2="${y}"/>`).join("")}<polyline class="chart-line" points="${points.join(" ")}"/>${data
    .map((item, index) => {
      const [x, y] = points[index].split(",");
      return `<circle class="chart-point" data-index="${index}" cx="${x}" cy="${y}" r="5"><title>${item.label}: ${money(item.value)}</title></circle>`;
    })
    .join("")}<g class="chart-x-labels">${data
    .map((item, index) => {
      const [x] = points[index].split(",");
      return `<text x="${x}" y="238" text-anchor="middle">${item.label}</text>`;
    })
    .join(
      "",
    )}</g><line class="chart-crosshair" x1="0" y1="${chartTop}" x2="0" y2="${chartBottom}"/><rect class="chart-hit-area" x="${chartLeft}" y="${chartTop}" width="${chartRight - chartLeft}" height="${chartBottom - chartTop}"/></svg><div class="tooltip" hidden></div>`;
  const tooltip = el(".tooltip", target);
  const crosshair = el(".chart-crosshair", target);
  const selectPoint = (index, clientX) => {
    const item = data[index];
    const rect = target.getBoundingClientRect();
    const x =
      chartLeft +
      (index * (chartRight - chartLeft)) / Math.max(1, data.length - 1);
    tooltip.innerHTML = `<strong>${item.label}</strong><span>Receita: ${money(item.value)}</span>`;
    tooltip.style.left = `${(clientX ?? rect.left + (x / width) * rect.width) - rect.left}px`;
    tooltip.style.top = `${(chartTop / height) * rect.height}px`;
    tooltip.hidden = false;
    crosshair.setAttribute("x1", x);
    crosshair.setAttribute("x2", x);
    els(".chart-point", target).forEach((point) =>
      point.classList.toggle("selected", Number(point.dataset.index) === index),
    );
  };
  el(".chart-hit-area", target).addEventListener("mousemove", (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (event.clientX - rect.left) / rect.width),
    );
    selectPoint(Math.round(ratio * (data.length - 1)), event.clientX);
  });
  el(".chart-hit-area", target).addEventListener("mouseleave", () => {
    tooltip.hidden = true;
    crosshair.setAttribute("x1", 0);
    crosshair.setAttribute("x2", 0);
  });
  els(".chart-point", target).forEach((point) =>
    point.addEventListener("mouseenter", (event) => {
      const item = data[Number(event.currentTarget.dataset.index)];
      selectPoint(Number(event.currentTarget.dataset.index), event.clientX);
    }),
  );
  els(".chart-point", target).forEach((point) =>
    point.addEventListener("mouseleave", (event) => {
      tooltip.hidden = true;
      event.currentTarget.classList.remove("selected");
    }),
  );
}
function renderDonut(target) {
  const groups = {};
  state.sales.forEach((sale) => {
    const product = state.products.find((item) => item.id === sale.productId);
    const category = product?.category || "Outros";
    groups[category] = (groups[category] || 0) + sale.total;
  });
  const entries = Object.entries(groups);
  if (!entries.length) {
    target.innerHTML =
      '<p class="subtext">Ainda não há vendas para calcular a distribuição.</p>';
    return;
  }
  const total = entries.reduce((sum, [, value]) => sum + value, 0);
  const colors = ["#62e5ff", "#5de0b0", "#a68cff", "#ffb95e"];
  let offset = 0;
  const segments = entries
    .map(([label, value], index) => {
      const percent = value / total;
      const dash = percent * 100;
      const segment = `<circle class="donut-segment" pathLength="100" cx="75" cy="75" r="57" stroke="${colors[index % colors.length]}" stroke-dasharray="${dash} ${100 - dash}" stroke-dashoffset="${-offset}" data-label="${escapeHTML(label)}" data-value="${value}" title="${escapeHTML(label)}: ${Math.round(percent * 100)}% · ${money(value)}"/>`;
      offset += dash;
      return segment;
    })
    .join("");
  target.innerHTML = `<div class="donut-layout"><svg class="donut" viewBox="0 0 150 150">${segments}</svg><div class="legend">${entries.map(([label, value], index) => `<div class="legend-row"><span class="legend-label"><i class="legend-dot" style="background:${colors[index % colors.length]}"></i>${escapeHTML(label)}</span><strong>${Math.round((value / total) * 100)}%</strong></div>`).join("")}</div></div><div class="subtext" id="donutHint">Passe o cursor sobre uma categoria para ver o detalhe.</div>`;
  els(".donut-segment", target).forEach((segment) => {
    segment.addEventListener("mouseenter", () => {
      el("#donutHint", target).textContent =
        `${segment.dataset.label}: ${Math.round((Number(segment.dataset.value) / total) * 100)}% · ${money(segment.dataset.value)}`;
      segment.classList.add("selected");
    });
    segment.addEventListener("mouseleave", () =>
      segment.classList.remove("selected"),
    );
  });
}
function dashboard() {
  const content = el("#page-content");
  const values = totals();
  const metrics = financialMetrics(values);
  content.innerHTML = `<section class="grid stats-grid"><article class="card stat-card"><div class="stat-head"><span>Receita</span><span class="stat-icon">↗</span></div><strong class="stat-value">${money(values.revenue)}</strong><span class="trend ${resultClass(values.revenue)}">Base atual</span></article><article class="card stat-card"><div class="stat-head"><span>Despesas</span><span class="stat-icon">↓</span></div><strong class="stat-value">${money(values.expenses)}</strong><span class="trend ${values.expenses > values.revenue ? "negative" : "warn"}">${signedPercentage(metrics.expenseRate)} da receita</span></article><article class="card stat-card"><div class="stat-head"><span>Vendas</span><span class="stat-icon">◇</span></div><strong class="stat-value">${values.sales}</strong><span class="trend ${resultClass(values.profit)}">${signedPercentage(metrics.netMargin)} margem líquida</span></article><article class="card stat-card"><div class="stat-head"><span>Estoque</span><span class="stat-icon">▦</span></div><strong class="stat-value">${values.stock} produtos</strong><span class="subtext">${values.low} em estoque baixo · ${values.out} sem estoque</span></article></section><section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Desempenho Geral</h2><p>Receita acompanhada ao longo do tempo</p></div><div class="filters"><button class="filter-btn active" data-period="7d">7 dias</button><button class="filter-btn" data-period="30d">30 dias</button><button class="filter-btn" data-period="3m">3 meses</button></div></div><div class="chart-wrap" id="performanceChart"></div></article><article class="card"><div class="section-title"><div><h2>Vendas por categoria</h2><p>Distribuição do faturamento</p></div></div><div id="categoryChart"></div></article></section><section class="grid two-col" style="margin-top:18px"><article class="card"><div class="section-title"><h2>Vendas Recentes</h2><a class="btn btn-small" href="vendas.html">Ver todas</a></div><div class="sales-list">${state.sales
    .slice(0, 5)
    .map(
      (sale) =>
        `<div class="sale-row"><div class="sale-product"><strong>${escapeHTML(sale.product)}</strong><span>${escapeHTML(sale.customer)}</span></div><span class="muted">${dateBR(sale.date)}</span><strong>${money(sale.total)}</strong><span class="status ${["Pendente", "Aguardando"].includes(sale.paymentStatus) ? "pending" : sale.paymentStatus === "Cancelado" ? "cancelled" : ""}">${escapeHTML(sale.paymentStatus)}</span></div>`,
    )
    .join(
      "",
    )}</div></article><article class="card"><div class="section-title"><div><h2>Resumo Financeiro</h2><p>Resultado acumulado</p></div><a class="btn btn-small" href="financeiro.html">Ver relatório</a></div><div class="metric-row"><span>Receitas</span><strong class="positive">${money(values.revenue)}</strong></div><div class="metric-row"><span>Despesas</span><strong>${money(values.expenses)}</strong></div><div class="metric-row"><span>Custos das vendas</span><strong>${money(values.costOfSales)}</strong></div><div class="metric-row"><span>Lucro líquido</span><strong class="${resultClass(values.profit)}">${money(values.profit)}</strong></div><div class="metric-row"><span>Margem líquida</span><strong class="${resultClass(metrics.netMargin)}">${signedPercentage(metrics.netMargin)}</strong></div></article></section>`;
  renderLineChart(el("#performanceChart"));
  const stockStatIcon = el(".stat-card:nth-child(4) .stat-icon", content);
  if (stockStatIcon) stockStatIcon.textContent = "▣";
  renderDonut(el("#categoryChart"));
  const dashboardExpenseTrend = el(".stat-card:nth-child(2) .trend", content);
  if (dashboardExpenseTrend) {
    dashboardExpenseTrend.textContent = `${signedPercentage(metrics.netMargin)} resultado líquido`;
    dashboardExpenseTrend.className = `trend ${resultClass(metrics.netMargin)}`;
  }
  const financialRows = els(".metric-row", content);
  const profitRow = financialRows.find((row) =>
    row.textContent.includes("Lucro líquido"),
  );
  if (profitRow) {
    const value = el("strong", profitRow);
    value.textContent = money(values.profit);
    value.className = values.profit >= 0 ? "positive" : "negative";
  }
  els("[data-period]").forEach((button) =>
    button.addEventListener("click", () => {
      els("[data-period]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderLineChart(el("#performanceChart"), button.dataset.period);
    }),
  );
}
function productForm(product = {}) {
  return `<form id="productForm"><div class="form-grid"><label>Nome do produto<input name="name" required value="${escapeHTML(product.name)}" /></label><label>Categoria<input name="category" required value="${escapeHTML(product.category)}" /></label><label>Preço de venda<input name="price" type="number" min="0" step="0.01" required value="${product.price || ""}" /></label><label>Custo unitário<input name="costPrice" type="number" min="0" step="0.01" required value="${product.costPrice ?? ""}" /></label><label>Quantidade inicial<input name="quantity" type="number" min="0" step="1" required value="${product.quantity ?? ""}" /></label><label>Limite de estoque baixo<input name="lowLimit" type="number" min="0" step="1" required value="${product.lowLimit ?? 5}" /></label><label>Ícone<input name="icon" maxlength="2" value="${escapeHTML(product.icon || "▣")}" /></label></div><div class="form-actions"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit">Salvar produto</button></div></form>`;
}
function openProduct(product, onSave) {
  const dialog = modal(
    product ? "Editar produto" : "Adicionar produto",
    productForm(product || {}),
  );
  el("#productForm", dialog.backdrop).addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: product?.id || `p${Date.now()}`,
      name: form.get("name"),
      category: form.get("category"),
      price: Number(form.get("price")),
      costPrice: Number(form.get("costPrice")),
      quantity: Math.max(0, Number(form.get("quantity"))),
      lowLimit: Number(form.get("lowLimit")),
      icon: form.get("icon") || "▣",
    });
    dialog.close();
  });
  el("[data-close]", dialog.backdrop).addEventListener("click", dialog.close);
}
function estoque() {
  const content = el("#page-content");
  const render = () => {
    content.innerHTML = `<div class="section-title"><div><h2>Catálogo de produtos</h2><p>${state.products.length} produtos cadastrados · ${totals().low} precisam de atenção</p></div><button class="btn btn-primary" id="addProduct" type="button">+ Adicionar produto</button></div><article class="card table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Quantidade</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>${state.products
      .map((product) => {
        const outOfStock = product.quantity === 0;
        const lowStock = product.quantity <= product.lowLimit;
        return `<tr><td><div class="product-cell"><span class="product-icon">${escapeHTML(product.icon)}</span><strong>${escapeHTML(product.name)}</strong></div></td><td>${escapeHTML(product.category)}</td><td><div class="stock-quantity-control"><button class="stock-quantity-button" data-stock="${product.id}" data-change="-1" aria-label="Diminuir quantidade">−</button><input class="stock-quantity-input" data-stock-input="${product.id}" type="number" min="0" step="1" value="${product.quantity}" aria-label="Quantidade de ${escapeHTML(product.name)}" /><button class="stock-quantity-button" data-stock="${product.id}" data-change="1" aria-label="Aumentar quantidade">+</button></div></td><td>${money(product.price)}</td><td><span class="status ${outOfStock ? "out-of-stock" : lowStock ? "pending" : ""}">${outOfStock ? "Estoque em falta" : lowStock ? "Estoque baixo" : "Disponível"}</span></td><td><button class="btn btn-small ai-edit-action" data-edit="${product.id}" title="Editar produto" aria-label="Editar produto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.1 2.1 0 0 0-3-3L5 17Z" /><path d="m14.5 7.5 2 2" /></svg></button> <button class="btn btn-small btn-danger stock-delete-button" data-delete="${product.id}" title="Excluir" aria-label="Excluir produto"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m-9 0 1 13h8l1-13M10 11v5m4-5v5" /></svg></button></td></tr>`;
      })
      .join("")}</tbody></table></article>`;
    el("#addProduct").addEventListener("click", (event) => {
      event.preventDefault();
      openProduct(null, (product) => {
        state.products.push(product);
        notifyOutOfStock(product);
        addNotification(
          "Produto adicionado",
          `${product.name} entrou no estoque.`,
          "stock",
        );
        save();
        render();
        toast("Produto adicionado com sucesso.");
      });
    });
    els("[data-stock]").forEach((button) =>
      button.addEventListener("click", () => {
        const product = state.products.find(
          (item) => item.id === button.dataset.stock,
        );
        product.quantity = Math.max(
          0,
          product.quantity + Number(button.dataset.change),
        );
        notifyOutOfStock(product);
        addNotification(
          "Estoque atualizado",
          `${product.name}: ${product.quantity} unidades disponíveis.`,
          "stock",
        );
        save();
        render();
      }),
    );
    els("[data-stock-input]").forEach((input) =>
      input.addEventListener("change", () => {
        const product = state.products.find(
          (item) => item.id === input.dataset.stockInput,
        );
        if (!product) return;
        product.quantity = Math.max(0, Math.floor(Number(input.value) || 0));
        notifyOutOfStock(product);
        addNotification(
          "Estoque atualizado",
          `${product.name}: ${product.quantity} unidades disponíveis.`,
          "stock",
        );
        save();
        render();
      }),
    );
    els("[data-edit]").forEach((button) =>
      button.addEventListener("click", () => {
        const product = state.products.find(
          (item) => item.id === button.dataset.edit,
        );
        openProduct(product, (updated) => {
          Object.assign(product, updated);
          notifyOutOfStock(product);
          save();
          render();
          toast("Alterações salvas.");
        });
      }),
    );
    els("[data-delete]").forEach((button) =>
      button.addEventListener("click", () => {
        const product = state.products.find(
          (item) => item.id === button.dataset.delete,
        );
        if (confirm(`Remover ${product.name}?`)) {
          state.products = state.products.filter(
            (item) => item.id !== product.id,
          );
          save();
          render();
          toast("Produto removido.");
        }
      }),
    );
  };
  render();
}
function saleForm(sale = {}) {
  return `<form id="saleForm"><div class="form-grid"><label>Produto<select name="productId" required>${state.products.map((product) => `<option value="${product.id}" ${sale.productId === product.id ? "selected" : ""}>${escapeHTML(product.name)} · ${money(product.price)}</option>`).join("")}</select></label><label>Cliente/comprador<input name="customer" required value="${escapeHTML(sale.customer)}" /></label><label>Quantidade<input name="quantity" type="number" min="1" required value="${sale.quantity || 1}" /></label><label>Data<input name="date" type="date" required value="${sale.date || new Date().toISOString().slice(0, 10)}" /></label><label>Horário<input name="time" type="time" required value="${sale.time || "12:00"}" /></label><label>Endereço de envio<input name="address" required value="${escapeHTML(sale.address)}" /></label><label>Cupom<input name="coupon" value="${escapeHTML(sale.coupon)}" /></label><label>Desconto<input name="discount" type="number" min="0" step="0.01" value="${sale.discount || 0}" /></label><label>Forma de pagamento<select name="payment"><option ${sale.payment === "Pix" ? "selected" : ""}>Pix</option><option ${sale.payment === "Cartão" ? "selected" : ""}>Cartão</option><option ${sale.payment === "Boleto" ? "selected" : ""}>Boleto</option></select></label><label>Status do pagamento<select name="paymentStatus"><option>Pago</option><option ${sale.paymentStatus === "Pendente" ? "selected" : ""}>Pendente</option><option ${sale.paymentStatus === "Cancelado" ? "selected" : ""}>Cancelado</option></select></label><label>Status do envio<select name="shippingStatus"><option>Enviado</option><option ${sale.shippingStatus === "Aguardando" ? "selected" : ""}>Aguardando</option><option ${sale.shippingStatus === "Entregue" ? "selected" : ""}>Entregue</option></select></label></div><div class="form-actions"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit">Salvar venda</button></div></form>`;
}
function openSale(sale, onSave) {
  const dialog = modal(
    sale ? "Editar venda" : "Nova venda",
    saleForm(sale || {}),
  );
  el("#saleForm", dialog.backdrop).addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product = state.products.find(
      (item) => item.id === form.get("productId"),
    );
    const quantity = Number(form.get("quantity"));
    const previousQuantity = sale?.quantity || 0;
    if (!product) {
      toast("Cadastre um produto antes de registrar uma venda.");
      return;
    }
    const available =
      product.quantity +
      (sale?.productId === product.id ? previousQuantity : 0);
    if (!product || quantity < 1 || quantity > available) {
      toast(`Estoque insuficiente. Disponível: ${available} unidade(s).`);
      return;
    }
    const value = product.price * quantity;
    onSave({
      id: sale?.id || `V-${1050 + state.sales.length}`,
      productId: product.id,
      product: product.name,
      customer: form.get("customer"),
      quantity,
      date: form.get("date"),
      time: form.get("time"),
      address: form.get("address"),
      coupon: form.get("coupon"),
      discount: Number(form.get("discount")),
      payment: form.get("payment"),
      paymentStatus: form.get("paymentStatus"),
      shippingStatus: form.get("shippingStatus"),
      value,
      costTotal: product.costPrice * quantity,
      total: Math.max(0, value - Number(form.get("discount"))),
    });
    dialog.close();
  });
  el("[data-close]", dialog.backdrop).addEventListener("click", dialog.close);
}
function applyStock(sale, amount) {
  const product = state.products.find((item) => item.id === sale.productId);
  if (product) {
    product.quantity = Math.max(0, product.quantity + amount);
    notifyOutOfStock(product);
  }
}
function vendas() {
  const content = el("#page-content");
  const render = () => {
    content.innerHTML = `<div class="section-title"><div><h2>Histórico completo</h2><p>Pesquise, filtre e gerencie cada venda registrada.</p></div><button class="btn btn-primary" id="addSale" type="button">+ Nova venda</button></div><article class="card"><div class="filters" style="margin-bottom:18px"><input id="saleSearch" placeholder="Pesquisar por produto, cliente ou ID" /><select id="saleStatus"><option value="all">Todos os status</option><option>Pago</option><option>Pendente</option><option>Cancelado</option></select></div><div class="table-wrap"><table><thead><tr><th>ID / Produto</th><th>Comprador</th><th>Data e horário</th><th>Envio</th><th>Método de pagamento</th><th>Status do pagamento</th><th>Valor final</th><th>Ações</th></tr></thead><tbody id="salesTable"></tbody></table></div></article>`;
    const draw = () => {
      const query = (el("#saleSearch").value || "").toLowerCase();
      const filter = el("#saleStatus").value;
      const rows = state.sales.filter(
        (sale) =>
          (!query ||
            `${sale.id} ${sale.product} ${sale.customer}`
              .toLowerCase()
              .includes(query)) &&
          (filter === "all" || sale.paymentStatus === filter),
      );
      el("#salesTable").innerHTML =
        rows
          .map(
            (sale) =>
              `<tr><td><strong>${sale.id}</strong><small>${escapeHTML(sale.product)} · ${sale.quantity} un.</small></td><td>${escapeHTML(sale.customer)}<small>${escapeHTML(sale.address)}</small></td><td>${dateBR(sale.date)}<small>${sale.time}</small></td><td><span class="status">${escapeHTML(sale.shippingStatus)}</span></td><td><span class="payment-method">${escapeHTML(sale.payment || "Não informado")}</span></td><td><span class="status ${sale.paymentStatus === "Pendente" ? "pending" : sale.paymentStatus === "Cancelado" ? "cancelled" : ""}">${escapeHTML(sale.paymentStatus)}</span></td><td><strong>${money(sale.total)}</strong><small>Desconto: ${money(sale.discount)}</small></td><td><button class="btn btn-small ai-edit-action" data-edit-sale="${sale.id}" title="Editar venda" aria-label="Editar venda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.1 2.1 0 0 0-3-3L5 17Z" /><path d="m14.5 7.5 2 2" /></svg></button> <button class="btn btn-small ai-delete-chat" data-delete-sale="${sale.id}" title="Apagar venda" aria-label="Apagar venda"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v10m4-10v10m4-10v10M5 6h14m-9-3h4l1 3H9l1-3Zm-3 3 1 14h10l1-14" /></svg></button></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="8">Nenhuma venda encontrada.</td></tr>`;
      els("[data-edit-sale]").forEach((button) =>
        button.addEventListener("click", () => {
          const sale = state.sales.find(
            (item) => item.id === button.dataset.editSale,
          );
          openSale(sale, (updated) => {
            applyStock(sale, sale.quantity);
            applyStock(updated, -updated.quantity);
            Object.assign(sale, updated);
            save();
            render();
            toast("Alterações salvas.");
          });
        }),
      );
      els("[data-delete-sale]").forEach((button) =>
        button.addEventListener("click", () => {
          const sale = state.sales.find(
            (item) => item.id === button.dataset.deleteSale,
          );
          if (!sale) return;
          openAIChatDialog({
            title: "Apagar venda",
            message: `Deseja apagar a venda ${sale.id}? O estoque será devolvido.`,
            confirmLabel: "Sim",
            danger: true,
          }).then((confirmed) => {
            if (!confirmed) return;
            applyStock(sale, sale.quantity);
            state.sales = state.sales.filter((item) => item.id !== sale.id);
            addNotification(
              "Venda excluída",
              `${sale.id} foi removida e o estoque foi devolvido.`,
              "sale",
            );
            save();
            render();
            toast("Venda excluída com sucesso.");
          });
        }),
      );
    };
    el("#saleSearch").addEventListener("input", draw);
    el("#saleStatus").addEventListener("change", draw);
    draw();
    el("#addSale").addEventListener("click", (event) => {
      event.preventDefault();
      openSale(null, (sale) => {
        applyStock(sale, -sale.quantity);
        state.sales.unshift(sale);
        addNotification(
          "Venda cadastrada",
          `${sale.id} foi registrada com ${money(sale.total)}.`,
          "sale",
        );
        save();
        render();
        toast("Venda registrada com sucesso.");
      });
    });
  };
  render();
}
function expenseForm(expense = {}) {
  const groups = state.expenseGroups || [];
  return `<form id="expenseForm"><div class="form-grid"><label>Nome da despesa<input name="name" required maxlength="60" placeholder="Ex.: Conta de luz de setembro" value="${escapeHTML(expense.name || expense.label)}" /></label><label>Grupo da despesa<select name="group" required>${groups.map((group) => `<option ${expense.group === group ? "selected" : ""}>${escapeHTML(group)}</option>`).join("")}</select><button class="inline-create-group" type="button" data-create-group>+ Criar grupo</button></label><label>Valor<input name="value" type="number" min="0.01" step="0.01" required value="${expense.value ?? ""}" /></label><label>Data<input name="date" type="date" required value="${expense.date || new Date().toISOString().slice(0, 10)}" /></label><label class="full">Observação<input name="note" maxlength="100" value="${escapeHTML(expense.note)}" /></label><label class="expense-recurring-option"><input name="recurring" type="checkbox" ${expense.recurring ? "checked" : ""} /> Repetir esta despesa todos os meses</label></div><div class="form-actions"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit">Salvar despesa</button></div></form>`;
}

function createExpenseGroup(onCreated) {
  const dialog = modal(
    "Criar grupo de despesas",
    '<form id="expenseGroupForm"><label>Nome do grupo<input name="name" required maxlength="50" placeholder="Ex.: Água, Luz ou Internet" /></label><div class="form-actions"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit">Criar grupo</button></div></form>',
  );
  el("#expenseGroupForm", dialog.backdrop).addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      const name = String(
        new FormData(event.currentTarget).get("name") || "",
      ).trim();
      if (!name) return;
      if (!state.expenseGroups.includes(name)) {
        state.expenseGroups.push(name);
        save();
      }
      onCreated(name);
      dialog.close();
    },
  );
  el("[data-close]", dialog.backdrop).addEventListener("click", dialog.close);
}
function openExpense(expense, onSave) {
  const dialog = modal(
    expense ? "Editar despesa" : "Nova despesa",
    expenseForm(expense || {}),
  );
  el("[data-create-group]", dialog.backdrop).addEventListener("click", () => {
    createExpenseGroup((group) => {
      const select = el('select[name="group"]', dialog.backdrop);
      if (select) {
        select.insertAdjacentHTML(
          "beforeend",
          `<option selected>${escapeHTML(group)}</option>`,
        );
        select.value = group;
      }
    });
  });
  el("#expenseForm", dialog.backdrop).addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    onSave({
      id: expense?.id || `e${Date.now()}`,
      label: String(form.get("name") || "").trim(),
      name: String(form.get("name") || "").trim(),
      group: String(form.get("group") || "").trim(),
      value: Number(form.get("value")),
      date: form.get("date"),
      note: String(form.get("note") || "").trim(),
      recurring: form.get("recurring") === "on",
    });
    dialog.close();
  });
  el("[data-close]", dialog.backdrop).addEventListener("click", dialog.close);
}
function despesas() {
  const content = el("#page-content");
  const render = () => {
    const total = state.expenses.reduce(
      (sum, item) => sum + Number(item.value || 0),
      0,
    );
    const grouped = (state.expenseGroups || [])
      .map((group) => ({
        group,
        value: state.expenses
          .filter((expense) => (expense.group || expense.label) === group)
          .reduce((sum, expense) => sum + Number(expense.value || 0), 0),
      }))
      .sort((a, b) => b.value - a.value);
    const largest = grouped[0];
    const expenseIcon =
      '<svg viewBox="0 0 48 48" aria-hidden="true"><path class="expense-hand" d="M8 35c2-5 6-8 11-8h4V17c0-2 3-2 3 0v8h2V13c0-2 3-2 3 0v12h2V16c0-2 3-2 3 0v11c0 7-5 12-12 12H16c-4 0-7-2-8-4Z"/><path class="expense-paper" d="M18 8h18v22H18z"/><path class="expense-paper-line" d="M22 13h10m-10 5h10m-10 5h5"/><path class="expense-currency" d="M27 16v10m3-8c-1-2-5-2-5 0 0 2 5 1 5 4 0 2-4 3-6 1"/></svg>';
    const groupSections = (state.expenseGroups || [])
      .map((group) => {
        const groupExpenses = state.expenses.filter(
          (expense) => (expense.group || expense.label) === group,
        );
        const groupTotal = groupExpenses.reduce(
          (sum, expense) => sum + Number(expense.value || 0),
          0,
        );
        const entries = groupExpenses.length
          ? groupExpenses
              .map(
                (expense) =>
                  `<div class="expense-row expense-entry-row"><div class="expense-row-main"><span class="expense-group-icon">${expenseIcon}</span><div><strong>${escapeHTML(expense.name || expense.label)}</strong><small>${expense.date ? dateBR(expense.date) : "Sem data"}${expense.note ? ` · ${escapeHTML(expense.note)}` : ""}</small></div></div><strong class="expense-value">${money(expense.value)}</strong><div class="expense-actions"><button class="btn btn-small ai-edit-action" data-edit-expense="${expense.id}" type="button" title="Editar despesa" aria-label="Editar despesa"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 16-.8 4.8L8 20l11.5-11.5a2.1 2.1 0 0 0-3-3L5 17Z" /><path d="m14.5 7.5 2 2" /></svg></button><button class="btn btn-small ai-delete-chat" data-delete-expense="${expense.id}" type="button" title="Apagar despesa" aria-label="Apagar despesa"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v10m4-10v10m4-10v10M5 6h14m-9-3h4l1 3H9l1-3Zm-3 3 1 14h10l1-14" /></svg></button></div></div>`,
              )
              .join("")
          : `<p class="empty-group-message">Este grupo ainda não possui despesas cadastradas.</p>`;
        return `<section class="expense-group-section"><header class="expense-group-header"><div><span class="expense-group-kicker">Grupo de despesas</span><h3>${escapeHTML(group)}</h3></div><div class="expense-group-header-actions"><strong>${money(groupTotal)}</strong><button class="btn btn-small ai-delete-chat" data-delete-expense-group="${escapeHTML(group)}" type="button" title="Excluir grupo" aria-label="Excluir grupo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8v10m4-10v10m4-10v10M5 6h14m-9-3h4l1 3H9l1-3Zm-3 3 1 14h10l-1-14" /></svg></button></div></header><div class="expense-group-entries">${entries}</div></section>`;
      })
      .join("");
    content.innerHTML = `<section class="grid stats-grid"><article class="card stat-card"><div class="stat-head"><span>Total de despesas</span><span class="stat-icon">−</span></div><strong class="stat-value negative">${money(total)}</strong><span class="subtext">${state.expenseGroups.length} grupo(s) cadastrado(s)</span></article><article class="card stat-card"><div class="stat-head"><span>Maior grupo</span><span class="stat-icon">↗</span></div><strong class="stat-value">${escapeHTML(largest?.group || "Nenhum")}</strong><span class="subtext">${largest ? money(largest.value) : "Crie um grupo"}</span></article><article class="card stat-card"><div class="stat-head"><span>Participação maior</span><span class="stat-icon">%</span></div><strong class="stat-value">${total && largest ? `${((largest.value / total) * 100).toFixed(1).replace(".", ",")}%` : "0%"}</strong><span class="subtext">Do total registrado</span></article></section><div class="section-title expense-section-title"><div><h2>Grupos de despesas</h2><p>Cada grupo mantém seus próprios lançamentos separados.</p></div><div class="expense-section-actions"><button class="btn btn-secondary" id="addExpenseGroup" type="button">+ Criar grupo</button><button class="btn btn-primary" id="addExpense" type="button">+ Adicionar despesa</button></div></div><div class="expense-groups-container">${groupSections || `<article class="card empty-panel">Nenhum grupo cadastrado ainda.</article>`}</div>`;
    el("#addExpenseGroup").addEventListener("click", () =>
      createExpenseGroup(() => render()),
    );
    el("#addExpense").addEventListener("click", () =>
      openExpense(null, (expense) => {
        state.expenses.push(expense);
        save();
        render();
        toast("Despesa adicionada com sucesso.");
      }),
    );
    els("[data-edit-expense]").forEach((button) =>
      button.addEventListener("click", () => {
        const expense = state.expenses.find(
          (item) => item.id === button.dataset.editExpense,
        );
        if (!expense) return;
        openExpense(expense, (updated) => {
          Object.assign(expense, updated);
          save();
          render();
          toast("Despesa atualizada.");
        });
      }),
    );
    els("[data-delete-expense]").forEach((button) =>
      button.addEventListener("click", () => {
        const expense = state.expenses.find(
          (item) => item.id === button.dataset.deleteExpense,
        );
        if (!expense) return;
        openAIChatDialog({
          title: "Apagar despesa",
          message: `Deseja apagar o grupo ${expense.label}?`,
          confirmLabel: "Sim",
          danger: true,
        }).then((confirmed) => {
          if (!confirmed) return;
          state.expenses = state.expenses.filter(
            (item) => item.id !== expense.id,
          );
          save();
          render();
          toast("Despesa removida.");
        });
      }),
    );
    els("[data-delete-expense-group]").forEach((button) =>
      button.addEventListener("click", () => {
        const group = button.dataset.deleteExpenseGroup;
        const amount = state.expenses.filter(
          (expense) => (expense.group || expense.label) === group,
        ).length;
        openAIChatDialog({
          title: "Apagar grupo",
          message: amount
            ? `Deseja apagar o grupo ${group} e suas ${amount} despesa(s)?`
            : `Deseja apagar o grupo ${group}?`,
          confirmLabel: "Sim",
          danger: true,
        }).then((confirmed) => {
          if (!confirmed) return;
          state.expenseGroups = state.expenseGroups.filter(
            (item) => item !== group,
          );
          state.expenses = state.expenses.filter(
            (expense) => (expense.group || expense.label) !== group,
          );
          save();
          render();
          toast("Grupo removido.");
        });
      }),
    );
  };
  render();
}
function financeiro() {
  const content = el("#page-content");
  const values = totals();
  const profit = values.profit;
  const metrics = financialMetrics(values);
  const chartData = financialChartData();
  const chartMax = Math.max(
    1,
    ...chartData.map((item) => Math.abs(item.value)),
  );
  content.innerHTML = `<section class="grid stats-grid"><article class="card stat-card"><div class="stat-head"><span>Receita</span><span class="positive">●</span></div><strong class="stat-value">${money(values.revenue)}</strong><span class="trend">+12,5% vs. período anterior</span></article><article class="card stat-card"><div class="stat-head"><span>Despesas</span><span class="stat-icon">↓</span></div><strong class="stat-value">${money(values.expenses)}</strong><span class="trend warn">+5,2% vs. período anterior</span></article><article class="card stat-card"><div class="stat-head"><span>Lucro líquido</span><span class="positive">↗</span></div><strong class="stat-value">${money(profit)}</strong><span class="trend">Margem de ${values.revenue ? Math.round((profit / values.revenue) * 100) : 0}%</span></article><article class="card stat-card"><div class="stat-head"><span>Fluxo de caixa</span><span class="stat-icon">⌁</span></div><strong class="stat-value positive">Positivo</strong><span class="subtext">Saldo operacional saudável</span></article></section><section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Evolução financeira</h2><p>Receitas e despesas por período</p></div></div><div class="bar-chart">${[58, 73, 65, 82, 76, 94, 88].map((height, index) => `<div class="bar-item"><div class="bar" style="height:${height}%"></div><span>${["Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"][index]}</span></div>`).join("")}</div></article><article class="card"><div class="section-title"><h2>Gastos por categoria</h2></div>${state.expenses.map((item) => `<div class="metric-row"><span>${escapeHTML(item.label)}</span><strong>${money(item.value)}</strong></div>`).join("")}<div class="callout" style="margin-top:18px"><strong>Despesas aumentaram 18% neste período.</strong><p>Categoria com maior gasto: Operacional.</p></div></article></section><section class="card" style="margin-top:18px"><div class="section-title"><h2>Leitura do período</h2><span class="status">Resultado líquido positivo</span></div><p class="muted">O negócio gerou ${money(profit)} após despesas. Acompanhe a categoria Operacional e mantenha o fluxo de caixa positivo para preservar essa margem.</p></section>`;
  syncFinanceiroView(content);
}

function financialChartData(period = "30d") {
  const data = lineData(period).slice(-7);
  const values = totals();
  const fixedCosts = values.costOfSales + values.expenses;
  return data.map((item) => ({
    ...item,
    value: item.value - fixedCosts / Math.max(1, data.length),
  }));
}

function syncFinanceiroView(content) {
  const values = totals();
  const metrics = financialMetrics(values);
  const chartHeading = el(".bar-chart", content)
    ?.closest("article")
    ?.querySelector("h2");
  const chartSubtitle = el(".bar-chart", content)
    ?.closest("article")
    ?.querySelector("p");
  if (chartHeading) chartHeading.textContent = "Resultado líquido por período";
  if (chartSubtitle)
    chartSubtitle.textContent =
      "Vendas do dia menos custos e despesas rateadas";
  const cards = els(".stat-card", content);
  const cardLabels = [
    "Receita bruta",
    "Despesas totais",
    "Resultado líquido",
    "Fluxo de caixa",
  ];
  cards.forEach((card, index) => {
    const label = el(".stat-head span", card);
    if (label && cardLabels[index]) label.textContent = cardLabels[index];
  });
  const trends = els(".stat-card .trend", content);
  const flowValue = el(".stat-card:nth-child(4) .stat-value", content);
  if (trends[0]) trends[0].textContent = "Base atual";
  if (trends[1]) {
    trends[1].textContent = `${signedPercentage(metrics.netMargin)} resultado líquido`;
    trends[1].className = `trend ${resultClass(metrics.netMargin)}`;
  }
  if (trends[2]) {
    trends[2].textContent = `Margem de ${signedPercentage(metrics.netMargin)}`;
    trends[2].className = `trend ${resultClass(metrics.netMargin)}`;
  }
  if (flowValue) {
    flowValue.textContent = values.profit >= 0 ? "Positivo" : "Negativo";
    flowValue.className = `stat-value ${resultClass(values.profit)}`;
  }
  const flowDescription = el(".stat-card:nth-child(4) .subtext", content);
  if (flowDescription)
    flowDescription.textContent =
      values.profit >= 0
        ? "Saldo operacional saudável"
        : "Receita insuficiente para cobrir custos e despesas";
  const chartData = financialChartData();
  const chartMax = Math.max(
    1,
    ...chartData.map((item) => Math.abs(item.value)),
  );
  const chart = el(".bar-chart", content);
  const chartCard = chart?.closest("article");
  if (chartCard && !el(".financial-chart-legend", chartCard)) {
    chart.insertAdjacentHTML(
      "beforebegin",
      '<div class="financial-chart-legend"><span><i class="legend-positive"></i>Resultado positivo</span><span><i class="legend-negative"></i>Resultado negativo</span><small>As barras mostram o resultado líquido diário.</small></div>',
    );
  }
  if (chart && !el(".bar-axis-labels", chart)) {
    chart.insertAdjacentHTML(
      "afterbegin",
      '<div class="bar-axis-labels" aria-hidden="true"><span data-axis="positive-max"></span><span data-axis="positive-mid"></span><span data-axis="zero">R$ 0</span><span data-axis="negative-mid"></span><span data-axis="negative-max"></span></div>',
    );
  }
  const axisLabels = {
    positiveMax: el('[data-axis="positive-max"]', chart),
    positiveMid: el('[data-axis="positive-mid"]', chart),
    zero: el('[data-axis="zero"]', chart),
    negativeMid: el('[data-axis="negative-mid"]', chart),
    negativeMax: el('[data-axis="negative-max"]', chart),
  };
  if (axisLabels.positiveMax)
    axisLabels.positiveMax.textContent = money(chartMax);
  if (axisLabels.positiveMid)
    axisLabels.positiveMid.textContent = money(chartMax / 2);
  if (axisLabels.zero) axisLabels.zero.textContent = "R$ 0";
  if (axisLabels.negativeMid)
    axisLabels.negativeMid.textContent = `-${money(chartMax / 2).replace("-", "")}`;
  if (axisLabels.negativeMax)
    axisLabels.negativeMax.textContent = `-${money(chartMax).replace("-", "")}`;
  els(".bar-item", content).forEach((item, index) => {
    const data = chartData[index];
    if (!data) return;
    const bar = el(".bar", item);
    bar.style.height = `${Math.max(4, (Math.abs(data.value) / chartMax) * 50)}%`;
    bar.classList.toggle("negative", data.value < 0);
    item.classList.toggle("negative", data.value < 0);
    bar.title = `${data.label}: ${money(data.value)}`;
    el("span", item).textContent = data.label;
    let tooltip = el(".bar-tooltip", item);
    if (!tooltip) {
      item.insertAdjacentHTML("beforeend", '<span class="bar-tooltip"></span>');
      tooltip = el(".bar-tooltip", item);
    }
    tooltip.innerHTML = `<strong>${escapeHTML(data.label)}</strong><span class="${resultClass(data.value)}">${money(data.value)}</span>`;
  });
  const callout = el(".callout", content);
  if (callout) {
    el("strong", callout).textContent =
      `${metrics.expenseRate.toFixed(1).replace(".", ",")}% da receita está comprometida com despesas.`;
    el("p", callout).textContent =
      `Lucro líquido calculado: ${money(values.profit)}.`;
  }
  const readingStatus = el(".card:last-child .status", content);
  const readingText = el(".card:last-child .muted", content);
  if (readingStatus) {
    readingStatus.textContent =
      values.profit >= 0
        ? "Resultado líquido positivo"
        : "Resultado líquido negativo";
    readingStatus.className = `status ${resultClass(values.profit)}`;
  }
  if (readingText)
    readingText.textContent =
      values.profit >= 0
        ? `O negócio gerou ${money(values.profit)} após custos e despesas. Acompanhe a evolução para preservar essa margem.`
        : `O negócio teve resultado negativo de ${money(Math.abs(values.profit))}. Revise custos e despesas para recuperar a margem.`;
  cards.forEach((card) =>
    card.classList.toggle("negative-result", values.profit < 0),
  );
}
function relatorios() {
  const content = el("#page-content");
  content.innerHTML = `<article class="card"><div class="section-title"><div><h2>Gerador de relatórios</h2><p>Monte uma visão profissional dos seus dados.</p></div></div><div class="form-grid"><label>Tipo de relatório<select id="reportType"><option>Desempenho geral</option><option>Financeiro</option><option>Estoque</option><option>Vendas</option></select></label><label>Período<select id="reportPeriod"><option>01/09/2026 — 30/09/2026</option><option>Últimos 7 dias</option><option>Últimos 3 meses</option></select></label></div><div class="form-actions"><button class="btn btn-primary" id="generateReport">Gerar relatório</button></div></article><div id="reportResult" style="margin-top:18px"></div>`;
  el("#generateReport").addEventListener("click", () => {
    const values = totals();
    const profit = values.profit;
    el("#reportResult").innerHTML =
      `<article class="report-paper"><span class="eyebrow">Relatório de ${el("#reportType").value}</span><h2>RELATÓRIO DE DESEMPENHO</h2><p>Período: ${el("#reportPeriod").value}</p><div class="grid three-col" style="margin:25px 0"><div class="card"><small>Receita total</small><h3>${money(values.revenue)}</h3></div><div class="card"><small>Despesas</small><h3>${money(values.expenses)}</h3></div><div class="card"><small>Lucro líquido</small><h3>${money(profit)}</h3></div></div><div class="grid two-col"><div class="card"><h3>Resultado líquido por período</h3><div class="report-bars"></div></div><div class="card"><h3>Resumo operacional</h3><div class="metric-row"><span>Vendas realizadas</span><strong>${values.sales}</strong></div><div class="metric-row"><span>Produtos em estoque</span><strong>${values.stock}</strong></div><div class="metric-row"><span>Itens em estoque baixo</span><strong>${values.low}</strong></div></div></div><div style="margin-top:22px"><h3>Observações e conclusões</h3><p>O resultado líquido é ${profit >= 0 ? "positivo" : "negativo"}. A operação deve priorizar o acompanhamento de produtos com estoque baixo e da categoria com maior despesa para preservar a rentabilidade.</p></div></article>`;
    addNotification(
      "Relatório concluído",
      `Relatório de ${el("#reportType").value} gerado com sucesso.`,
      "report",
    );
  });
  el("#generateReport").addEventListener("click", () =>
    window.setTimeout(() => syncReportView(el("#reportPeriod").value), 0),
  );
}

function syncReportView(selectedPeriod = "01/09/2026 — 30/09/2026") {
  const report = el(".report-paper");
  if (!report) return;
  const values = totals();
  const metrics = financialMetrics(values);
  const reportPeriod = selectedPeriod.includes("7 dias")
    ? "7d"
    : selectedPeriod.includes("3 meses")
      ? "3m"
      : "30d";
  const profit = el(".metric-row strong", report);
  if (profit) {
    const rows = els(".metric-row", report);
    const profitRow = rows.find((row) =>
      row.textContent.includes("Lucro líquido"),
    );
    const profitValue = profitRow && el("strong", profitRow);
    if (profitValue) {
      profitValue.textContent = money(values.profit);
      profitValue.className = resultClass(values.profit);
    }
  }
  const bars = financialChartData(reportPeriod);
  const max = Math.max(1, ...bars.map((item) => Math.abs(item.value)));
  const barsContainer = el(".report-bars", report);
  const reportChartTitle = el(".report-bars", report)
    ?.closest(".card")
    ?.querySelector("h3");
  if (reportChartTitle)
    reportChartTitle.textContent = "Resultado líquido por período";
  if (barsContainer) {
    barsContainer.innerHTML = bars
      .map(
        (item) =>
          `<i class="${item.value < 0 ? "negative" : ""}" style="--height:${Math.max(4, (Math.abs(item.value) / max) * 100)}%" title="${escapeHTML(item.label)}: ${money(item.value)}"></i>`,
      )
      .join("");
  }
  const summary = el(".grid.three-col", report);
  if (summary && !summary.querySelector('[data-report="costs"]')) {
    summary.insertAdjacentHTML(
      "beforeend",
      `<div class="card"><small>Custos das vendas</small><h3 data-report="costs">${money(values.costOfSales)}</h3></div>`,
    );
  }
  const costValue = el('[data-report="costs"]', report);
  if (costValue) costValue.textContent = money(values.costOfSales);
  const reportProfit = [...report.querySelectorAll(".card h3")].find(
    (heading) =>
      heading.textContent.includes("R$") &&
      heading.closest(".card")?.textContent.includes("Lucro líquido"),
  );
  if (reportProfit) {
    reportProfit.textContent = money(values.profit);
    reportProfit.className = resultClass(values.profit);
  }
  const observation = [...report.querySelectorAll("p")].find((item) =>
    item.textContent.includes("resultado líquido"),
  );
  if (observation)
    observation.textContent = `${values.profit >= 0 ? "O resultado líquido está positivo" : "O resultado líquido está negativo"}, com margem de ${signedPercentage(metrics.netMargin)}.`;
}
function setAIStatus(working) {
  const status = el("[data-ai-status]");
  if (!status) return;
  status.classList.toggle("offline", !working);
  const label = el("[data-ai-status-label]", status);
  if (label) label.textContent = working ? "Funcionando" : "Indisponível";
}

function calendario() {
  const content = el("#page-content");
  const storageKey = "contaiCalendarData";
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  const palette = [
    "#62e5ff",
    "#5de0b0",
    "#ffd166",
    "#ff9f5a",
    "#ff718e",
    "#a68cff",
    "#f28fca",
    "#7de3e8",
    "#9badbd",
  ];
  const today = new Date();
  let viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
  let selectedDate = new Date(today);
  let openPopover = false;
  let clickTimer;
  let activePicker;
  const defaultEvents = [
    {
      id: "seed-cashflow",
      title: "Revisão do fluxo de caixa",
      date: "2026-09-03",
      start: "09:00",
      end: "10:00",
      description: "Acompanhar receitas e despesas da semana.",
      location: "Escritório",
      category: "Financeiro",
      color: palette[0],
      reminder: "15",
    },
    {
      id: "seed-stock",
      title: "Inventário do estoque",
      date: "2026-09-08",
      start: "14:30",
      end: "15:30",
      description: "Conferência dos itens críticos.",
      location: "Depósito",
      category: "Operação",
      color: palette[1],
      reminder: "60",
    },
    {
      id: "seed-supplier",
      title: "Reunião com fornecedor",
      date: "2026-09-15",
      start: "10:00",
      end: "11:00",
      description: "Alinhar prazo e condições da próxima entrega.",
      location: "Videochamada",
      category: "Compras",
      color: palette[5],
      reminder: "1440",
    },
    {
      id: "seed-closing",
      title: "Fechamento mensal",
      date: "2026-09-22",
      start: "16:00",
      end: "17:00",
      description: "Consolidar resultados do mês.",
      location: "Escritório",
      category: "Relatórios",
      color: palette[3],
      reminder: "15",
    },
  ];
  let data = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || {};
    } catch {
      return {};
    }
  })();
  let events = Array.isArray(data.events) ? data.events : defaultEvents;
  let dayStyles =
    data.dayStyles && typeof data.dayStyles === "object" ? data.dayStyles : {};
  const dateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const parseDate = (key) => new Date(`${key}T12:00:00`);
  const formatDate = (date) =>
    date.toLocaleDateString("pt-BR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  const safeColor = (color, fallback = palette[0]) =>
    /^#[0-9a-f]{6}$/i.test(color || "") ? color : fallback;
  const initials = (title) =>
    title
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "•";
  const saveCalendar = () =>
    localStorage.setItem(storageKey, JSON.stringify({ events, dayStyles }));
  const dayEvents = (key) =>
    events
      .filter((event) => event.date === key)
      .sort((a, b) => (a.start || "").localeCompare(b.start || ""));
  const reminderText = (minutes) => {
    if (minutes % 1440 === 0)
      return `${minutes / 1440} dia${minutes / 1440 === 1 ? "" : "s"}`;
    if (minutes % 60 === 0)
      return `${minutes / 60} hora${minutes / 60 === 1 ? "" : "s"}`;
    return `${minutes} minuto${minutes === 1 ? "" : "s"}`;
  };
  const checkEventReminders = () => {
    const now = Date.now();
    events.forEach((event) => {
      if (!event.start) return;
      const eventTime = new Date(`${event.date}T${event.start}:00`).getTime();
      if (!Number.isFinite(eventTime) || eventTime <= now) return;
      const reminders = Array.isArray(event.reminders)
        ? event.reminders
        : event.reminder && event.reminder !== "0"
          ? [Number(event.reminder)]
          : [];
      reminders.forEach((minutes) => {
        const value = Number(minutes);
        if (!Number.isFinite(value) || now < eventTime - value * 60000) return;
        const notificationKey = `calendar-reminder-${event.id}-${value}-${event.date}`;
        if (
          (state.notifications || []).some(
            (item) => item.notificationKey === notificationKey,
          )
        )
          return;
        addNotification(
          "Evento se aproximando",
          `${event.title} começa em ${reminderText(value)} (${event.start}).`,
          "calendar-event-reminder",
          { notificationKey },
        );
      });
    });
  };
  const closeModal = () => {
    el("[data-calendar-modal]")?.remove();
  };
  const closePopover = () => {
    openPopover = false;
    activePicker?.remove();
    activePicker = null;
  };
  const renderPalette = (selected) =>
    palette
      .map(
        (color) =>
          `<button class="calendar-color-swatch ${color === selected ? "is-active" : ""}" style="--swatch:${color}" type="button" data-color="${color}" aria-label="Selecionar cor ${color}"></button>`,
      )
      .join("");
  const renderLegend = () => {
    const dayLegend = Object.entries(dayStyles)
      .filter(([, value]) => value.meaning)
      .map(
        ([key, value]) =>
          `<span><i style="--legend:${safeColor(value.color)}"></i>${escapeHTML(value.meaning)} <small>${parseDate(key).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}</small></span>`,
      );
    const eventLegend = [
      ...new Map(events.map((event) => [event.category, event])).values(),
    ]
      .slice(0, 6)
      .map(
        (event) =>
          `<span><i style="--legend:${safeColor(event.color)}"></i>${escapeHTML(event.category || "Evento")}</span>`,
      );
    return (
      [...dayLegend, ...eventLegend].join("") ||
      `<span class="muted">As cores dos eventos e dos dias personalizados aparecerão aqui.</span>`
    );
  };
  const openEventModal = (event = {}) => {
    closeModal();
    const isEditing = Boolean(event.id);
    const date = event.date || dateKey(selectedDate);
    const modal = document.createElement("div");
    modal.className = "calendar-modal-backdrop";
    modal.dataset.calendarModal = "true";
    modal.innerHTML = `<form class="calendar-modal card" data-calendar-form><div class="modal-header"><div><span class="eyebrow">${isEditing ? "Editar evento" : "Novo evento"}</span><h2>${isEditing ? escapeHTML(event.title) : "Adicionar compromisso"}</h2></div><button class="close-btn" type="button" data-calendar-close aria-label="Fechar">×</button></div><div class="form-grid"><label class="full">Título<input name="title" required maxlength="80" value="${escapeHTML(event.title || "")}" placeholder="Ex.: Reunião com cliente" /></label><label>Data<input name="date" type="date" required value="${date}" /></label><label>Categoria<select name="category"><option ${event.category === "Financeiro" ? "selected" : ""}>Financeiro</option><option ${event.category === "Operação" ? "selected" : ""}>Operação</option><option ${event.category === "Compras" ? "selected" : ""}>Compras</option><option ${event.category === "Pessoal" ? "selected" : ""}>Pessoal</option><option ${event.category === "Outro" ? "selected" : ""}>Outro</option></select></label><label>Início<input name="start" type="time" required value="${event.start || "09:00"}" /></label><label>Fim<input name="end" type="time" value="${event.end || "10:00"}" /></label><label class="full">Local<input name="location" maxlength="80" value="${escapeHTML(event.location || "")}" placeholder="Ex.: Sala de reunião" /></label><label class="full">Descrição<textarea name="description" rows="3" maxlength="300" placeholder="Inclua detalhes importantes">${escapeHTML(event.description || "")}</textarea></label><label>Lembrete<select name="reminder"><option value="0" ${event.reminder === "0" ? "selected" : ""}>Sem lembrete</option><option value="15" ${event.reminder === "15" || !event.reminder ? "selected" : ""}>15 minutos antes</option><option value="60" ${event.reminder === "60" ? "selected" : ""}>1 hora antes</option><option value="1440" ${event.reminder === "1440" ? "selected" : ""}>1 dia antes</option></select></label><div class="calendar-form-field"><span>Cor do evento</span><div class="calendar-palette" data-event-palette>${renderPalette(safeColor(event.color, palette[0]))}</div><input name="color" type="color" value="${safeColor(event.color, palette[0])}" aria-label="Cor personalizada" /></div></div><div class="form-actions"><button class="btn" type="button" data-calendar-close>Cancelar</button>${isEditing ? `<button class="btn btn-danger" type="button" data-calendar-delete>Excluir</button>` : ""}<button class="btn btn-primary" type="submit">${isEditing ? "Salvar alterações" : "Criar evento"}</button></div></form>`;
    document.body.append(modal);
    const form = modal.querySelector("form");
    const reminderSelect = form.elements.reminder;
    const legacyReminder =
      event.reminder && event.reminder !== "0" ? Number(event.reminder) : 0;
    let reminders = Array.isArray(event.reminders)
      ? [...event.reminders]
      : legacyReminder
        ? [legacyReminder]
        : [];
    const reminderLabels = {
      1440: "1 dia antes",
      60: "1 hora antes",
      15: "15 minutos antes",
    };
    const reminderField = reminderSelect?.closest("label");
    reminderField?.setAttribute("hidden", "");
    reminderField?.insertAdjacentHTML(
      "afterend",
      `<div class="calendar-reminders-field full"><div class="calendar-reminders-heading"><span>Lembretes</span><small>Você pode adicionar mais de um.</small></div><div class="calendar-reminder-quick"><label><input type="checkbox" value="1440" data-quick-reminder /> 1 dia antes</label><label><input type="checkbox" value="60" data-quick-reminder /> 1 hora antes</label><label><input type="checkbox" value="15" data-quick-reminder /> 15 minutos antes</label></div><div class="calendar-custom-reminders" data-custom-reminders></div><button class="btn btn-small" type="button" data-add-reminder>+ Adicionar personalizado</button></div>`,
    );
    const customReminderValues = reminders.filter(
      (value) => !reminderLabels[value],
    );
    const reminderOptions = modal.querySelectorAll("[data-quick-reminder]");
    reminderOptions.forEach((input) => {
      input.checked = reminders.includes(Number(input.value));
    });
    const customReminders = modal.querySelector("[data-custom-reminders]");
    const renderCustomReminders = () => {
      customReminders.innerHTML = customReminderValues
        .map((value, index) => {
          const amount = Math.max(
            1,
            Math.round(
              Number(value) / (value >= 1440 ? 1440 : value >= 60 ? 60 : 1),
            ),
          );
          const unit =
            value >= 1440 ? "days" : value >= 60 ? "hours" : "minutes";
          return `<div class="calendar-custom-reminder" data-custom-reminder><input type="number" min="1" max="999" value="${amount}" data-reminder-amount aria-label="Quantidade do lembrete" /><select data-reminder-unit aria-label="Unidade do lembrete"><option value="minutes" ${unit === "minutes" ? "selected" : ""}>minutos</option><option value="hours" ${unit === "hours" ? "selected" : ""}>horas</option><option value="days" ${unit === "days" ? "selected" : ""}>dias</option></select><span>antes</span><button class="btn btn-small btn-danger" type="button" data-remove-reminder aria-label="Remover lembrete">×</button></div>`;
        })
        .join("");
    };
    renderCustomReminders();
    modal.querySelector("[data-add-reminder]").addEventListener("click", () => {
      customReminderValues.push(30);
      renderCustomReminders();
    });
    customReminders.addEventListener("click", (clickEvent) => {
      if (!clickEvent.target.closest("[data-remove-reminder]")) return;
      const row = clickEvent.target.closest("[data-custom-reminder]");
      const index = [...customReminders.children].indexOf(row);
      customReminderValues.splice(index, 1);
      renderCustomReminders();
    });
    const colorInput = form.elements.color;
    modal.querySelectorAll("[data-color]").forEach((button) =>
      button.addEventListener("click", () => {
        colorInput.value = button.dataset.color;
        modal
          .querySelectorAll("[data-color]")
          .forEach((item) =>
            item.classList.toggle("is-active", item === button),
          );
      }),
    );
    modal
      .querySelectorAll("[data-calendar-close]")
      .forEach((button) => button.addEventListener("click", closeModal));
    form.addEventListener("submit", (submitEvent) => {
      submitEvent.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      const quickReminders = [...reminderOptions]
        .filter((input) => input.checked)
        .map((input) => Number(input.value));
      const customValues = [
        ...customReminders.querySelectorAll("[data-custom-reminder]"),
      ].map((row) => {
        const amount = Math.max(
          1,
          Number(row.querySelector("[data-reminder-amount]").value) || 1,
        );
        const unit = row.querySelector("[data-reminder-unit]").value;
        return amount * (unit === "days" ? 1440 : unit === "hours" ? 60 : 1);
      });
      const updated = {
        ...event,
        ...values,
        id: event.id || `event-${Date.now()}`,
        color: safeColor(values.color),
        reminders: [...new Set([...quickReminders, ...customValues])].sort(
          (a, b) => a - b,
        ),
        reminder:
          [...new Set([...quickReminders, ...customValues])].sort(
            (a, b) => a - b,
          )[0] || "0",
      };
      events = event.id
        ? events.map((item) => (item.id === event.id ? updated : item))
        : [...events, updated];
      selectedDate = parseDate(values.date);
      viewDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1,
      );
      saveCalendar();
      if (!event.id) {
        const eventDate = parseDate(values.date).toLocaleDateString("pt-BR");
        addNotification(
          "Novo evento no calendário",
          `${values.title} foi criado para ${eventDate}${values.start ? ` às ${values.start}` : ""}.`,
          "calendar-event",
        );
      }
      closeModal();
      render();
      toast(event.id ? "Evento atualizado." : "Evento criado.");
    });
    modal
      .querySelector("[data-calendar-delete]")
      ?.addEventListener("click", () => {
        if (!window.confirm("Excluir este evento?")) return;
        events = events.filter((item) => item.id !== event.id);
        saveCalendar();
        closeModal();
        render();
        toast("Evento excluído.");
      });
  };
  const openDayModal = () => {
    const key = dateKey(selectedDate);
    const current = dayStyles[key] || { color: "#31516a", meaning: "" };
    closeModal();
    const modal = document.createElement("div");
    modal.className = "calendar-modal-backdrop";
    modal.dataset.calendarModal = "true";
    modal.innerHTML = `<form class="calendar-modal card" data-day-form><div class="modal-header"><div><span class="eyebrow">Personalização</span><h2>${formatDate(selectedDate)}</h2></div><button class="close-btn" type="button" data-calendar-close aria-label="Fechar">×</button></div><p class="muted">Defina uma cor e um significado para este dia. Isso é independente das cores dos eventos.</p><div class="calendar-day-custom-preview" style="--day-preview:${safeColor(current.color, "#31516a")}"><strong>${selectedDate.getDate()}</strong><span>Pré-visualização do destaque</span></div><div class="calendar-form-field"><span>Cor do dia</span><div class="calendar-palette" data-day-palette>${renderPalette(safeColor(current.color, palette[0]))}</div><input name="color" type="color" value="${safeColor(current.color, palette[0])}" aria-label="Cor personalizada do dia" /></div><label>Significado ou legenda<input name="meaning" maxlength="60" value="${escapeHTML(current.meaning || "")}" placeholder="Ex.: Prazo importante" /></label><div class="form-actions"><button class="btn btn-danger" type="button" data-clear-day>Limpar destaque</button><button class="btn" type="button" data-calendar-close>Cancelar</button><button class="btn btn-primary" type="submit">Salvar dia</button></div></form>`;
    document.body.append(modal);
    const form = modal.querySelector("form");
    const colorInput = form.elements.color;
    modal.querySelectorAll("[data-color]").forEach((button) =>
      button.addEventListener("click", () => {
        colorInput.value = button.dataset.color;
        modal
          .querySelectorAll("[data-color]")
          .forEach((item) =>
            item.classList.toggle("is-active", item === button),
          );
        modal
          .querySelector(".calendar-day-custom-preview")
          .style.setProperty("--day-preview", button.dataset.color);
      }),
    );
    modal
      .querySelectorAll("[data-calendar-close]")
      .forEach((button) => button.addEventListener("click", closeModal));
    modal.querySelector("[data-clear-day]").addEventListener("click", () => {
      delete dayStyles[key];
      saveCalendar();
      closeModal();
      render();
      toast("Destaque do dia removido.");
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(form));
      dayStyles[key] = {
        color: safeColor(values.color),
        meaning: values.meaning.trim(),
      };
      saveCalendar();
      closeModal();
      render();
      toast("Personalização do dia salva.");
    });
  };
  const openPicker = () => {
    closePopover();
    openPopover = true;
    const picker = document.createElement("div");
    picker.className = "calendar-picker";
    picker.dataset.calendarPicker = "true";
    const year = viewDate.getFullYear();
    picker.innerHTML = `<div class="calendar-picker-heading"><strong>Escolher período</strong><button class="close-btn" type="button" data-picker-close aria-label="Fechar">×</button></div><span class="calendar-picker-label">Mês</span><div class="calendar-month-options">${monthNames.map((month, index) => `<button class="btn ${index === viewDate.getMonth() ? "active" : ""}" type="button" data-picker-month="${index}">${month}</button>`).join("")}</div><div class="calendar-picker-year"><span class="calendar-picker-label">Ano</span><div class="calendar-year-controls"><button class="btn" type="button" data-year-step="-1">−</button><input type="number" min="1900" max="2200" value="${year}" aria-label="Ano" /><button class="btn" type="button" data-year-step="1">+</button></div><div class="calendar-year-options">${[-2, -1, 0, 1, 2].map((offset) => `<button class="btn ${offset === 0 ? "active" : ""}" type="button" data-picker-year="${year + offset}">${year + offset}</button>`).join("")}</div></div>`;
    document.body.append(picker);
    activePicker = picker;
    const trigger = content.querySelector("[data-calendar-picker]");
    const mainBounds = document.querySelector(".main").getBoundingClientRect();
    const triggerBounds = trigger.getBoundingClientRect();
    const pickerBounds = picker.getBoundingClientRect();
    const minimumLeft = mainBounds.left + 12;
    const maximumLeft = Math.max(
      minimumLeft,
      mainBounds.right - pickerBounds.width - 12,
    );
    const left = Math.min(
      Math.max(triggerBounds.left, minimumLeft),
      maximumLeft,
    );
    const below = triggerBounds.bottom + 10;
    const above = triggerBounds.top - pickerBounds.height - 10;
    const fitsBelow = below + pickerBounds.height <= window.innerHeight - 12;
    const fitsAbove = above >= 12;
    const top = fitsBelow
      ? below
      : fitsAbove
        ? above
        : Math.max(12, window.innerHeight - pickerBounds.height - 12);
    picker.style.left = `${left}px`;
    picker.style.top = `${Math.max(12, top)}px`;
    picker
      .querySelector("[data-picker-close]")
      .addEventListener("click", closePopover);
    picker.querySelectorAll("[data-picker-month]").forEach((button) =>
      button.addEventListener("click", () => {
        viewDate.setMonth(Number(button.dataset.pickerMonth));
        closePopover();
        render();
      }),
    );
    picker.querySelectorAll("[data-picker-year]").forEach((button) =>
      button.addEventListener("click", () => {
        viewDate.setFullYear(Number(button.dataset.pickerYear));
        closePopover();
        render();
      }),
    );
    const yearInput = picker.querySelector("input");
    yearInput.addEventListener("change", () => {
      const nextYear = Math.min(
        2200,
        Math.max(1900, Number(yearInput.value) || year),
      );
      viewDate.setFullYear(nextYear);
      closePopover();
      render();
    });
    picker.querySelectorAll("[data-year-step]").forEach((button) =>
      button.addEventListener("click", () => {
        viewDate.setFullYear(
          viewDate.getFullYear() + Number(button.dataset.yearStep),
        );
        closePopover();
        render();
      }),
    );
  };
  const render = () => {
    closePopover();
    const firstDay =
      (new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay() + 6) %
      7;
    const daysInMonth = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth() + 1,
      0,
    ).getDate();
    const cells = [];
    for (let index = 0; index < firstDay; index += 1)
      cells.push(
        `<span class="calendar-day is-empty" aria-hidden="true"></span>`,
      );
    for (let day = 1; day <= daysInMonth; day += 1) {
      const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
      const key = dateKey(date);
      const items = dayEvents(key);
      const custom = dayStyles[key];
      const classes = [
        "calendar-day",
        key === dateKey(today) ? "is-today" : "",
        key === dateKey(selectedDate) ? "is-selected" : "",
        items.length ? "has-events" : "",
      ]
        .filter(Boolean)
        .join(" ");
      const previews = items
        .slice(0, 3)
        .map(
          (event) =>
            `<button class="calendar-event-chip" style="--event-color:${safeColor(event.color)}" type="button" data-calendar-event="${event.id}" title="${escapeHTML(event.title)}"><i>${escapeHTML(initials(event.title))}</i><span>${escapeHTML(event.title)}</span><small>${event.start || ""}</small></button>`,
        )
        .join("");
      const more =
        items.length > 3
          ? `<button class="calendar-more" type="button" data-calendar-more="${key}">+${items.length - 3} eventos</button>`
          : "";
      cells.push(
        `<div class="${classes}" style="${custom ? `--day-accent:${safeColor(custom.color)}` : ""}" role="button" tabindex="0" data-calendar-date="${key}"><strong>${day}</strong><div class="calendar-events-preview">${previews}${more}</div></div>`,
      );
    }
    const selectedKey = dateKey(selectedDate);
    const selectedEvents = dayEvents(selectedKey);
    const dayStyle = dayStyles[selectedKey];
    content.innerHTML = `<section class="calendar-layout"><article class="card calendar-card"><div class="calendar-toolbar"><div><span class="eyebrow">Agenda empresarial</span><button class="calendar-period-button" type="button" data-calendar-picker aria-expanded="false"><h2>${monthNames[viewDate.getMonth()]} ${viewDate.getFullYear()}</h2><span>⌄</span></button></div><div class="calendar-actions"><button class="btn" type="button" data-calendar-prev aria-label="Mês anterior">‹</button><button class="btn" type="button" data-calendar-today>Hoje</button><button class="btn" type="button" data-calendar-next aria-label="Próximo mês">›</button></div></div><div class="calendar-weekdays">${weekDays.map((day) => `<span>${day}</span>`).join("")}</div><div class="calendar-grid">${cells.join("")}</div><div class="calendar-legend"><strong>Legenda</strong><div>${renderLegend()}</div></div></article><aside class="card calendar-agenda"><div class="section-title"><div><span class="eyebrow">Dia selecionado</span><h2>${formatDate(selectedDate)}</h2><p>${selectedEvents.length ? `${selectedEvents.length} evento${selectedEvents.length > 1 ? "s" : ""}` : "Agenda livre"}</p></div><span class="status">${selectedEvents.length ? "Planejado" : "Disponível"}</span></div><div class="calendar-agenda-actions"><button class="btn btn-primary" type="button" data-add-event>+ Adicionar evento</button><button class="btn" type="button" data-customize-day>Personalizar dia</button></div>${selectedEvents.length ? selectedEvents.map((event) => `<button class="calendar-agenda-event" style="--event-color:${safeColor(event.color)}" type="button" data-calendar-event="${event.id}"><strong>${event.start || "--:--"}</strong><span><b>${escapeHTML(event.title)}</b><small>${escapeHTML(event.category || "Evento")}${event.location ? ` · ${escapeHTML(event.location)}` : ""}</small></span><i>›</i></button>`).join("") : `<div class="calendar-empty"><span>○</span><p>Nenhum evento para este dia.</p><button class="btn" type="button" data-add-event>Criar primeiro evento</button></div>`}${dayStyle?.meaning ? `<p class="calendar-day-note" style="--note-color:${safeColor(dayStyle.color)}"><i></i>${escapeHTML(dayStyle.meaning)}</p>` : ""}</aside></section>`;
    content
      .querySelector("[data-calendar-prev]")
      .addEventListener("click", () => {
        viewDate.setMonth(viewDate.getMonth() - 1);
        render();
      });
    content
      .querySelector("[data-calendar-next]")
      .addEventListener("click", () => {
        viewDate.setMonth(viewDate.getMonth() + 1);
        render();
      });
    content
      .querySelector("[data-calendar-today]")
      .addEventListener("click", () => {
        viewDate = new Date(today.getFullYear(), today.getMonth(), 1);
        selectedDate = new Date(today);
        render();
      });
    content
      .querySelector("[data-calendar-picker]")
      .addEventListener("click", openPicker);
    content
      .querySelector("[data-add-event]")
      ?.addEventListener("click", () => openEventModal());
    content
      .querySelector("[data-customize-day]")
      .addEventListener("click", openDayModal);
    content.querySelectorAll("[data-calendar-date]").forEach((day) => {
      const select = () => {
        selectedDate = parseDate(day.dataset.calendarDate);
        render();
      };
      day.addEventListener("click", (event) => {
        if (event.target.closest("[data-calendar-event], [data-calendar-more]"))
          return;
        window.clearTimeout(clickTimer);
        clickTimer = window.setTimeout(select, 220);
      });
      day.addEventListener("dblclick", (event) => {
        if (event.target.closest("[data-calendar-event], [data-calendar-more]"))
          return;
        event.preventDefault();
        window.clearTimeout(clickTimer);
        selectedDate = parseDate(day.dataset.calendarDate);
        render();
        openDayModal();
      });
      day.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      });
    });
    content.querySelectorAll("[data-calendar-event]").forEach((button) =>
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openEventModal(
          events.find((item) => item.id === button.dataset.calendarEvent),
        );
      }),
    );
    content.querySelectorAll("[data-calendar-more]").forEach((button) =>
      button.addEventListener("click", () => {
        selectedDate = parseDate(button.dataset.calendarMore);
        render();
      }),
    );
  };
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closePopover();
    }
  });
  checkEventReminders();
  window.setInterval(checkEventReminders, 30000);
  render();
}

function ia() {
  const content = el("#page-content");
  try {
    content.innerHTML = `<div data-ai-chat-mount="full"></div>`;
    renderAIChat(el("[data-ai-chat-mount]", content));
    setAIStatus(true);
  } catch (error) {
    setAIStatus(false);
    content.innerHTML = `<article class="card"><h2>Future AI indisponível</h2><p>Não foi possível iniciar o chat agora.</p></article>`;
    console.error("Falha ao iniciar Future AI:", error);
  }
}

function createFloatingAIChat() {
  const button = document.createElement("button");
  button.className = "floating-ai";
  button.type = "button";
  button.title = "Abrir Future AI";
  button.dataset.aiMessage = "Precisa de ajuda? Bora fazer mais dinheiro";
  button.setAttribute("aria-label", "Abrir Future AI");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML =
    '<img src="../../assets/images/Imagem%20ia.png" alt="" /><strong class="ai-hover-message" aria-hidden="true">Precisa de ajuda? Bora fazer mais <em>dinheiro</em></strong>';

  const panel = document.createElement("aside");
  panel.className = "ai-chat-popover";
  panel.setAttribute("aria-hidden", "true");
  panel.innerHTML = `<div class="ai-chat-window"><div class="ai-chat-window-header"><div class="ai-chat-window-brand"><img src="../../assets/images/Imagem%20ia.png" alt="" /><div><span class="eyebrow">Future AI</span><strong>Assistente da ContAI</strong></div></div><button class="close-btn ai-chat-close" type="button" aria-label="Fechar chat">×</button></div><div data-ai-chat-mount="compact"></div></div>`;
  document.body.append(button, panel);
  renderAIChat(el("[data-ai-chat-mount]", panel), true);

  const close = () => {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
    window.dispatchEvent(new Event("contai-ai-visibility-changed"));
  };
  button.addEventListener("click", () => {
    const open = !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", open);
    panel.setAttribute("aria-hidden", String(!open));
    button.setAttribute("aria-expanded", String(open));
    window.dispatchEvent(new Event("contai-ai-visibility-changed"));
    if (open) el("[data-ai-input]", panel)?.focus();
  });
  el(".ai-chat-close", panel).addEventListener("click", close);
}

function automacao() {
  const content = el("#page-content");
  state.automation = state.automation || {
    syncEnabled: false,
    supplierEmail: "fornecedor@exemplo.com",
    supplierName: "Fornecedor principal",
    lastSync: null,
  };
  const render = () => {
    const lowProducts = state.products.filter(
      (product) => product.quantity <= product.lowLimit,
    );
    content.innerHTML = `<section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Sincronização local</h2><p>Atualize os dados salvos no navegador automaticamente.</p></div><span class="status">Frontend</span></div><label class="switch-row"><span><strong>Sincronização automática</strong><small>Recalcula estoque e alertas ao abrir o sistema.</small></span><input id="syncEnabled" type="checkbox" ${state.automation.syncEnabled ? "checked" : ""} /></label><div class="metric-row"><span>Última sincronização</span><strong>${state.automation.lastSync ? new Date(state.automation.lastSync).toLocaleString("pt-BR") : "Ainda não executada"}</strong></div><button class="btn btn-primary" id="syncNow">↻ Sincronizar agora</button></article><article class="card"><div class="section-title"><div><h2>Alerta para fornecedor</h2><p>Gere uma mensagem com os itens em estoque baixo.</p></div></div><div class="form-grid"><label>Fornecedor<input id="supplierName" value="${escapeHTML(state.automation.supplierName)}" /></label><label>E-mail<input id="supplierEmail" type="email" value="${escapeHTML(state.automation.supplierEmail)}" /></label></div><div class="metric-row"><span>Itens que precisam de reposição</span><strong>${lowProducts.length}</strong></div><a class="btn btn-primary" id="supplierEmailLink" href="#">✉ Preparar e-mail</a></article></section><article class="card automation-log" style="margin-top:18px"><div class="section-title"><div><h2>Regras ativas</h2><p>As ações funcionam localmente com os dados do ContAI.</p></div></div><div class="automation-rule"><span class="rule-icon">▦</span><div><strong>Estoque zerado</strong><p>Cria uma notificação crítica no sino imediatamente.</p></div></div><div class="automation-rule"><span class="rule-icon">✉</span><div><strong>Reposição de fornecedor</strong><p>Prepara um e-mail com os produtos abaixo do limite.</p></div></div><div class="automation-rule"><span class="rule-icon">↻</span><div><strong>Dados compartilhados</strong><p>Vendas, estoque e indicadores usam o mesmo localStorage.</p></div></div></article>`;
    const persist = () => {
      state.automation.supplierName = el("#supplierName").value;
      state.automation.supplierEmail = el("#supplierEmail").value;
      save();
    };
    el("#syncEnabled").addEventListener("change", (event) => {
      state.automation.syncEnabled = event.target.checked;
      persist();
      toast(
        event.target.checked
          ? "Sincronização automática ativada."
          : "Sincronização automática desativada.",
      );
    });
    el("#syncNow").addEventListener("click", () => {
      state.automation.lastSync = new Date().toISOString();
      persist();
      addNotification(
        "Sincronização concluída",
        "Os dados locais foram atualizados.",
        "automation",
      );
      render();
      toast("Dados sincronizados.");
    });
    el("#supplierEmailLink").addEventListener("click", (event) => {
      persist();
      const body = lowProducts
        .map(
          (product) =>
            `- ${product.name}: ${product.quantity} unidades (limite ${product.lowLimit})`,
        )
        .join("\n");
      event.currentTarget.href = `mailto:${encodeURIComponent(state.automation.supplierEmail)}?subject=${encodeURIComponent("Solicitação de reposição - ContAI")}&body=${encodeURIComponent(`Olá, ${state.automation.supplierName}.\n\nPrecisamos repor:\n${body}`)}`;
      addNotification(
        "E-mail preparado",
        `Mensagem de reposição preparada para ${state.automation.supplierName}.`,
        "automation",
      );
    });
  };
  render();
}
function configuracoes() {
  const content = el("#page-content");
  let company = {};
  try {
    company = JSON.parse(localStorage.getItem("empresaContAI") || "{}") || {};
  } catch {
    company = {};
  }
  const user = getUser();
  const companyName = company.nomeFantasia || company.razaoSocial || "";
  content.innerHTML = `<section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Perfil da conta</h2><p>Informações do administrador</p></div></div><div class="form-grid"><label>Nome<input id="settingsName" value="${escapeHTML(user.name)}" /></label><label>E-mail<input id="settingsEmail" type="email" value="${escapeHTML(user.email)}" /></label><label class="full">Empresa<input id="settingsCompany" value="${escapeHTML(companyName)}" /></label></div><div class="form-actions"><button class="btn btn-primary" id="saveSettings" type="button">Salvar alterações</button></div></article><article class="card"><div class="section-title"><h2>Plano atual</h2><span class="status">Ativo</span></div><h3>Plano Pro</h3><p class="muted">Recursos completos para acompanhar sua operação, com relatórios e inteligência artificial.</p><div class="metric-row"><span>Renovação</span><strong>20/10/2026</strong></div><div class="metric-row"><span>Valor mensal</span><strong>R$ 149,00</strong></div></article></section>`;
  el("#saveSettings").addEventListener("click", () => {
    const updatedCompany = {
      ...company,
      nomeFantasia: el("#settingsCompany").value.trim(),
      responsavel: {
        ...(company.responsavel || {}),
        nome: el("#settingsName").value.trim(),
        email: el("#settingsEmail").value.trim(),
      },
    };
    localStorage.setItem("empresaContAI", JSON.stringify(updatedCompany));
    window.dispatchEvent(new StorageEvent("storage", { key: "empresaContAI" }));
    toast("Alterações salvas.");
  });
}
function init() {
  ensureStockNotifications();
  const page = document.body.dataset.page || "dashboard";
  const config = {
    dashboard: ["Dashboard", "Acompanhe o que importa para o seu negócio."],
    vendas: ["Vendas", "Histórico, cadastro e acompanhamento de pedidos."],
    estoque: ["Estoque", "Controle seus produtos e evite rupturas."],
    financeiro: ["Financeiro", "Entenda a saúde financeira da sua operação."],
    despesas: ["Despesas", "Organize e acompanhe os custos da sua operação."],
    relatorios: ["Relatórios", "Transforme dados em decisões mais claras."],
    calendario: [
      "Calendário",
      "Organize compromissos e rotinas da sua operação.",
    ],
    ia: [
      "Inteligência Artificial",
      "Converse com seus dados de forma simples.",
    ],
    automacao: ["Automação", "Configure rotinas para acompanhar sua operação."],
    configuracoes: [
      "Configurações",
      "Personalize sua experiência na plataforma.",
    ],
  };
  shell(page, ...(config[page] || config.dashboard));
  (
    ({
      dashboard,
      vendas,
      estoque,
      financeiro,
      despesas,
      relatorios,
      calendario,
      ia,
      automacao,
      configuracoes,
    })[page] || dashboard
  )();
  if (page !== "ia") {
    createFloatingAIChat();
  }
}
function refreshDataDrivenPage() {
  state = loadState();
  const page = document.body.dataset.page;
  const refreshers = {
    dashboard,
    estoque,
    vendas,
    financeiro,
    despesas,
    relatorios,
  };
  if (page === "relatorios" && el(".report-paper")) {
    syncReportView(el("#reportPeriod")?.value);
    return;
  }
  refreshers[page]?.();
}
window.addEventListener("contai-state-updated", refreshDataDrivenPage);
window.addEventListener("storage", (event) => {
  if (event.key === AI_CHATS_KEY || event.key === AI_ACTIVE_CHAT_KEY) {
    renderAIChatInstances();
    return;
  }
  if (event.key === "empresaContAI") renderAIChatInstances();
  if (event.key !== KEY && event.key !== "empresaContAI") return;
  if (event.key === KEY || event.key === "empresaContAI")
    refreshDataDrivenPage();
});
window.addEventListener("contai-ai-updated", renderAIChatInstances);
init();
