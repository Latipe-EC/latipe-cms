FROM node:18 as builder

ARG VITE_BASE_URL

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./package-lock.json ./

RUN npm install

COPY . .

ENV VITE_BASE_URL=$VITE_BASE_URL

RUN npm run build


FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install express dotenv http-proxy-middleware compression morgan cors http-status-codes serve-favicon
RUN npm install -g pm2

COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/server ./server
COPY --from=builder /usr/src/app/proccesses.json .
COPY --from=builder /usr/src/app/public ./public

EXPOSE 8000

CMD ["pm2", "startOrReload", "proccesses.json", "--no-daemon"]
