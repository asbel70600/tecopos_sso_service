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
COPY --from=development /app/prisma ./prisma

RUN npx prisma generate
EXPOSE 3000

CMD ["node", "dist/src/main"]
