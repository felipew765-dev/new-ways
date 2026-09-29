const form = document.querySelector("#cadastroForm");
const message = document.querySelector("#formMessage");
const cepStatus = document.querySelector("#cepStatus");

const onlyDigits = (value) => value.replace(/\D/g, "");

const masks = {
  cpf(value) {
    return onlyDigits(value)
      .slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  },
  telefone(value) {
    const digits = onlyDigits(value).slice(0, 11);

    if (digits.length <= 10) {
      return digits
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    }

    return digits
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  },
  cep(value) {
    return onlyDigits(value)
      .slice(0, 8)
      .replace(/(\d{5})(\d)/, "$1-$2");
  },
};

function applyMask(input, maskName) {
  if (!input || !masks[maskName]) return;
  input.addEventListener("input", () => {
    input.value = masks[maskName](input.value);
  });
}

async function lookupCep(cepInput) {
  const cep = onlyDigits(cepInput.value);

  if (cep.length !== 8) {
    if (cepStatus) cepStatus.textContent = "";
    return;
  }

  if (cepStatus) cepStatus.textContent = "Buscando endereço pelo CEP...";

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();

    if (data.erro) {
      if (cepStatus) cepStatus.textContent = "CEP não encontrado. Preencha o endereço manualmente.";
      return;
    }

    const endereco = form.querySelector("#endereco");
    const cidade = form.querySelector("#cidade");
    const estado = form.querySelector("#estado");

    if (endereco && !endereco.value) {
      const parts = [data.logradouro, data.bairro].filter(Boolean);
      endereco.value = parts.join(", ");
    }

    if (cidade) cidade.value = data.localidade || cidade.value;
    if (estado && data.uf) estado.value = data.uf;

    if (cepStatus) {
      cepStatus.textContent = "Endereço preenchido com base no CEP. Confira e complete se precisar.";
    }
  } catch (error) {
    if (cepStatus) {
      cepStatus.textContent = "Não foi possível consultar o CEP agora. Preencha o endereço manualmente.";
    }
  }
}

if (form) {
  applyMask(form.querySelector("#cpf"), "cpf");
  applyMask(form.querySelector("#telefone"), "telefone");
  applyMask(form.querySelector("#cep"), "cep");

  const cepInput = form.querySelector("#cep");
  if (cepInput) {
    cepInput.addEventListener("blur", () => lookupCep(cepInput));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      message.textContent = "Revise os campos destacados antes de enviar.";
      message.style.color = "#b24b4b";
      return;
    }

    message.textContent =
      "Cadastro validado com sucesso! Esta demonstração não envia dados para um servidor.";
    message.style.color = "#176b4b";
    if (cepStatus) cepStatus.textContent = "";
    form.reset();
  });
}
