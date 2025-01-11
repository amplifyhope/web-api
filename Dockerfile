FROM node:20-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn

FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV production


COPY --from=deps /app/node_modules ./node_modules
COPY . .

EXPOSE 3002

CMD ["yarn", "start"]
