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
    return loaded;
  } catch {
    return clone(seed);
  }
}
let state = loadState();
function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}
function addNotification(title, message, type = "info") {
  state.notifications = [
    {
      id: `n${Date.now()}`,
      title,
      message,
      type,
      date: new Date().toISOString(),
      read: false,
    },
    ...(state.notifications || []),
  ].slice(0, 12);
  save();
  window.dispatchEvent(new CustomEvent("contai-notification"));
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
  return localStorage.getItem("contai_theme") || "dark";
}
function setTheme(theme) {
  document.body.classList.toggle("light-mode", theme === "light");
  localStorage.setItem("contai_theme", theme);
}
function getUser() {
  try {
    const company = JSON.parse(localStorage.getItem("empresaContAI") || "null");
    const name = company?.responsavel?.nome || company?.nomeFantasia || "Admin";
    return {
      name: String(name).trim() || "Admin",
      email:
        company?.responsavel?.email ||
        company?.contato?.email ||
        "admin@contai.app",
      plan: "Plano Pro",
    };
  } catch {
    return { name: "Admin", email: "admin@contai.app", plan: "Plano Pro" };
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
const el = (selector, root = document) => root.querySelector(selector);
const els = (selector, root = document) => [...root.querySelectorAll(selector)];
const escapeHTML = (value) =>
  String(value ?? "").replace(
    /[&<>\"]/g,
    (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char],
  );
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
      estoque: "▦",
      financeiro: "R$",
      relatorios: "▤",
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
    { id: "relatorios", label: "Relatórios", href: "relatorios.html" },
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
  const unread = (state.notifications || []).filter(
    (item) => !item.read,
  ).length;
  document.title = `${title} | ContAI`;
  el("#app").innerHTML =
    `<div class="app-shell"><aside class="sidebar"><a class="brand" href="painel.html"><span class="brand-mark">C</span><span>ContAI</span></a><p class="side-label">Workspace</p><nav class="side-nav" aria-label="Navegação principal">${navMarkup(page)}</nav><div class="plan-card"><strong>Plano Pro</strong><span>Seu plano está ativo</span><a href="configuracoes.html">Ver detalhes</a></div></aside><main class="main"><header class="topbar"><div>${page === "dashboard" ? `<span class="eyebrow">Resumo de hoje</span><h1>Olá, ${escapeHTML(user.name)}.</h1><p>Aqui está um resumo do seu negócio.</p>` : `<span class="eyebrow">Visão geral</span><h1>${title}</h1><p>${subtitle}</p>`}</div><div class="top-actions"><div class="notification-wrap"><button class="icon-btn notification-btn" title="Notificações" aria-label="Notificações" aria-expanded="false">🔔${unread ? `<b class="notification-badge">${unread}</b>` : ""}</button><div class="notification-panel" hidden></div></div><button class="icon-btn" id="themeToggle" title="Alternar tema" aria-label="Alternar tema">☼</button><button class="profile" type="button" aria-expanded="false"><div class="avatar">${escapeHTML(initials(user.name))}</div><div class="profile-info"><strong>${escapeHTML(user.name)}</strong><span>Administrador</span></div></button><div class="profile-menu" hidden><strong>${escapeHTML(user.name)}</strong><span>${escapeHTML(user.email)}</span><small>${escapeHTML(user.plan)}</small><a href="configuracoes.html">Meu perfil</a><a href="configuracoes.html">Configurações</a><button type="button" data-logout>Sair</button></div></div></header><div id="page-content"></div></main></div>`;
  setTheme(getTheme());
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
        `<b class="notification-badge">${unreadCount}</b>`,
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
    window.location.href = "home.html";
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
  el("#themeToggle")?.addEventListener("click", () =>
    setTheme(getTheme() === "light" ? "dark" : "light"),
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
  const today = new Date("2026-09-20T12:00:00");
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
  const max = Math.max(...data.map((item) => item.value)) * 1.15;
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
  const entries = Object.entries(groups).length
    ? Object.entries(groups)
    : [
        ["Eletrônicos", 42],
        ["Acessórios", 35],
        ["Cabos", 23],
      ];
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
  content.innerHTML = `<section class="grid stats-grid"><article class="card stat-card"><div class="stat-head"><span>Receita</span><span class="stat-icon">↗</span></div><strong class="stat-value">${money(values.revenue)}</strong><span class="trend">+12,5% no período</span></article><article class="card stat-card"><div class="stat-head"><span>Despesas</span><span class="stat-icon">↓</span></div><strong class="stat-value">${money(values.expenses)}</strong><span class="trend warn">+5,2% no período</span></article><article class="card stat-card"><div class="stat-head"><span>Vendas</span><span class="stat-icon">◇</span></div><strong class="stat-value">${values.sales}</strong><span class="trend">+18,7% no período</span></article><article class="card stat-card"><div class="stat-head"><span>Estoque</span><span class="stat-icon">▦</span></div><strong class="stat-value">${values.stock} produtos</strong><span class="subtext">${values.low} em estoque baixo</span></article></section><section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Desempenho Geral</h2><p>Receita acompanhada ao longo do tempo</p></div><div class="filters"><button class="filter-btn active" data-period="7d">7 dias</button><button class="filter-btn" data-period="30d">30 dias</button><button class="filter-btn" data-period="3m">3 meses</button></div></div><div class="chart-wrap" id="performanceChart"></div></article><article class="card"><div class="section-title"><div><h2>Vendas por categoria</h2><p>Distribuição do faturamento</p></div></div><div id="categoryChart"></div></article></section><section class="grid two-col" style="margin-top:18px"><article class="card"><div class="section-title"><h2>Vendas Recentes</h2><a class="btn btn-small" href="vendas.html">Ver todas</a></div><div class="sales-list">${state.sales
    .slice(0, 5)
    .map(
      (sale) =>
        `<div class="sale-row"><div class="sale-product"><strong>${escapeHTML(sale.product)}</strong><span>${escapeHTML(sale.customer)}</span></div><span class="muted">${dateBR(sale.date)}</span><strong>${money(sale.total)}</strong><span class="status ${sale.paymentStatus === "Pendente" ? "pending" : ""}">${escapeHTML(sale.paymentStatus)}</span></div>`,
    )
    .join(
      "",
    )}</div></article><article class="card"><div class="section-title"><div><h2>Resumo Financeiro</h2><p>Resultado acumulado</p></div><a class="btn btn-small" href="financeiro.html">Ver relatório</a></div><div class="metric-row"><span>Receitas</span><strong class="positive">${money(values.revenue)}</strong></div><div class="metric-row"><span>Despesas</span><strong>${money(values.expenses)}</strong></div><div class="metric-row"><span>Lucro líquido</span><strong class="positive">${money(values.revenue - values.expenses)}</strong></div><div class="metric-row"><span>Variação</span><strong class="positive">+14,8%</strong></div></article></section>`;
  renderLineChart(el("#performanceChart"));
  renderDonut(el("#categoryChart"));
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
  return `<form id="productForm"><div class="form-grid"><label>Nome do produto<input name="name" required value="${escapeHTML(product.name)}" /></label><label>Categoria<input name="category" required value="${escapeHTML(product.category)}" /></label><label>Preço de venda<input name="price" type="number" min="0" step="0.01" required value="${product.price || ""}" /></label><label>Custo unitário<input name="costPrice" type="number" min="0" step="0.01" required value="${product.costPrice ?? ""}" /></label><label>Quantidade inicial<input name="quantity" type="number" min="0" required value="${product.quantity ?? ""}" /></label><label>Limite de estoque baixo<input name="lowLimit" type="number" min="0" required value="${product.lowLimit ?? 5}" /></label><label>Ícone<input name="icon" maxlength="2" value="${escapeHTML(product.icon || "▣")}" /></label></div><div class="form-actions"><button class="btn" type="button" data-close>Cancelar</button><button class="btn btn-primary" type="submit">Salvar produto</button></div></form>`;
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
    content.innerHTML = `<div class="section-title"><div><h2>Catálogo de produtos</h2><p>${state.products.length} produtos cadastrados · ${totals().low} precisam de atenção</p></div><button class="btn btn-primary" id="addProduct">+ Adicionar produto</button></div><article class="card table-wrap"><table><thead><tr><th>Produto</th><th>Categoria</th><th>Quantidade</th><th>Preço</th><th>Status</th><th>Ações</th></tr></thead><tbody>${state.products
      .map((product) => {
        const outOfStock = product.quantity === 0;
        const lowStock = product.quantity <= product.lowLimit;
        return `<tr><td><div class="product-cell"><span class="product-icon">${escapeHTML(product.icon)}</span><strong>${escapeHTML(product.name)}</strong></div></td><td>${escapeHTML(product.category)}</td><td><button class="btn btn-small" data-stock="${product.id}" data-change="-1">−</button> <strong>${product.quantity}</strong> <button class="btn btn-small" data-stock="${product.id}" data-change="1">+</button></td><td>${money(product.price)}</td><td><span class="status ${outOfStock ? "out-of-stock" : lowStock ? "pending" : ""}">${outOfStock ? "Estoque em falta" : lowStock ? "Estoque baixo" : "Disponível"}</span></td><td><button class="btn btn-small" data-edit="${product.id}" title="Editar">✎</button> <button class="btn btn-small btn-danger" data-delete="${product.id}" title="Excluir">♲</button></td></tr>`;
      })
      .join("")}</tbody></table></article>`;
    el("#addProduct").addEventListener("click", () =>
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
      }),
    );
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
    content.innerHTML = `<div class="section-title"><div><h2>Histórico completo</h2><p>Pesquise, filtre e gerencie cada venda registrada.</p></div><button class="btn btn-primary" id="addSale">+ Nova venda</button></div><article class="card"><div class="filters" style="margin-bottom:18px"><input id="saleSearch" placeholder="Pesquisar por produto, cliente ou ID" /><select id="saleStatus"><option value="all">Todos os status</option><option>Pago</option><option>Pendente</option><option>Cancelado</option></select></div><div class="table-wrap"><table><thead><tr><th>ID / Produto</th><th>Comprador</th><th>Data e horário</th><th>Envio</th><th>Pagamento</th><th>Valor final</th><th>Ações</th></tr></thead><tbody id="salesTable"></tbody></table></div></article>`;
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
              `<tr><td><strong>${sale.id}</strong><small>${escapeHTML(sale.product)} · ${sale.quantity} un.</small></td><td>${escapeHTML(sale.customer)}<small>${escapeHTML(sale.address)}</small></td><td>${dateBR(sale.date)}<small>${sale.time}</small></td><td><span class="status">${escapeHTML(sale.shippingStatus)}</span></td><td><span class="status ${sale.paymentStatus === "Pendente" ? "pending" : sale.paymentStatus === "Cancelado" ? "cancelled" : ""}">${escapeHTML(sale.paymentStatus)}</span></td><td><strong>${money(sale.total)}</strong><small>Desconto: ${money(sale.discount)}</small></td><td><button class="btn btn-small" data-edit-sale="${sale.id}">✎</button> <button class="btn btn-small btn-danger" data-delete-sale="${sale.id}">♲</button></td></tr>`,
          )
          .join("") ||
        `<tr><td colspan="7">Nenhuma venda encontrada.</td></tr>`;
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
          if (confirm(`Excluir a venda ${sale.id}?`)) {
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
          }
        }),
      );
    };
    el("#saleSearch").addEventListener("input", draw);
    el("#saleStatus").addEventListener("change", draw);
    draw();
    el("#addSale").addEventListener("click", () =>
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
      }),
    );
  };
  render();
}
function financeiro() {
  const content = el("#page-content");
  const values = totals();
  const profit = values.profit;
  content.innerHTML = `<section class="grid stats-grid"><article class="card stat-card"><div class="stat-head"><span>Receita</span><span class="positive">●</span></div><strong class="stat-value">${money(values.revenue)}</strong><span class="trend">+12,5% vs. período anterior</span></article><article class="card stat-card"><div class="stat-head"><span>Despesas</span><span class="stat-icon">↓</span></div><strong class="stat-value">${money(values.expenses)}</strong><span class="trend warn">+5,2% vs. período anterior</span></article><article class="card stat-card"><div class="stat-head"><span>Lucro líquido</span><span class="positive">↗</span></div><strong class="stat-value">${money(profit)}</strong><span class="trend">Margem de ${values.revenue ? Math.round((profit / values.revenue) * 100) : 0}%</span></article><article class="card stat-card"><div class="stat-head"><span>Fluxo de caixa</span><span class="stat-icon">⌁</span></div><strong class="stat-value positive">Positivo</strong><span class="subtext">Saldo operacional saudável</span></article></section><section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Evolução financeira</h2><p>Receitas e despesas por período</p></div></div><div class="bar-chart">${[58, 73, 65, 82, 76, 94, 88].map((height, index) => `<div class="bar-item"><div class="bar" style="height:${height}%"></div><span>${["Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out"][index]}</span></div>`).join("")}</div></article><article class="card"><div class="section-title"><h2>Gastos por categoria</h2></div>${state.expenses.map((item) => `<div class="metric-row"><span>${escapeHTML(item.label)}</span><strong>${money(item.value)}</strong></div>`).join("")}<div class="callout" style="margin-top:18px"><strong>Despesas aumentaram 18% neste período.</strong><p>Categoria com maior gasto: Operacional.</p></div></article></section><section class="card" style="margin-top:18px"><div class="section-title"><h2>Leitura do período</h2><span class="status">Resultado líquido positivo</span></div><p class="muted">O negócio gerou ${money(profit)} após despesas. Acompanhe a categoria Operacional e mantenha o fluxo de caixa positivo para preservar essa margem.</p></section>`;
}
function relatorios() {
  const content = el("#page-content");
  content.innerHTML = `<article class="card"><div class="section-title"><div><h2>Gerador de relatórios</h2><p>Monte uma visão profissional dos seus dados.</p></div></div><div class="form-grid"><label>Tipo de relatório<select id="reportType"><option>Desempenho geral</option><option>Financeiro</option><option>Estoque</option><option>Vendas</option></select></label><label>Período<select id="reportPeriod"><option>01/09/2026 — 30/09/2026</option><option>Últimos 7 dias</option><option>Últimos 3 meses</option></select></label></div><div class="form-actions"><button class="btn btn-primary" id="generateReport">Gerar relatório</button></div></article><div id="reportResult" style="margin-top:18px"></div>`;
  el("#generateReport").addEventListener("click", () => {
    const values = totals();
    const profit = values.profit;
    el("#reportResult").innerHTML =
      `<article class="report-paper"><span class="eyebrow">Relatório de ${el("#reportType").value}</span><h2>RELATÓRIO DE DESEMPENHO</h2><p>Período: ${el("#reportPeriod").value}</p><div class="grid three-col" style="margin:25px 0"><div class="card"><small>Receita total</small><h3>${money(values.revenue)}</h3></div><div class="card"><small>Despesas</small><h3>${money(values.expenses)}</h3></div><div class="card"><small>Lucro líquido</small><h3>${money(profit)}</h3></div></div><div class="grid two-col"><div class="card"><h3>Evolução de receita</h3><div class="report-bars">${[42, 55, 48, 72, 67, 88, 80].map((height) => `<i style="--height:${height}%"></i>`).join("")}</div></div><div class="card"><h3>Resumo operacional</h3><div class="metric-row"><span>Vendas realizadas</span><strong>${values.sales}</strong></div><div class="metric-row"><span>Produtos em estoque</span><strong>${values.stock}</strong></div><div class="metric-row"><span>Itens em estoque baixo</span><strong>${values.low}</strong></div></div></div><div style="margin-top:22px"><h3>Observações e conclusões</h3><p>O resultado líquido é ${profit >= 0 ? "positivo" : "negativo"}. A operação deve priorizar o acompanhamento de produtos com estoque baixo e da categoria com maior despesa para preservar a rentabilidade.</p></div></article>`;
    addNotification(
      "Relatório concluído",
      `Relatório de ${el("#reportType").value} gerado com sucesso.`,
      "report",
    );
  });
}
function ia() {
  const content = el("#page-content");
  content.innerHTML = `<article class="card chat-shell"><div class="messages" id="messages"><div class="message"><strong>ContAI IA</strong>Olá, Admin Silva. Posso analisar suas vendas, despesas e estoque. Qual decisão você quer tomar hoje?</div><div class="message user">Como estão as vendas deste mês?</div><div class="message"><strong>ContAI IA</strong>Você registrou ${state.sales.length} vendas, somando ${money(sumSales())}. O resultado está positivo em relação às despesas cadastradas.</div></div><form class="chat-form" id="chatForm"><input id="chatInput" placeholder="Pergunte sobre seus dados..." autocomplete="off" /><button class="btn btn-primary" type="submit">Enviar ↗</button></form></article>`;
  el("#chatForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const input = el("#chatInput");
    const question = input.value.trim();
    if (!question) return;
    const messages = el("#messages");
    messages.insertAdjacentHTML(
      "beforeend",
      `<div class="message user">${escapeHTML(question)}</div>`,
    );
    const lower = question.toLowerCase();
    const values = totals();
    let answer = `Com os dados atuais, temos ${values.sales} vendas e receita de ${money(values.revenue)}.`;
    if (lower.includes("estoque") || lower.includes("produto"))
      answer = `Há ${values.low} produto(s) em estoque baixo. ${state.products.sort((a, b) => b.quantity - a.quantity)[0]?.name || "Nenhum produto"} tem a maior quantidade disponível.`;
    if (lower.includes("despesa") || lower.includes("gasto"))
      answer = `As despesas somam ${money(values.expenses)}. A maior categoria é ${state.expenses.sort((a, b) => b.value - a.value)[0]?.label || "não identificada"}.`;
    if (lower.includes("lucro") || lower.includes("prejuízo"))
      answer = `${values.profit >= 0 ? "O lucro líquido" : "O prejuízo líquido"} calculado é ${money(Math.abs(values.profit))}.`;
    setTimeout(() => {
      messages.insertAdjacentHTML(
        "beforeend",
        `<div class="message"><strong>ContAI IA</strong>${answer}</div>`,
      );
      addNotification(
        "A IA terminou de responder",
        "Sua análise está pronta para consulta.",
        "ai",
      );
      messages.scrollTop = messages.scrollHeight;
    }, 250);
    input.value = "";
  });
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
  content.innerHTML = `<section class="grid two-col"><article class="card"><div class="section-title"><div><h2>Perfil da conta</h2><p>Informações do administrador</p></div></div><div class="form-grid"><label>Nome<input value="Admin Silva" /></label><label>E-mail<input value="admin@contai.app" /></label><label class="full">Empresa<input value="ContAI Demo Ltda." /></label></div><div class="form-actions"><button class="btn btn-primary" id="saveSettings">Salvar alterações</button></div></article><article class="card"><div class="section-title"><h2>Plano atual</h2><span class="status">Ativo</span></div><h3>Plano Pro</h3><p class="muted">Recursos completos para acompanhar sua operação, com relatórios e inteligência artificial.</p><div class="metric-row"><span>Renovação</span><strong>20/10/2026</strong></div><div class="metric-row"><span>Valor mensal</span><strong>R$ 149,00</strong></div></article></section>`;
  el("#saveSettings").addEventListener("click", () =>
    toast("Alterações salvas."),
  );
}
function init() {
  ensureStockNotifications();
  const page = document.body.dataset.page || "dashboard";
  const config = {
    dashboard: ["Dashboard", "Acompanhe o que importa para o seu negócio."],
    vendas: ["Vendas", "Histórico, cadastro e acompanhamento de pedidos."],
    estoque: ["Estoque", "Controle seus produtos e evite rupturas."],
    financeiro: ["Financeiro", "Entenda a saúde financeira da sua operação."],
    relatorios: ["Relatórios", "Transforme dados em decisões mais claras."],
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
      relatorios,
      ia,
      automacao,
      configuracoes,
    })[page] || dashboard
  )();
  if (page !== "ia") {
    const button = document.createElement("a");
    button.className = "floating-ai";
    button.href = "ia.html";
    button.title = "Abrir ContAI IA";
    button.textContent = "AI";
    document.body.append(button);
  }
}
window.addEventListener("storage", (event) => {
  if (event.key !== KEY && event.key !== "empresaContAI") return;
  state = loadState();
  if (document.body.dataset.page === "dashboard") dashboard();
});
init();
