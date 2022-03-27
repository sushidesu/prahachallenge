FROM alpine:latest
RUN apk add --no-cache nodejs npm
ADD package.json .
ADD ./src ./src
ADD ./prisma ./prisma
ENV DATABASE_URL=postgresql://root:prisma2020@localhost:5400/prisma
RUN npm install --legacy-peer-deps && npm run build && npx prisma generate
CMD ["node", "dist/main.js"]
