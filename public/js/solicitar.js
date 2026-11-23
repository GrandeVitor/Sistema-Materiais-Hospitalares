
const form = document.getElementById("formSolicitacao");

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

// Validação antes de enviar
form.addEventListener("submit", (e) => {
  const nome = document.getElementById("nome").value.trim();
  const cpf = cpfInput.value.replace(/\D/g, "");
  const telefone = telefoneInput.value.replace(/\D/g, "");
  const rua = document.getElementById("rua").value.trim();
  const bairro = document.getElementById("bairro").value.trim();
  const cidade = document.getElementById("cidade").value.trim();
  const material = document.getElementById("material").value;

  if (nome.length < 3) {
    e.preventDefault();
    alert("Nome deve ter pelo menos 3 caracteres.");
    return;
  }

  if (cpf.length !== 11) {
    e.preventDefault();
    alert("CPF inválido.");
    return;
  }

  if (telefone.length !== 11) {
    e.preventDefault();
    alert("Telefone inválido.");
    return;
  }

  if (!rua || !bairro || !cidade) {
    e.preventDefault();
    alert("Preencha Rua, Bairro e Cidade.");
    return;
  }

  if (!material) {
    e.preventDefault();
    alert("Selecione um material.");
    return;
  }
});
