import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { criarUsuario, buscarUsuarioPorEmail } from "./database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const SALT_ROUNDS = 12;

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

app.use(express.json());
app.use(express.static("public"));

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, mensagem: "Servidor funcionando." });
});

app.post("/api/registro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body ?? {};

    //validações antes do banco
    if (!nome || nome.trim().length < 2) {
      return res.status(400).json({ erro: "Nome deve ter pelo menos 2 caracteres." });
    }
    if (!email || !emailValido(email)) {
      return res.status(400).json({ erro: "E-mail inválido." });
    }
    if (!senha || senha.length < 8) {
      return res.status(400).json({ erro: "Senha deve ter pelo menos 8 caracteres." });
    }

    const emailNormalizado = email.toLowerCase().trim();

    if (buscarUsuarioPorEmail(emailNormalizado)) {
      return res.status(409).json({ erro: "E-mail já cadastrado." });
    }

    //bcrypt é assíncrono de propósito , é intencionalmente lento
    const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
    const resultado = criarUsuario(nome.trim(), emailNormalizado, senhaHash);

    return res.status(201).json({
      mensagem: "Conta criada com sucesso.",
      usuario: { id: resultado.lastInsertRowid, nome: nome.trim() },
    });
  } catch (err) {
    console.error("[registro]", err);
    return res.status(500).json({ erro: "Erro interno." });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});