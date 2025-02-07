FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json .
COPY . .
RUN npm install -g pnpm@latest-10 &&\
    CI=1 pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/build build/
COPY --from=builder /app/node_modules node_modules/
COPY package.json .
EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "build" ]