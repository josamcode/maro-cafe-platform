FROM node:24-bookworm-slim AS build
WORKDIR /workspace
RUN npm install --global pnpm@11.17.0
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm exec turbo run build --filter=@maro/api
RUN pnpm --filter @maro/api deploy --legacy --prod /release

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production API_HOST=0.0.0.0 API_PORT=4000 UPLOAD_DIR=/data/uploads
WORKDIR /app
COPY --from=build --chown=node:node /release ./
COPY --from=build --chown=node:node /workspace/scripts/provision-admin.mjs ./scripts/provision-admin.mjs
COPY --from=build --chown=node:node /workspace/scripts/import-catalog.mjs ./scripts/import-catalog.mjs
COPY --from=build --chown=node:node /workspace/scripts/catalog-source ./scripts/catalog-source
RUN mkdir -p /data/uploads && chown -R node:node /data
USER node
EXPOSE 4000
CMD ["node", "dist/server.js"]
