FROM node:20-bullseye-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

RUN npm ci --workspaces --include-workspace-root

COPY tsconfig.base.json ./
COPY shared ./shared
COPY server ./server

RUN npm run build -w server

FROM node:20-bullseye-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY shared/package.json shared/package.json

RUN npm ci --omit=dev --workspaces --include-workspace-root

COPY --from=build /app/server/dist /app/server/dist
COPY --from=build /app/server/uploads /app/server/uploads

EXPOSE 5000

CMD ["node", "server/dist/index.js"]
