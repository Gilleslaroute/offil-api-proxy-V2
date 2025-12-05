# Runtime Node officiel
FROM node:18-slim

# Dossier app
WORKDIR /app

# Installer les dépendances
COPY package*.json ./
RUN npm install --omit=dev

# Copier le code (API + routes)
COPY . .

# Cloud Run impose PORT
ENV PORT=8080

# Exposer ce port
EXPOSE 8080

# Lancer le serveur
CMD ["node", "index.js"]

