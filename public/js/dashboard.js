// ── Proteção da página: confirma que está autenticado ────────
async function verificarAutenticacao() {
  const resposta = await fetch("/api/eu", { credentials: "include" });

  if (!resposta.ok) {
    window.location.href = "/login.html";
    return null;
  }

  const dados = await resposta.json();
  return dados.usuario;
}

// ── Carrega o valor total da carteira ─────────────────────────
async function carregarCarteira() {
  const resposta = await fetch("/api/carteira", { credentials: "include" });
  const dados = await resposta.json();
  document.getElementById("valor-total").textContent =
    `R$ ${dados.valor_total.toFixed(2)}`;
}

// ── Carrega e renderiza a lista de ativos do usuário ──────────
async function carregarAtivos() {
  const resposta = await fetch("/api/ativos", { credentials: "include" });
  const ativos = await resposta.json();
  const container = document.getElementById("lista-ativos");

  if (ativos.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-sm">Nenhum ativo ainda.</p>';
    return;
  }

  container.innerHTML = "";

  for (const ativo of ativos) {
    const resumoResposta = await fetch(`/api/resumo/${ativo.id}`, { credentials: "include" });
    const resumo = await resumoResposta.json();

    const corLucro = resumo.lucro_prejuizo >= 0 ? "text-green-600" : "text-red-600";

    const div = document.createElement("div");
    div.className = "border border-gray-200 rounded-md p-4 flex justify-between items-center";
    div.innerHTML = `
      <div>
        <p class="font-semibold text-gray-800">${ativo.nome} <span class="text-gray-400 text-xs">(${ativo.tipo})</span></p>
        <p class="text-sm text-gray-500">Quantidade: ${resumo.quantidade_total}</p>
      </div>
      <div class="text-right">
        <p class="text-gray-800">R$ ${resumo.valor_atual.toFixed(2)}</p>
        <p class="text-sm ${corLucro}">${resumo.lucro_prejuizo >= 0 ? "+" : ""}R$ ${resumo.lucro_prejuizo.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(div);
  }
}

// ── Formulário de novo aporte ──────────────────────────────────
const formAporte = document.getElementById("form-aporte");
const mensagemErroAporte = document.getElementById("mensagem-erro-aporte");

formAporte.addEventListener("submit", async (e) => {
  e.preventDefault();
  mensagemErroAporte.classList.add("hidden");

  const ticker = document.getElementById("ticker").value.toUpperCase().trim();
  const tipo = document.getElementById("tipo").value;
  const precoAtualNovo = document.getElementById("preco-atual-novo").value;

  try {
    // Garante que o ativo existe (cria se não existir)
    const respostaAtivo = await fetch("/api/ativos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        nome: ticker,
        tipo: tipo || "ação",
        preco_atual: parseFloat(precoAtualNovo) || 0,
      }),
    });
    const ativo = await respostaAtivo.json();

    const respostaAporte = await fetch("/api/aportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        ativo_id: ativo.id,
        quantidade: parseFloat(document.getElementById("quantidade").value),
        preco_unitario: parseFloat(document.getElementById("preco-unitario").value),
        data: document.getElementById("data").value,
      }),
    });

    const dadosAporte = await respostaAporte.json();

    if (!respostaAporte.ok) {
      mensagemErroAporte.textContent = dadosAporte.erro || "Erro ao adicionar aporte.";
      mensagemErroAporte.classList.remove("hidden");
      return;
    }

    formAporte.reset();
    await carregarCarteira();
    await carregarAtivos();
  } catch (err) {
    mensagemErroAporte.textContent = "Erro de conexão com o servidor.";
    mensagemErroAporte.classList.remove("hidden");
  }
});

// ── Logout ──────────────────────────────────────────────────
document.getElementById("btn-logout").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "include" });
  window.location.href = "/login.html";
});

// ── Inicialização da página ────────────────────────────────────
(async function init() {
  const usuario = await verificarAutenticacao();
  if (!usuario) return;

  document.getElementById("nome-usuario").textContent = usuario.nome;
  await carregarCarteira();
  await carregarAtivos();
})();