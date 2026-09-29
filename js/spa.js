const views = {
  inicio: {
    title: "Início",
    html: `<section class="hero container"><div class="hero-copy"><span class="eyebrow">SPA • Inclusão • Educação</span><h1>Construindo novos caminhos para transformar vidas.</h1><p>Versão em página única do Projeto Novos Caminhos, com templates dinâmicos em JavaScript.</p><div class="actions"><a class="btn primary" href="#/projetos" data-link>Conheça os projetos</a><a class="btn secondary" href="#/cadastro" data-link>Quero participar</a></div></div></section>`
  },
  projetos: {
    title: "Projetos",
    html: `<section class="page-hero"><div class="container narrow"><span class="eyebrow">Nossos projetos</span><h1>Ações que aproximam pessoas de novas oportunidades.</h1></div></section><section class="section"><div class="container" id="projectCards"></div></section>`
  },
  cadastro: {
    title: "Participe",
    html: `<section class="page-hero"><div class="container narrow"><span class="eyebrow">Faça parte</span><h1>Cadastre seu interesse.</h1><p>Os dados ficam salvos localmente no navegador (localStorage) como rascunho.</p></div></section><section class="section"><div class="container narrow"><form id="spaCadastro" class="info-box"><label>Nome <input name="nome" required maxlength="80"></label><label>E-mail <input name="email" type="email" required></label><button class="btn primary" type="submit">Salvar interesse</button><p class="form-message" id="spaMessage" role="status"></p></form></div></section>`
  }
};

const projectTemplate = (item) => `<article class="card"><span class="badge badge-info">${item.tag}</span><h3>${item.title}</h3><p>${item.text}</p></article>`;

const projects = [
  { tag: "Educação", title: "Conexão para o Futuro", text: "Oficinas de tecnologia e preparação profissional." },
  { tag: "Comunidade", title: "Rede de Apoio", text: "Ações colaborativas com parceiros locais." },
  { tag: "Voluntariado", title: "Tempo que Transforma", text: "Programa para quem deseja doar tempo e conhecimento." }
];

function render(route) {
  const view = views[route] || views.inicio;
  const app = document.querySelector("#app");
  if (!app) return;
  app.innerHTML = view.html;
  document.title = "Projeto Novos Caminhos | " + view.title;
  document.querySelectorAll(".site-nav a").forEach((a) => {
    a.classList.toggle("active", a.getAttribute("href") === "#/" + route);
  });
  if (route === "projetos") {
    const host = document.querySelector("#projectCards");
    if (host) host.innerHTML = '<div class="cards">' + projects.map(projectTemplate).join("") + "</div>";
  }
  if (route === "cadastro") {
    const form = document.querySelector("#spaCadastro");
    const message = document.querySelector("#spaMessage");
    const key = "novos-caminhos-spa-draft";
    try {
      const draft = JSON.parse(localStorage.getItem(key) || "{}");
      Object.entries(draft).forEach(([k, v]) => {
        if (form.elements[k]) form.elements[k].value = v;
      });
    } catch (e) {}
    form.addEventListener("input", () => {
      const data = Object.fromEntries(new FormData(form).entries());
      localStorage.setItem(key, JSON.stringify(data));
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      message.textContent = "Interesse salvo localmente com sucesso.";
      message.className = "form-message is-success";
    });
  }
}

function currentRoute() {
  const hash = location.hash.replace(/^#\/?/, "");
  return hash || "inicio";
}

function initSpa() {
  document.body.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link]");
    if (!link) return;
    event.preventDefault();
    location.hash = link.getAttribute("href");
  });
  window.addEventListener("hashchange", () => render(currentRoute()));
  render(currentRoute());
}

document.addEventListener("DOMContentLoaded", initSpa);
