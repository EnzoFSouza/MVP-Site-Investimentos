import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, mensagem: "Servidor funcionando." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});