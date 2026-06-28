const form = document.getElementById("form-login");
const mensagemErro = document.getElementById("mensagem-erro");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagemErro.classList.add("hidden");

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  try {
    const resposta = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, senha }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      mensagemErro.textContent = dados.erro || "Erro ao fazer login.";
      mensagemErro.classList.remove("hidden");
      return;
    }

    window.location.href = "/dashboard.html";
  } catch (err) {
    mensagemErro.textContent = "Erro de conexão com o servidor.";
    mensagemErro.classList.remove("hidden");
  }
});