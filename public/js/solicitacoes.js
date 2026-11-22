const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

const lista = document.getElementById("listaSolicitacoes");
const filtro = document.getElementById("filtro");

function renderizar(dados) {
  lista.innerHTML = "";

  if (dados.length === 0) {
    lista.innerHTML = `<div class="col-12"><div class="empty-state text-center p-5"><div class="feature-icon mx-auto mb-3"><i class="bi bi-inbox" aria-hidden="true"></i></div><h2 class="h5 fw-bold">Nenhuma solicitação encontrada</h2><p class="text-secondary mb-0">Confira o CPF ou e-mail informado e tente novamente.</p></div></div>`;
    return;
  }

  dados.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("material-card");

    div.innerHTML = `
  <h3>${item.material}</h3>

  <img src="${item.imagem || "imagens/padrao.png"}" class="material-img-right">

  <p><strong>Nome:</strong> ${item.nome}</p>
  <p><strong>CPF:</strong> ${item.cpf}</p>
  <p><strong>Email:</strong> ${item.email}</p>

  <p><strong>Solicitado em:</strong> ${item.dataSolicitacao || "-"}</p>

  ${
    item.status === "aprovado" || item.status === "devolvido"
      ? `<p><strong>Aprovado em:</strong> ${item.dataAprovacao || "-"}</p>`
      : ""
  }

  ${
    item.status === "devolvido"
      ? `<p><strong>Devolvido em:</strong> ${item.dataDevolucao || "-"}</p>`
      : ""
  }

  <div class="status ${item.status}">
    ${item.status.toUpperCase()}
  </div>
`;

    lista.appendChild(div);
  });
}

filtro.addEventListener("input", () => {
  const valor = filtro.value.toLowerCase().trim();

  if (valor === "") {
    lista.innerHTML = `<div class="col-12"><div class="empty-state text-center p-5"><div class="feature-icon mx-auto mb-3"><i class="bi bi-person-search" aria-hidden="true"></i></div><h2 class="h5 fw-bold">Consulte uma solicitação</h2><p class="text-secondary mb-0">Digite seu CPF ou e-mail acima para visualizar seus pedidos.</p></div></div>`;
    return;
  }

  const filtrados = solicitacoes.filter(
    (s) =>
      (s.cpf && s.cpf.includes(valor)) ||
      (s.email && s.email.toLowerCase().includes(valor)),
  );

  renderizar(filtrados);
});

lista.innerHTML = `<div class="col-12"><div class="empty-state text-center p-5"><div class="feature-icon mx-auto mb-3"><i class="bi bi-person-search" aria-hidden="true"></i></div><h2 class="h5 fw-bold">Consulte uma solicitação</h2><p class="text-secondary mb-0">Digite seu CPF ou e-mail acima para visualizar seus pedidos.</p></div></div>`;
