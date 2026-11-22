function showTab(tabId, btn) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((b) => b.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  btn.classList.add("active");
}

function atualizarIndicadores() {
  const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];
  const materiais = JSON.parse(localStorage.getItem("materiais")) || [];
  document.getElementById("totalPendentes").textContent = solicitacoes.filter((s) => s.status === "pendente").length;
  document.getElementById("totalAtivos").textContent = solicitacoes.filter((s) => s.status === "aprovado").length;
  document.getElementById("totalMateriais").textContent = materiais.length;
}

function carregarSolicitacoes() {
  const lista = document.getElementById("listaSolicitacoesAdmin");
  const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

  lista.innerHTML = "";

  const pendentes = solicitacoes.filter((s) => s.status === "pendente");

  if (pendentes.length === 0) {
    lista.innerHTML = "<p>Nenhuma solicitação pendente.</p>";
    return;
  }

  pendentes.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("material-card");

    div.innerHTML = `
      <h3>${item.material}</h3>
      <img src="${item.imagem || "imagens/padrao.png"}" class="material-img-right">
      <p><strong>Nome:</strong> ${item.nome}</p>
      <p><strong>CPF:</strong> ${item.cpf}</p>
      <p><strong>Endereço:</strong> 
${item.rua}
${item.numero ? ", " + item.numero : ""}
 - ${item.bairro}, ${item.cidade}
${item.complemento ? " (" + item.complemento + ")" : ""}
</p>
      <p><strong>Solicitado em:</strong> ${item.dataSolicitacao}</p>
      <div class="d-flex flex-column flex-sm-row gap-2 mt-3">
        <button onclick="aprovar(${index})" class="btn btn-success flex-fill">
          <i class="bi bi-check-circle me-1" aria-hidden="true"></i>Aprovar
        </button>
        <button onclick="rejeitar(${index})" class="btn btn-outline-danger flex-fill">
          <i class="bi bi-x-circle me-1" aria-hidden="true"></i>Rejeitar
        </button>
      </div>
    `;

    lista.appendChild(div);
  });
}

function aprovar(index) {
  let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

  const pendentes = solicitacoes.filter((s) => s.status === "pendente");

  const item = pendentes[index];

  const realIndex = solicitacoes.findIndex(
    (s) =>
      s.cpf === item.cpf &&
      s.material === item.material &&
      s.status === "pendente",
  );

  if (realIndex !== -1) {
    solicitacoes[realIndex].status = "aprovado";

    solicitacoes[realIndex].dataAprovacao = new Date().toLocaleDateString(
      "pt-BR",
    );

    let materiais = JSON.parse(localStorage.getItem("materiais")) || [];

    const matIndex = materiais.findIndex((m) => m.nome === item.material);

    if (matIndex !== -1 && materiais[matIndex].quantidade > 0) {
      materiais[matIndex].quantidade -= 1;
      localStorage.setItem("materiais", JSON.stringify(materiais));
    }

    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
  }

  carregarSolicitacoes();
  carregarDevolucoes();
  atualizarIndicadores();
}

function rejeitar(index) {
  let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

  const pendentes = solicitacoes.filter((s) => s.status === "pendente");

  const item = pendentes[index];

  const realIndex = solicitacoes.findIndex(
    (s) =>
      s.cpf === item.cpf &&
      s.material === item.material &&
      s.status === "pendente",
  );

  if (realIndex !== -1) {
    solicitacoes[realIndex].status = "rejeitado";

    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
  }

  carregarSolicitacoes();
  atualizarIndicadores();
}

function carregarDevolucoes() {
  const lista = document.getElementById("listaDevolucoes");
  const solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

  lista.innerHTML = "";

  const ativos = solicitacoes.filter((s) => s.status === "aprovado");

  if (ativos.length === 0) {
    lista.innerHTML = "<p>Nenhum empréstimo ativo.</p>";
    return;
  }

  ativos.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("material-card");

    div.innerHTML = `
      <h3>${item.material}</h3>
      <img src="${item.imagem || "imagens/padrao.png"}" class="material-img-right">
      <p><strong>Nome:</strong> ${item.nome}</p>
      <p><strong>CPF:</strong> ${item.cpf}</p>
      <p><strong>Endereço:</strong> 
${item.rua}
${item.numero ? ", " + item.numero : ""}
 - ${item.bairro}, ${item.cidade}
${item.complemento ? " (" + item.complemento + ")" : ""}
</p>
      <p><strong>Aprovado em:</strong> ${item.dataAprovacao || "-"}</p>
      <button onclick="devolver(${index})" class="btn btn-primary-custom mt-2">
        <i class="bi bi-arrow-return-left me-1" aria-hidden="true"></i>Marcar como devolvido
      </button>
    `;

    lista.appendChild(div);
  });
}

function devolver(index) {
  let solicitacoes = JSON.parse(localStorage.getItem("solicitacoes")) || [];

  const ativos = solicitacoes.filter((s) => s.status === "aprovado");

  const item = ativos[index];

  const realIndex = solicitacoes.findIndex(
    (s) =>
      s.cpf === item.cpf &&
      s.material === item.material &&
      s.status === "aprovado",
  );

  if (realIndex !== -1) {
    solicitacoes[realIndex].status = "devolvido";

    solicitacoes[realIndex].dataDevolucao = new Date().toLocaleDateString(
      "pt-BR",
    );

    let materiais = JSON.parse(localStorage.getItem("materiais")) || [];

    const matIndex = materiais.findIndex((m) => m.nome === item.material);

    if (matIndex !== -1) {
      materiais[matIndex].quantidade += 1;
      localStorage.setItem("materiais", JSON.stringify(materiais));
    }

    localStorage.setItem("solicitacoes", JSON.stringify(solicitacoes));
  }

  carregarDevolucoes();
  atualizarIndicadores();
}

carregarSolicitacoes();
carregarDevolucoes();
atualizarIndicadores();
