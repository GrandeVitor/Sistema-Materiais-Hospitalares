const form = document.getElementById("formSolicitacao");
const selectMaterial = document.getElementById("material");

const cpfInput = document.getElementById("cpf");

cpfInput.addEventListener("input", () => {
  let valor = cpfInput.value.replace(/\D/g, "").slice(0, 11);

  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
  valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  cpfInput.value = valor;
});

const telefoneInput = document.getElementById("telefone");

telefoneInput.addEventListener("input", () => {
  let valor = telefoneInput.value.replace(/\D/g, "").slice(0, 11);

  valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
  valor = valor.replace(/(\d{5})(\d)/, "$1-$2");

  telefoneInput.value = valor;
});

const materiais = JSON.parse(localStorage.getItem("materiais")) || [];

materiais.forEach((item) => {
  const option = document.createElement("option");

  option.value = item.nome;
  option.textContent = item.nome;

  if (item.quantidade === 0) {
    option.disabled = true;
    option.textContent += " (Indisponível)";
  }

  selectMaterial.appendChild(option);
});

const materialSalvo = localStorage.getItem("materialSelecionado");

if (materialSalvo) {
  selectMaterial.value = materialSalvo;
  localStorage.removeItem("materialSelecionado");
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.replace(/\D/g, "");
  const telefone = document.getElementById("telefone").value.replace(/\D/g, "");
  const email = document.getElementById("email").value.trim();
  const rua = document.getElementById("rua").value.trim();
  const numero = document.getElementById("numero").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const complemento = document.getElementById("complemento").value.trim();
  const material = document.getElementById("material").value;

  if (nome.length < 3) {
    alert("Nome deve ter pelo menos 3 caracteres.");
    return;
  }

  if (cpf.length !== 11) {
    alert("CPF inválido.");
    return;
  }

  if (telefone.length !== 11) {
    alert("Telefone inválido.");
    return;
  }

  if (!email.includes("@") || !email.includes(".")) {
    alert("Email inválido.");
    return;
  }

  if (!rua || !bairro || !cidade) {
    alert("Preencha Rua, Bairro e Cidade.");
    return;
  }

  if (!material) {
    alert("Selecione um material.");
    return;
  }

  const materialSelecionado = materiais.find((m) => m.nome === material);

  const solicitacao = {
    nome,
    cpf,
    telefone,
    email,
    rua,
    numero,
    bairro,
    cidade,
    complemento,
    material: materialSelecionado.nome,
    imagem: materialSelecionado.imagem,
    status: "pendente",
    dataSolicitacao: new Date().toLocaleDateString("pt-BR"),
  };

  const lista = JSON.parse(localStorage.getItem("solicitacoes")) || [];
  lista.push(solicitacao);

  localStorage.setItem("solicitacoes", JSON.stringify(lista));

  const toastElement = document.getElementById("successToast");
  if (toastElement && window.bootstrap) {
    bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 3500 }).show();
  } else {
    alert("Solicitação enviada com sucesso!");
  }

  form.reset();
});
