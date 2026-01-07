.PHONY: help setup up down restart logs logs-backend logs-frontend logs-db shell-backend shell-frontend shell-db psql db-reset test lint format clean

# Cores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RESET  := \033[0m

##@ Ajuda

help: ## Exibe esta mensagem de ajuda
	@printf "$(BLUE)╔═══════════════════════════════════════════════════════╗$(RESET)\n"
	@printf "$(BLUE)║         TMDigital - Comandos de Desenvolvimento       ║$(RESET)\n"
	@printf "$(BLUE)╚═══════════════════════════════════════════════════════╝$(RESET)\n"
	@awk 'BEGIN {FS = ":.*##"; printf "\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2 } /^##@/ { printf "\n$(YELLOW)%s$(RESET)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Setup

setup: ## Configuração inicial do projeto
	@if [ ! -f .env ]; then cp .env.example .env; fi
	@pnpm install
	@printf "$(GREEN)✓ Setup completo!$(RESET)\n"

install: ## Instala as dependências do projeto
	@pnpm install

##@ Docker

up: ## Inicia todos os containers
	@docker compose up -d

down: ## Para e remove todos os containers
	@docker compose down

restart: down up ## Reinicia todos os containers

build: ## Rebuild das imagens Docker
	@docker compose build --no-cache

rebuild: down build up ## Rebuild completo

##@ Logs

logs: ## Exibe logs de todos os containers
	@docker compose logs -f

logs-backend: ## Exibe logs do backend
	@docker compose logs -f backend

logs-frontend: ## Exibe logs do frontend
	@docker compose logs -f frontend

logs-db: ## Exibe logs do banco de dados
	@docker compose logs -f postgres

##@ Shell

shell-backend: ## Acessa shell do container backend
	@docker compose exec backend sh

shell-frontend: ## Acessa shell do container frontend
	@docker compose exec frontend sh

shell-db: ## Acessa shell do container postgres
	@docker compose exec postgres bash

psql: ## Acessa PostgreSQL via psql
	@docker compose exec postgres psql -U postgres -d tmdigital


##@ Desenvolvimento Local

dev-backend: ## Executa backend localmente (sem Docker)
	@pnpm nx serve backend

dev-frontend: ## Executa frontend localmente (sem Docker)
	@pnpm nx serve frontend

##@ Testes

test: ## Executa todos os testes
	@pnpm nx run-many --target=test --all

test-backend: ## Executa testes do backend
	@pnpm nx test backend

test-frontend: ## Executa testes do frontend
	@pnpm nx test frontend

test-watch: ## Executa testes em modo watch
	@pnpm nx test backend --watch

##@ Qualidade

lint: ## Executa linter
	@pnpm nx run-many --target=lint --all

lint-fix: ## Executa linter e corrige automaticamente
	@pnpm nx run-many --target=lint --all --fix

format: ## Formata o código
	@pnpm prettier --write .

##@ Limpeza

clean: ## Remove node_modules, dist e cache
	@rm -rf node_modules dist .nx
	@printf "$(GREEN)✓ Limpeza completa!$(RESET)\n"

clean-docker: down ## Para containers e remove imagens
	@docker rmi $$(docker images -q tmdigital-* 2>/dev/null) 2>/dev/null || true
	@printf "$(GREEN)✓ Imagens removidas!$(RESET)\n"

clean-all: clean clean-docker ## Limpeza completa (código + Docker)
	@docker compose down -v
	@printf "$(GREEN)✓ Limpeza total completa!$(RESET)\n"
