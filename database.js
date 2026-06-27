import Database from "better-sqlite3";

const db = new Database("carteira.db");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    nome       TEXT    NOT NULL,
    email      TEXT    NOT NULL UNIQUE,
    senha_hash TEXT    NOT NULL,
    criado_em  TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS ativos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    nome        TEXT    NOT NULL UNIQUE,
    tipo        TEXT    NOT NULL,
    preco_atual REAL    NOT NULL
  );

  CREATE TABLE IF NOT EXISTS aportes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id     INTEGER NOT NULL,
    ativo_id       INTEGER NOT NULL,
    quantidade     REAL    NOT NULL,
    preco_unitario REAL    NOT NULL,
    data           TEXT    NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (ativo_id)   REFERENCES ativos(id)   ON DELETE RESTRICT
  );

  CREATE INDEX IF NOT EXISTS idx_aportes_usuario       ON aportes(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_aportes_ativo_usuario ON aportes(ativo_id, usuario_id);
`);

//ON DELETE CASCADE: se um usuário for deletado, os aportes dele somem junto.
//ON DELETE RESTRICT: impede deletar um ativo que ainda tem aportes vinculados
export default db;