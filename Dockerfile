FROM node:22-alpine

WORKDIR /app

RUN chown -R node:node /app
USER node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "run", "dev"] 