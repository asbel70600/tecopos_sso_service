FROM node:25-alpine AS development

WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install
COPY . .
RUN npx prisma generate
RUN npm run build


FROM node:25-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install --only=production
COPY --from=development /app/dist ./dist
COPY --from=development /app/prisma.config.ts .

RUN npx prisma init --datasource-provider postgresql --output ../generated/prisma
RUN mv prisma/schema.prisma prisma/schema.prisma.old
COPY --from=development /app/prisma/schema.prisma prisma/schema.prisma
RUN mkdir -p prisma/migrations/0_init
RUN sh -c "npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql"


EXPOSE 3000

CMD npx prisma migrate dev --name init && npx prisma generate && node dist/src/main.js
