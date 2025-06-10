# 构建阶段
FROM node:18.19-alpine3.19 AS builder

WORKDIR /app

RUN npm install -g pnpm@10.8.1

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

FROM node:18.19-alpine3.19

WORKDIR /app

RUN npm install -g pnpm@10.8.1

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]