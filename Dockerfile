FROM node:23.4-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3155

CMD ["node", "server.js"]
