const dashboardData = {
  today: {
    revenue: "R$ 82,4k",
    expense: "R$ 36,9k",
    profit: "R$ 45,5k",
    sales: "1.248",
    stock: "1.280",
    lowStock: "18",
    outStock: "3",
    trend: {
      revenue: "+18.2%",
      expense: "+4.8%",
      profit: "+12.1%",
      sales: "+9.6%",
    },
  },
  "7d": {
    revenue: "R$ 128,7k",
    expense: "R$ 52,1k",
    profit: "R$ 76,6k",
    sales: "1.842",
    stock: "1.340",
    lowStock: "15",
    outStock: "4",
    trend: {
      revenue: "+23.5%",
      expense: "+7.1%",
      profit: "+19.2%",
      sales: "+14.8%",
    },
  },
  "30d": {
    revenue: "R$ 412,9k",
    expense: "R$ 194,2k",
    profit: "R$ 218,7k",
    sales: "5.630",
    stock: "1.610",
    lowStock: "23",
    outStock: "6",
    trend: {
      revenue: "+31.8%",
      expense: "+9.6%",
      profit: "+27.6%",
      sales: "+22.3%",
    },
  },
  "3m": {
    revenue: "R$ 1,26M",
    expense: "R$ 612,8k",
    profit: "R$ 647,2k",
    sales: "18.920",
    stock: "1.940",
    lowStock: "31",
    outStock: "7",
    trend: {
      revenue: "+42.3%",
      expense: "+13.4%",
      profit: "+36.1%",
      sales: "+28.7%",
    },
  },
  "1y": {
    revenue: "R$ 4,76M",
    expense: "R$ 2,34M",
    profit: "R$ 2,42M",
    sales: "74.500",
    stock: "2.420",
    lowStock: "27",
    outStock: "5",
    trend: {
      revenue: "+68.9%",
      expense: "+18.1%",
      profit: "+58.4%",
      sales: "+41.2%",
    },
  },
};

const historyEntries = [
  {
    title: "Venda realizada",
    type: "sale",
    date: "Hoje, 09:42",
    description: "Pedido #1048",
    details: "R$ 980,00",
  },
  {
    title: "Produto adicionado",
    type: "stock",
    date: "Hoje, 10:15",
    description: "Teclado mecânico",
    details: "+12 unidades",
  },
  {
    title: "Produto removido",
    type: "stock",
    date: "Hoje, 11:03",
    description: "Mouse gamer",
    details: "-6 unidades",
  },
  {
    title: "Alteração de estoque",
    type: "stock",
    date: "Ontem, 18:40",
    description: 'Monitor 27"',
    details: "-3 unidades",
  },
  {
    title: "Receita registrada",
    type: "revenue",
    date: "Ontem, 15:26",
    description: "Pagamento de cliente",
    details: "R$ 2.340,00",
  },
  {
    title: "Despesa registrada",
    type: "expense",
    date: "Ontem, 13:10",
    description: "Compra de material",
    details: "R$ 865,00",
  },
  {
    title: "Venda realizada",
    type: "sale",
    date: "Há 2 dias, 17:50",
    description: "Pedido #1036",
    details: "R$ 1.240,00",
  },
  {
    title: "Produto adicionado",
    type: "stock",
    date: "Há 3 dias, 09:10",
    description: "Notebook Ultra",
    details: "+8 unidades",
  },
  {
    title: "Despesa registrada",
    type: "expense",
    date: "Há 4 dias, 16:08",
    description: "Frete e logística",
    details: "R$ 420,00",
  },
];

const empresasParceiras = [
  {
    nome: "Nexa Café",
    descricao:
      "Contratou a gestão financeira para acompanhar vendas e despesas.",
  },
  {
    nome: "Lumi Decor",
    descricao:
      "Contratou o controle de estoque para organizar produtos e reposições.",
  },
  {
    nome: "Vitta Studio",
    descricao:
      "Contratou os indicadores do dashboard para entender o desempenho do negócio.",
  },
  {
    nome: "Oficina Norte",
    descricao:
      "Contratou alertas inteligentes para antecipar problemas na operação.",
  },
  {
    nome: "Mercado Raiz",
    descricao:
      "Contratou relatórios e recomendações para melhorar suas decisões.",
  },
];

const listaEmpresas = document.getElementById("lista-empresas");

if (listaEmpresas) {
  empresasParceiras.forEach((empresa) => {
    const card = document.createElement("article");
    card.className = "partner-card reveal";

    const nome = document.createElement("h3");
    nome.textContent = empresa.nome;

    const descricao = document.createElement("p");
    descricao.textContent = empresa.descricao;

    card.append(nome, descricao);
    listaEmpresas.appendChild(card);
  });
}

const historyList = document.getElementById("historyList");
const historySearch = document.getElementById("historySearch");
const historyFilter = document.getElementById("historyFilter");

function renderHistory() {
  if (!historyList) return;
  const query = (historySearch?.value || "").trim().toLowerCase();
  const filter = historyFilter?.value || "all";
  const filtered = historyEntries.filter((entry) => {
    const matchesFilter = filter === "all" || entry.type === filter;
    const matchesQuery =
      !query ||
      `${entry.title} ${entry.description} ${entry.details}`
        .toLowerCase()
        .includes(query);
    return matchesFilter && matchesQuery;
  });
  historyList.innerHTML = filtered.length
    ? filtered
        .map(
          (item) =>
            `<li><div><strong>${item.title}</strong><span>${item.description}</span></div><div class="meta"><span>${item.details}</span><time>${item.date}</time></div></li>`,
        )
        .join("")
    : "<li><span>Nenhuma movimentação encontrada.</span></li>";
}

historySearch?.addEventListener("input", renderHistory);
historyFilter?.addEventListener("change", renderHistory);
renderHistory();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;
  });
});

const navToggle = document.querySelector(".mobile-menu-toggle");
const mainNav = document.getElementById("mainNav");
if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  mainNav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }),
  );
}

const modalLinks = document.querySelectorAll("[data-open-modal]");
const modalOverlays = document.querySelectorAll(".modal-overlay");
modalLinks.forEach((button) =>
  button.addEventListener("click", () => {
    const modal = document.querySelector(
      `[data-modal="${button.dataset.openModal}"]`,
    );
    modal?.classList.add("active");
    modal?.setAttribute("aria-hidden", "false");
  }),
);
modalOverlays.forEach((overlay) => {
  const close = () => {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  };
  overlay.querySelector(".modal-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
});

const faqItems = document.querySelectorAll(".faq-item");
faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");
  question?.addEventListener("click", () => {
    const isOpen = item.classList.contains("active");
    faqItems.forEach((faq) => {
      faq.classList.remove("active");
      faq
        .querySelector(".faq-question")
        ?.setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("active");
      question.setAttribute("aria-expanded", "true");
    }
  });
});

const DEMO_CNPJ = "12.345.678/0001-90";
const DEMO_CPF = "123.456.789-00";
const COMPANY_STORAGE_KEY = "empresaContAI";

const registerModal = document.querySelector('[data-modal="register"]');
const loginModal = document.querySelector('[data-modal="login"]');
const companyForm = registerModal?.querySelector(".company-form");
const loginForm = loginModal?.querySelector(".login-form");
const wizardSteps = [...document.querySelectorAll(".wizard-step")];
const wizardProgress = [...document.querySelectorAll(".wizard-progress span")];
let currentStep = 1;

const digitsOnly = (value) => value.replace(/\D/g, "");
const formatCnpj = (value) =>
  digitsOnly(value)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
const formatCpf = (value) =>
  digitsOnly(value)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
const formatCep = (value) =>
  digitsOnly(value)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, "$1-$2");
const formatPhone = (value) => {
  const digits = digitsOnly(value).slice(0, 11);
  return digits.length < 3
    ? digits
    : digits.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
};
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validCpf = (value) => {
  const cpf = digitsOnly(value);
  if (cpf === digitsOnly(DEMO_CPF)) return true;
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let index = 0; index < 9; index += 1)
    sum += Number(cpf[index]) * (10 - index);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let index = 0; index < 10; index += 1)
    sum += Number(cpf[index]) * (11 - index);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
};

const validCnpj = (value) => {
  const cnpj = digitsOnly(value);
  if (value === DEMO_CNPJ) return true;
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const check = (base) => {
    let factor = base.length - 5;
    const total = base.split("").reduce((sum, digit) => {
      const result = sum + Number(digit) * factor;
      factor = factor === 2 ? 9 : factor - 1;
      return result;
    }, 0);
    const remainder = total % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  return (
    check(cnpj.slice(0, 12)) === Number(cnpj[12]) &&
    check(cnpj.slice(0, 13)) === Number(cnpj[13])
  );
};

const clearErrors = (scope) => {
  scope.querySelectorAll(".field-error").forEach((error) => error.remove());
  scope
    .querySelectorAll(".input-error")
    .forEach((input) => input.classList.remove("input-error"));
};

const addError = (input, message) => {
  input.classList.add("input-error");
  const error = document.createElement("small");
  error.className = "field-error";
  error.textContent = message;
  input.closest("label")?.appendChild(error);
};

const validateStep = (step) => {
  clearErrors(step);
  let valid = true;
  step.querySelectorAll("input, select, textarea").forEach((input) => {
    const value = input.value.trim();
    let message = "";
    if (input.required && !value) message = "Preencha este campo.";
    if (!message && input.type === "email" && !validEmail(value))
      message = "Informe um e-mail válido.";
    if (!message && input.name === "cnpj" && !validCnpj(value))
      message = "Informe um CNPJ válido.";
    if (!message && input.name === "cpf" && !validCpf(value))
      message = "Informe um CPF válido.";
    if (
      !message &&
      ["contatoTelefone", "whatsapp", "responsavelTelefone"].includes(
        input.name,
      ) &&
      digitsOnly(value).length < 10
    )
      message = "Informe um telefone válido.";
    if (!message && input.name === "cep" && digitsOnly(value).length !== 8)
      message = "Informe o CEP.";
    if (!message && input.name === "password" && value.length < 8)
      message = "A senha deve possuir pelo menos 8 caracteres.";
    if (
      !message &&
      input.name === "password" &&
      (!/[A-Za-z]/.test(value) || !/\d/.test(value))
    )
      message = "A senha deve conter letras e números.";
    if (message) {
      valid = false;
      addError(input, message);
    }
  });
  if (step.dataset.step === "5") {
    const password = step.querySelector('[name="password"]');
    const confirmation = step.querySelector('[name="confirmPassword"]');
    if (password.value !== confirmation.value) {
      valid = false;
      addError(confirmation, "As senhas não coincidem.");
    }
  }
  step.querySelector(".input-error")?.focus();
  return valid;
};

const showStep = (stepNumber) => {
  currentStep = stepNumber;
  wizardSteps.forEach((step) => {
    step.hidden = step.dataset.step !== String(stepNumber);
  });
  wizardProgress.forEach((item, index) => {
    item.classList.toggle("active", index + 1 === stepNumber);
    item.classList.toggle("done", index + 1 < stepNumber);
  });
};

const collectCompany = () => {
  const data = Object.fromEntries(new FormData(companyForm).entries());
  return {
    razaoSocial: data.razaoSocial,
    nomeFantasia: data.nomeFantasia,
    cnpj: data.cnpj,
    tipoEmpresa: data.tipoEmpresa,
    segmento: data.segmento,
    dataAbertura: data.dataAbertura,
    descricao: data.descricao,
    contato: {
      email: data.contatoEmail,
      telefone: data.contatoTelefone,
      whatsapp: data.whatsapp,
      site: data.site,
    },
    endereco: {
      cep: data.cep,
      estado: data.estado,
      cidade: data.cidade,
      bairro: data.bairro,
      rua: data.rua,
      numero: data.numero,
      complemento: data.complemento,
    },
    responsavel: {
      nome: data.responsavelNome,
      cpf: data.cpf,
      email: data.responsavelEmail,
      telefone: data.responsavelTelefone,
    },
    acesso: { email: data.loginEmail, senha: data.password },
  };
};

const renderReview = (company) => {
  registerModal.querySelectorAll("[data-review]").forEach((element) => {
    const key = element.dataset.review;
    const values = {
      nomeFantasia: company.nomeFantasia,
      cnpj: company.cnpj,
      contatoEmail: company.contato.email,
      responsavelNome: company.responsavel.nome,
      cidadeEstado: `${company.endereco.cidade} - ${company.endereco.estado}`,
    };
    element.textContent = values[key];
  });
};

const renderProfile = (company) => {
  loginModal.querySelector('[data-profile="nomeFantasia"]').textContent =
    company.nomeFantasia;
  loginModal.querySelector('[data-profile="segmento"]').textContent =
    company.segmento;
  loginModal.querySelector('[data-profile="cnpj"]').textContent = company.cnpj;
  loginModal.querySelector('[data-profile="email"]').textContent =
    company.contato.email;
  loginModal.querySelector('[data-profile="cidadeEstado"]').textContent =
    `${company.endereco.cidade} - ${company.endereco.estado}`;
  loginModal.querySelector('[data-profile="responsavel"]').textContent =
    company.responsavel.nome;
};

document.querySelectorAll('input[name="cnpj"]').forEach((input) =>
  input.addEventListener("input", () => {
    input.value = formatCnpj(input.value);
  }),
);
document.querySelectorAll('input[name="cpf"]').forEach((input) =>
  input.addEventListener("input", () => {
    input.value = formatCpf(input.value);
  }),
);
document.querySelectorAll('input[name="cep"]').forEach((input) =>
  input.addEventListener("input", () => {
    input.value = formatCep(input.value);
  }),
);
document
  .querySelectorAll('input[name*="Telefone"], input[name="whatsapp"]')
  .forEach((input) =>
    input.addEventListener("input", () => {
      input.value = formatPhone(input.value);
    }),
  );

companyForm
  ?.querySelector('[name="password"]')
  ?.addEventListener("input", (event) => {
    const value = event.target.value;
    const indicator = companyForm.querySelector(".password-strength span");
    const label = companyForm.querySelector(".password-strength small");
    const score =
      Number(value.length >= 8) +
      Number(/[A-Za-z]/.test(value)) +
      Number(/\d/.test(value));
    indicator.className =
      score < 2 ? "weak" : score === 2 ? "medium" : "strong";
    label.textContent =
      score === 3
        ? "Senha forte"
        : score === 2
          ? "Senha média"
          : "Use letras e números";
  });

companyForm?.addEventListener("click", (event) => {
  const next = event.target.closest(".wizard-next");
  const back = event.target.closest(".wizard-back");
  const review = event.target.closest(".wizard-review");
  const edit = event.target.closest(".review-edit");
  const confirm = event.target.closest(".confirm-register");
  if (next) {
    const step = companyForm.querySelector(`[data-step="${currentStep}"]`);
    if (validateStep(step)) showStep(currentStep + 1);
  }
  if (back) showStep(Math.max(1, currentStep - 1));
  if (review) {
    const step = companyForm.querySelector('[data-step="5"]');
    if (validateStep(step)) {
      renderReview(collectCompany());
      wizardSteps.forEach((item) => {
        item.hidden = item.dataset.step !== "review";
      });
      wizardProgress.forEach((item) => item.classList.add("done"));
    }
  }
  if (edit) showStep(1);
  if (confirm) {
    localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(collectCompany()));
    localStorage.setItem("cadastroConcluido", "true");
    companyForm.hidden = true;
    registerModal.querySelector(".wizard-progress").hidden = true;
    registerModal.querySelector(".wizard-intro").hidden = true;
    registerModal.querySelector(".registration-success").hidden = false;
  }
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const feedback = loginForm.querySelector(".auth-feedback");
  const company = JSON.parse(
    localStorage.getItem(COMPANY_STORAGE_KEY) || "null",
  );
  const cnpj = loginForm.elements.cnpj.value.trim();
  const password = loginForm.elements.password.value;
  feedback.classList.remove("success");
  feedback.classList.add("error");
  if (!cnpj || !password) {
    feedback.textContent = "Preencha todos os campos.";
    return;
  }
  if (!company) {
    feedback.textContent = "CNPJ ou senha incorretos.";
    return;
  }
  const normalizeCnpj = (value) => value.replace(/\D/g, "");
  const cnpjMatches = normalizeCnpj(cnpj) === normalizeCnpj(company.cnpj);
  const passwordMatches = password === company.acesso.senha;
  if (!cnpjMatches && !passwordMatches) {
    feedback.textContent = "CNPJ ou senha incorretos.";
    return;
  }
  if (!cnpjMatches) {
    feedback.textContent = "CNPJ não encontrado.";
    return;
  }
  if (!passwordMatches) {
    feedback.textContent = "Senha incorreta.";
    return;
  }
  feedback.classList.remove("error");
  feedback.classList.add("success");
  feedback.textContent = "Login realizado com sucesso!";
  window.location.href = "app/painel.html";
});

document.querySelectorAll(".profile-access").forEach((button) =>
  button.addEventListener("click", () => {
    const modal = button.closest(".modal-overlay");
    modal?.classList.remove("active");
    modal?.setAttribute("aria-hidden", "true");
  }),
);

const checkoutForm = document.querySelector(".checkout-form");

const paymentSelect = checkoutForm?.querySelector('select[name="payment"]');
const paymentDetails = checkoutForm
  ? [...checkoutForm.querySelectorAll("[data-payment-details]")]
  : [];

paymentSelect?.addEventListener("change", () => {
  paymentDetails.forEach((section) => {
    const isSelected = section.dataset.paymentDetails === paymentSelect.value;
    section.hidden = !isSelected;
    section.querySelectorAll("input").forEach((input) => {
      input.required = isSelected && !input.hasAttribute("data-copy-value");
    });
  });
});

checkoutForm?.querySelectorAll("[data-copy-payment]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button
      .closest(".payment-details")
      ?.querySelector("[data-copy-value]")?.value;
    if (!value) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        const input = button
          .closest(".payment-details")
          .querySelector("[data-copy-value]");
        input.select();
        document.execCommand("copy");
      }
    } catch {
      return;
    }
    const previousText = button.textContent;
    button.textContent = "Copiado";
    setTimeout(() => {
      button.textContent = previousText;
    }, 1400);
  });
});

checkoutForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const feedback = checkoutForm.querySelector(".checkout-feedback");
  if (!checkoutForm.reportValidity()) return;
  feedback.textContent =
    "Dados recebidos. A próxima etapa da contratação estará disponível em breve.";
});

registerModal?.addEventListener("click", (event) => {
  if (!event.target.closest(".modal-close")) return;
  companyForm.hidden = false;
  registerModal.querySelector(".wizard-progress").hidden = false;
  registerModal.querySelector(".wizard-intro").hidden = false;
  registerModal.querySelector(".registration-success").hidden = true;
  showStep(1);
});

const revealElements = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 },
);

revealElements.forEach((element) => observer.observe(element));

const countTargets = document.querySelectorAll("[data-count]");

const animateCounter = (element) => {
  const target = Number(element.dataset.count || 0);
  const suffix = target % 1 === 0 ? "" : "";
  let current = 0;
  const duration = 1200;
  const step = target / (duration / 16);

  const tick = () => {
    current += step;

    if (current >= target) {
      element.textContent = `${target.toFixed(target % 1 === 0 ? 0 : 1)}${suffix}`;
      return;
    }

    element.textContent = `${current.toFixed(target % 1 === 0 ? 0 : 1)}${suffix}`;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

countTargets.forEach((target) => {
  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  countObserver.observe(target);
});

const billingButtons = document.querySelectorAll(".billing-switch");
const priceElements = document.querySelectorAll("[data-price-monthly]");
const periodLabels = document.querySelectorAll("[data-period]");
const annualOffers = document.querySelectorAll(".annual-offer");
const planLinks = document.querySelectorAll(".plan-link");

const updatePlanLinks = (billing) => {
  planLinks.forEach((link) => {
    link.href = `plano-basico-mensal.html?plano=${link.dataset.plan}&periodo=${billing}`;
  });
};

updatePlanLinks("mensal");

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    billingButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const billing = button.dataset.billing;
    const isAnnual = billing === "annual";

    priceElements.forEach((element) => {
      const value = isAnnual
        ? element.dataset.priceAnnual
        : element.dataset.priceMonthly;
      element.textContent = value.replace(".", ",");
    });

    annualOffers.forEach((offer) => {
      offer.hidden = !isAnnual;
    });

    periodLabels.forEach((label) => {
      label.textContent = isAnnual ? "/ano" : "/mês";
    });

    updatePlanLinks(isAnnual ? "anual" : "mensal");
  });
});

const checkoutPlans = {
  basico: {
    name: "Básico",
    description:
      "O essencial para começar a organizar sua operação com clareza.",
    monthly: "49",
    annual: "39",
    benefits: [
      "Dashboard financeiro",
      "Controle de estoque",
      "Relatórios básicos",
      "Alertas simples",
    ],
  },
  mensal: {
    name: "Profissional",
    description: "Para negócios que querem crescer com autonomia.",
    monthly: "109",
    annual: "89",
    benefits: [
      "Dashboard completo",
      "IA com recomendações",
      "Controle financeiro avançado",
      "Histórico e filtros",
      "Suporte prioritário",
    ],
  },
  empresarial: {
    name: "Empresarial",
    description: "Para equipes que precisam de gestão inteligente.",
    monthly: "249",
    annual: "124.50",
    annualOriginal: "249",
    benefits: [
      "Multiusuários",
      "Relatórios personalizados",
      "Gestão centralizada",
      "Suporte dedicado",
      "Integrações e automações",
    ],
  },
};

const checkoutParams = new URLSearchParams(window.location.search);
const checkoutPlan =
  checkoutPlans[checkoutParams.get("plano") || "basico"] ||
  checkoutPlans.basico;
const checkoutPeriod =
  checkoutParams.get("periodo") === "anual" ? "annual" : "monthly";
const checkoutName = document.querySelector('[data-checkout="name"]');
const checkoutDescription = document.querySelector(
  '[data-checkout="description"]',
);
const checkoutPrice = document.querySelector('[data-checkout="price"]');
const checkoutPeriodLabel = document.querySelector('[data-checkout="period"]');
const checkoutBenefits = document.querySelector('[data-checkout="benefits"]');
const checkoutAnnualOffer = document.querySelector(
  '[data-checkout="annual-offer"]',
);
const checkoutSubtotal = document.querySelector('[data-checkout="subtotal"]');
const checkoutDiscount = document.querySelector('[data-checkout="discount"]');
const checkoutTotal = document.querySelector('[data-checkout="total"]');
const couponInput = document.querySelector('input[name="coupon"]');
const couponButton = document.querySelector("[data-apply-coupon]");
const couponFeedback = document.querySelector(".coupon-feedback");
let couponDiscount = 0;

const formatCurrency = (value) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const checkoutAmount = Number(checkoutPlan[checkoutPeriod]);

const updateCheckoutTotal = () => {
  if (!checkoutSubtotal || !checkoutDiscount || !checkoutTotal) return;
  checkoutSubtotal.textContent = formatCurrency(checkoutAmount);
  checkoutDiscount.textContent = formatCurrency(couponDiscount);
  checkoutTotal.textContent = formatCurrency(checkoutAmount - couponDiscount);
};

if (
  checkoutName &&
  checkoutDescription &&
  checkoutPrice &&
  checkoutPeriodLabel &&
  checkoutBenefits
) {
  checkoutName.textContent = checkoutPlan.name;
  checkoutDescription.textContent = checkoutPlan.description;
  checkoutPrice.textContent = checkoutPlan[checkoutPeriod].replace(".", ",");
  checkoutPeriodLabel.textContent =
    checkoutPeriod === "annual" ? "/ano" : "/mês";
  checkoutBenefits.innerHTML = checkoutPlan.benefits
    .map((benefit) => `<li>${benefit}</li>`)
    .join("");
  if (checkoutAnnualOffer) {
    checkoutAnnualOffer.hidden = !(
      checkoutPlan === checkoutPlans.empresarial && checkoutPeriod === "annual"
    );
  }
}

updateCheckoutTotal();

couponButton?.addEventListener("click", () => {
  const code = couponInput.value.trim().toUpperCase();
  couponFeedback.classList.remove("success", "error");

  if (code === "CONTAI10") {
    couponDiscount = checkoutAmount * 0.1;
    couponFeedback.classList.add("success");
    couponFeedback.textContent = "Cupom aplicado: 10% de desconto.";
  } else if (!code) {
    couponDiscount = 0;
    couponFeedback.classList.add("error");
    couponFeedback.textContent = "Digite um cupom para aplicar.";
  } else {
    couponDiscount = 0;
    couponFeedback.classList.add("error");
    couponFeedback.textContent = "Cupom inválido.";
  }

  updateCheckoutTotal();
});

const contactForm = document.querySelector(".contact-form");
const formFeedback = document.querySelector(".form-feedback");

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nameInput = contactForm.querySelector('input[name="name"]');
  const emailInput = contactForm.querySelector('input[name="email"]');

  if (
    !nameInput ||
    !emailInput ||
    !nameInput.value.trim() ||
    !emailInput.value.trim()
  ) {
    formFeedback.textContent =
      "Preencha nome e e-mail para enviar sua mensagem.";
    return;
  }

  formFeedback.textContent =
    "Mensagem enviada com sucesso! Nossa equipe responderá em breve.";
  contactForm.reset();
});
