FROM node:18

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN npm install -g typescript && npm install ts-node
RUN yarn install

COPY . .

RUN npm install
RUN npm run build


EXPOSE ${APP_PORT}

CMD ["./entrypoint.sh"]
