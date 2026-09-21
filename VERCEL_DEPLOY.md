# Guia de Publicação na Vercel com Banco de Dados Postgres

Este projeto já está **100% preparado e configurado** para publicação na **Vercel**, incluindo:
- Arquivo de rotas e segurança `vercel.json` (SPA fallback + API Serverless).
- SDK `@vercel/postgres` integrado com tabelas automáticas (`users`, `service_requests`, `provider_quotes`, `chat_messages`).
- Funções Serverless em `/api` para triagem com IA e persistência de dados.

---

## Passo a Passo para Publicar na Vercel em 3 Minutos:

### 1. Exportar para o seu GitHub
1. No menu superior do Google AI Studio, clique em **Settings** (ou botão de exportação) e selecione **"Export to GitHub"** (ou faça o download do arquivo ZIP e suba em um novo repositório no seu GitHub).

### 2. Importar o Projeto na Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique no botão **"Add New..."** ➔ **"Project"**.
3. Selecione o repositório do seu app que você acabou de criar.
4. O framework será detectado automaticamente como **Vite**.
5. Em **Environment Variables**, adicione a chave do Gemini (se quiser análise por IA):
   - `GEMINI_API_KEY` = sua chave de API do Gemini.
6. Clique em **"Deploy"**.

---

### 3. Conectar o Banco de Dados Vercel Postgres em 1 Clique
1. Após o deploy, no painel do seu projeto na Vercel, clique na aba **"Storage"**.
2. Clique em **"Create Database"** e escolha **"Postgres"** (alimentado por Neon Serverless).
3. Dê um nome (ex: `proservicos-db`) e escolha a região mais próxima (ex: `Washington D.C. / us-east-1` ou `São Paulo / sa-east-1` se disponível).
4. Clique em **"Create"** e depois no botão **"Connect to Project"**.
5. A Vercel injeta automaticamente todas as variáveis (`POSTGRES_URL`, etc.) nas suas variáveis de ambiente!

---

### 4. Inicializar as Tabelas no Banco
Com o banco conectado, basta fazer uma requisição POST para a rota:
`https://seu-app.vercel.app/api/init-db`

Ou clicar no botão **"Status do Banco Vercel"** diretamente no cabeçalho do aplicativo web. As tabelas serão criadas instantaneamente!
