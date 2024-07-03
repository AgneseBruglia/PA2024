# Usa un'immagine di Node.js come base
FROM node:14

# Crea e imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia il package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa TypeScript globalmente e ts-node localmente
RUN npm install -g typescript && npm install ts-node

# Copia tutto il resto del codice sorgente nell'immagine Docker
COPY . .

# Installa le dipendenze del progetto
RUN npm install
RUN npm run build

# Espone la porta 3000 per essere raggiungibile da fuori del container
EXPOSE 3000

# Comando per avviare l'applicazione quando il container è avviato
#CMD ["node","sequelize.js", "&&", "node", "&&", "server.js"]
CMD ["node", "server.js"]
