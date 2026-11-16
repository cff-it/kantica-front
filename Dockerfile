# syntax=docker/dockerfile:1

# Vite 8 requiert Node 20.19+ ou 22.12+ ; on aligne sur la version locale (24).
ARG NODE_VERSION=24-alpine
ARG NGINX_VERSION=1-alpine

# ---------------------------------------------------------------------------
# Dépendances : couche mise en cache tant que les fichiers de lock ne changent pas
# ---------------------------------------------------------------------------
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# ---------------------------------------------------------------------------
# Développement : serveur Vite avec HMR (voir docker-compose.yml, profil "dev")
# ---------------------------------------------------------------------------
FROM deps AS dev
ENV NODE_ENV=development

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---------------------------------------------------------------------------
# Build : tsc -b puis vite build, sortie dans /app/dist
# ---------------------------------------------------------------------------
FROM deps AS build

COPY . .
RUN npm run build

# ---------------------------------------------------------------------------
# Production : nginx non-root qui sert les fichiers statiques
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:${NGINX_VERSION} AS prod

# Gabarit traité par envsubst au démarrage (mécanisme de l'image nginx) : le
# résultat est écrit dans /etc/nginx/conf.d/default.conf.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# Back Laravel joignable depuis le conteneur. Par défaut : le back lancé sur
# l'hôte (port 8008). À surcharger au lancement pour un autre environnement.
ENV API_UPSTREAM=http://host.docker.internal:8008

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -q --spider http://127.0.0.1:8080/ || exit 1
