const form = document.getElementById("form-cadastro");
const mensagemErro = document.getElementById("mensagem-erro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagemErro.classList.add("hidden");

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch("/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nome, email, senha }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemErro.textContent = dados.erro || "Erro ao criar conta.";
      mensagemErro.classList.remove("hidden");
      return;
    }

    window.location.href = "/login.html";
  } catch (err) {
    mensagemErro.textContent = "Erro de conexão com o servidor.";
    mensagemErro.classList.remove("hidden");
  }
});