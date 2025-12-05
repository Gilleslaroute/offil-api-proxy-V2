FROM node:18-slim

# Dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm install --omit=dev

# Copier le reste du code
COPY . .

# Cloud Run impose $PORT
ENV PORT=8080

# Exposer ce port
EXPOSE 8080

# Lancer l’app Node
CMD ["node", "index.js"]
