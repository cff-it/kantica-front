.PHONY: up-dev

# Développement : Vite avec HMR (http://localhost:5173 par défaut).
# Port hôte déjà pris ? DEV_PORT=5174 make up-dev
up-dev:
	docker compose --profile dev up --build dev
