let materiais = JSON.parse(localStorage.getItem("materiais")) || [];

const container = document.getElementById("materiaisContainer");
const busca = document.getElementById("busca");

function renderizar(lista) {
  container.innerHTML = "";

  if (lista.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state text-center p-5">
          <div class="feature-icon mx-auto mb-3"><i class="bi bi-search" aria-hidden="true"></i></div>
          <h2 class="h5 fw-bold">Nenhum material encontrado</h2>
          <p class="text-secondary mb-0">Tente buscar por outro nome ou confira novamente o catálogo.</p>
        </div> 
      </div>`;
    return;
  }

  lista.forEach((item) => {
    const disponivel = item.quantidade > 0;

    const card = document.createElement("div");
    card.classList.add("material-card");

    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}" class="material-img">

      <h3>${item.nome}</h3>
      <p>${item.descricao}</p>
      <div class="d-flex justify-content-between align-items-center gap-2 mb-2">
        <span class="small text-secondary"><i class="bi bi-box-seam me-1" aria-hidden="true"></i>${item.quantidade} unidade(s)</span>
      </div>

      <div class="status ${disponivel ? "disponivel" : "indisponivel"}">
        ${disponivel ? "Disponível" : "Indisponível"}
      </div>

      <div class="mt-3">
        <button class="btn btn-primary-custom w-100" ${!disponivel ? "disabled" : ""} onclick="irParaSolicitacao('${item.nome}')">
          <i class="bi bi-arrow-right-circle me-2" aria-hidden="true"></i>Solicitar empréstimo
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

busca.addEventListener("input", () => {
  const termo = busca.value.toLowerCase();

  const filtrados = materiais.filter((item) =>
    item.nome.toLowerCase().includes(termo),
  );

  renderizar(filtrados);
});

renderizar(materiais);

function irParaSolicitacao(material) {
  localStorage.setItem("materialSelecionado", material);
  window.location.href = "solicitar.html";
}
