# Carteira de Investimentos

Aplicação web fullstack para acompanhamento de aportes em ativos financeiros (ações, FIIs e criptomoedas), com autenticação JWT e isolamento de dados entre usuários.

🔗 **[Acesse o site](https://mvp-site-investimentos-production.up.railway.app/login.html)**

---

## Funcionalidades

- Cadastro e login de usuários com senha criptografada (bcrypt)
- Autenticação stateless via JWT armazenado em cookie `httpOnly`
- Dashboard com valor total da carteira em tempo real
- Registro de aportes por ticker (quantidade, preço pago, data)
- Resumo por ativo: quantidade total, valor atual, lucro/prejuízo
- Isolamento completo de dados: cada usuário vê e gerencia apenas os próprios aportes
- Logout com limpeza de sessão

---

## Tecnologias

**Backend**
- Node.js + Express 5
- SQLite com better-sqlite3
- JWT (jsonwebtoken) para autenticação
- bcrypt para hash de senhas
- dotenv para variáveis de ambiente

**Frontend**
- HTML, CSS e JavaScript puro
- Tailwind CSS
- Fetch API com `credentials: "include"` para envio automático de cookies

---

## Arquitetura

```
projeto/
├── server.js        # Servidor Express: rotas, middlewares, autenticação
├── database.js      # Conexão SQLite e funções de acesso ao banco
├── seed.js          # Script de população inicial de ativos
├── input.css        # Entrada do Tailwind CSS
├── .env             # Variáveis de ambiente (não versionado)
└── public/
    ├── login.html
    ├── cadastro.html
    ├── dashboard.html
    ├── css/
    │   └── output.css   # CSS compilado pelo Tailwind
    └── js/
        ├── login.js
        ├── cadastro.js
        └── dashboard.js
```

---

## Segurança

- Senhas nunca armazenadas em texto puro — hash com bcrypt (custo 12)
- Token JWT assinado com segredo de 64 bytes gerado aleatoriamente
- Cookie `httpOnly` impede acesso ao token via JavaScript (proteção contra XSS)
- Cookie `sameSite: lax` mitiga ataques CSRF
- Cookie `secure: true` em produção (somente HTTPS)
- Queries com prepared statements — sem risco de SQL injection
- `usuario_id` sempre extraído do token verificado, nunca do corpo da requisição — impede que um usuário manipule dados de outro
- Mensagem de erro genérica no login (não revela se o e-mail existe)
- Ativos são somente leitura via API — criação e atualização de preços feita via script interno

---

## Como rodar localmente

**Pré-requisitos:** Node.js 18+

```bash
# Clonar o repositório
git clone https://github.com/EnzoFSouza/MVP-Site-Investimentos.git
cd MVP-Site-investimentos

# Instalar dependências
npm install

# Criar o arquivo de variáveis de ambiente
cp .env.example .env
# Edite o .env e preencha JWT_SECRET com um valor seguro:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Popular o banco com os ativos iniciais
node seed.js

# Em terminais separados:
npm run dev   # inicia o servidor (porta 3000)
npm run css   # compila o Tailwind em modo watch
```

Acesse `http://localhost:3000` no navegador.

---

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `JWT_SECRET` | Segredo para assinatura dos tokens JWT (mín. 64 bytes aleatórios) |
| `NODE_ENV` | `development` ou `production` |
| `PORT` | Porta do servidor (injetada automaticamente pela Railway) |

---

## API — Rotas principais

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/registro` | ✗ | Cria um novo usuário |
| POST | `/api/login` | ✗ | Autentica e emite o cookie JWT |
| POST | `/api/logout` | ✗ | Remove o cookie de sessão |
| GET | `/api/eu` | ✓ | Retorna os dados do usuário logado |
| GET | `/api/ativos` | ✓ | Lista ativos em que o usuário tem aportes |
| POST | `/api/aportes/ticker` | ✓ | Registra um aporte por nome do ticker |
| GET | `/api/aportes` | ✓ | Lista todos os aportes do usuário |
| DELETE | `/api/aportes/:id` | ✓ | Remove um aporte do usuário |
| GET | `/api/resumo/:ativo_id` | ✓ | Resumo financeiro de um ativo |
| GET | `/api/carteira` | ✓ | Valor total da carteira |