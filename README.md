# TMDigital

Monorepo Nx com backend NestJS, frontend Angular e PostgreSQL + PostGIS.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) v20+
- [pnpm](https://pnpm.io/) v10.27.0
- [Docker](https://www.docker.com/) e Docker Compose
- [Make](https://www.gnu.org/software/make/) (opcional, mas recomendado)

## 🚀 Início Rápido

### 1. Setup Inicial

```bash
# Clone o repositório
git clone https://github.com/Igorjr19/tmdigital.git
cd tmdigital

# Configure o ambiente e instale dependências
make setup
```

O comando `setup` irá:
- Criar o arquivo `.env` a partir do `.env.example`
- Instalar todas as dependências do projeto

### 2. Iniciar o Ambiente de Desenvolvimento

```bash
# Inicia todos os serviços (PostgreSQL, Backend, Frontend)
make up
```

A aplicação estará disponível em:
- **Frontend**: http://localhost:4200
- **Backend**: http://localhost:3000/api
- **Database**: localhost:5432

## 📦 Comandos Disponíveis

### Docker

```bash
make up          # Inicia todos os containers
make down        # Para e remove todos os containers
make restart     # Reinicia todos os containers
make build       # Rebuild das imagens Docker
make rebuild     # Rebuild completo (down + build + up)
```

### Logs

```bash
make logs              # Exibe logs de todos os containers
make logs-backend      # Exibe logs do backend
make logs-frontend     # Exibe logs do frontend
make logs-db           # Exibe logs do banco de dados
```

### Shell e Banco de Dados

```bash
make shell-backend     # Acessa shell do container backend
make shell-frontend    # Acessa shell do container frontend
make shell-db          # Acessa shell do container postgres
make psql              # Acessa PostgreSQL via psql
make db-reset          # Reseta o banco de dados (apaga todos os dados)
```

### Desenvolvimento Local (sem Docker)

```bash
make dev-backend       # Executa backend localmente
make dev-frontend      # Executa frontend localmente
```

> **Nota**: Para desenvolvimento local sem Docker, você precisará configurar o PostgreSQL manualmente.

### Testes

```bash
make test              # Executa todos os testes
make test-backend      # Executa testes do backend
make test-frontend     # Executa testes do frontend
make test-watch        # Executa testes em modo watch
```

### Qualidade de Código

```bash
make lint              # Executa linter
make lint-fix          # Executa linter e corrige automaticamente
make format            # Formata o código com Prettier
```

### Limpeza

```bash
make clean             # Remove node_modules, dist e cache
make clean-docker      # Para containers e remove imagens
make clean-all         # Limpeza completa (código + Docker + volumes)
```

## 🏗️ Estrutura do Projeto

```
tmdigital/
├── apps/
│   ├── backend/          # API NestJS
│   ├── backend-e2e/      # Testes E2E do backend
│   ├── frontend/         # Aplicação Angular
│   └── frontend-e2e/     # Testes E2E do frontend
├── docker-compose.yml    # Configuração Docker
├── Makefile             # Comandos de desenvolvimento
├── .env.example         # Variáveis de ambiente de exemplo
└── package.json         # Dependências do workspace
```

## 🔧 Configuração

### Variáveis de Ambiente

Copie `.env.example` para `.env` e ajuste as variáveis conforme necessário:

```env
# PostgreSQL
POSTGRES_DB=tmdigital
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

# Backend
BACKEND_PORT=3000

# Frontend
FRONTEND_PORT=4200
API_URL=http://localhost:3000
```

## 💡 Dicas

- Use `make help` para ver todos os comandos disponíveis
- Os volumes Docker garantem hot reload durante o desenvolvimento
- O banco de dados persiste entre reinicializações dos containers
- Use `make logs` para debug em tempo real

## 📚 Documentação

- [NestJS](https://nestjs.com/)
- [Angular](https://angular.dev/)
- [Nx](https://nx.dev/)
- [PostGIS](https://postgis.net/)

## 📝 Licença

ISC
