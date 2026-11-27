const form = document.getElementById("formSolicitacao");

// Máscara do telefone
const telefoneInput = document.getElementById("telefone");

if (telefoneInput) {
  telefoneInput.addEventListener("input", () => {
    const numeros = telefoneInput.value.replace(/\D/g, "").slice(0, 11);

    if (numeros.length === 0) {
      telefoneInput.value = "";
      return;
    }

    if (numeros.length <= 2) {
      telefoneInput.value = "(" + numeros;
      return;
    }

    if (numeros.length <= 10) {
      telefoneInput.value =
        "(" +
        numeros.slice(0, 2) +
        ") " +
        numeros.slice(2, 6) +
        (numeros.length > 6 ? "-" + numeros.slice(6) : "");
      return;
    }

    telefoneInput.value =
      "(" +
      numeros.slice(0, 2) +
      ") " +
      numeros.slice(2, 7) +
      "-" +
      numeros.slice(7);
  });
}

// Validação antes de enviar
if (form) {
  form.addEventListener("submit", (e) => {
    const nome = document.getElementById("nome").value.trim();
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

    if (telefone.length !== 10 && telefone.length !== 11) {
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
}
