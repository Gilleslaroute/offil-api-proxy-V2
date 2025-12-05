FROM node:18-slim

# Empêche Cloud Run d'utiliser un ancien cache
ENV NODE_ENV=production

# Dossier de travail
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install --omit=dev

# Copier tout le code de l'API
COPY . .

# Cloud Run impose cette variable
ENV PORT=8080

EXPOSE 8080

CMD ["node", "index.js"]

