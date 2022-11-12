FROM node:16-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn


FROM node:16-alpine as builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN yarn build


FROM node:16-alpine as runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/build ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./

EXPOSE 3002

CMD ["node", "src/index.js"]
