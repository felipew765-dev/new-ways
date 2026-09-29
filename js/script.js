
const form = document.querySelector("#cadastroForm");
const message = document.querySelector("#formMessage");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      message.textContent = "Revise os campos destacados antes de enviar.";
      message.style.color = "#b24b4b";
      return;
    }

    message.textContent = "Cadastro validado com sucesso! Esta demonstração não envia dados para um servidor.";
    message.style.color = "#176b4b";
    form.reset();
  });
}
