# Transpile Typescript to Javascript
FROM node:18-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --development

COPY . .

RUN npm run build

# Setup production environment
FROM node:18-alpine as production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

USER node

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]