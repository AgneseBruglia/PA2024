FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install -g typescript && npm install ts-node

COPY . .

RUN npm install
RUN npm run build

EXPOSE ${AUTHENTICATION_SERVICES_PORT}

CMD ["node", "server.js"]
