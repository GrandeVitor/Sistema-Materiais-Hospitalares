function showTab(tabId, btn) {
  const tabs = document.querySelectorAll(".tab-content");
  tabs.forEach((tab) => tab.classList.remove("active"));

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((b) => b.classList.remove("active"));

  document.getElementById(tabId).classList.add("active");
  btn.classList.add("active");
}

// Normaliza o texto para a pesquisa ignorar acentos
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Configura as pesquisas das abas administrativas
document.querySelectorAll(".pesquisa-admin").forEach((form) => {
  const campoBusca = form.querySelector('input[type="text"]');

  const idResultados = form.dataset.resultados;
  const seletorItem = form.dataset.item;

  if (!campoBusca || !idResultados || !seletorItem) {
    return;
  }

  const container = document.getElementById(idResultados);

  if (!container) {
    console.warn("Container de pesquisa não encontrado:", idResultados);
    return;
  }

  const itens = Array.from(container.querySelectorAll(seletorItem));

  // Impede que a pesquisa recarregue a página
  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  // Mensagem exibida quando a pesquisa não encontra resultados
  const mensagemVazia = document.createElement("div");

  mensagemVazia.className =
    "empty-state p-4 text-center pesquisa-sem-resultados";

  mensagemVazia.textContent = "Nenhum resultado encontrado.";

  mensagemVazia.style.display = "none";

  container.appendChild(mensagemVazia);

  function filtrarResultados() {
    const pesquisa = normalizarTexto(campoBusca.value.trim());

    let encontrados = 0;

    itens.forEach((item) => {
      const textoItem = normalizarTexto(item.textContent);

      const corresponde = textoItem.includes(pesquisa);

      item.style.display = corresponde ? "" : "none";

      if (corresponde) {
        encontrados++;
      }
    });

    mensagemVazia.style.display = encontrados === 0 ? "" : "none";
  }

  // Filtra enquanto o usuário digita
  campoBusca.addEventListener("input", filtrarResultados);

  // Aplica a pesquisa inicial
  filtrarResultados();
});
