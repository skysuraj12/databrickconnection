# ---------- Build client ----------
FROM node:20-alpine AS client_build
WORKDIR /client
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

# ---------- Build server ----------
FROM node:20-alpine AS server_build
WORKDIR /server
COPY server/package*.json ./
RUN npm ci
COPY server/ .
RUN npm run build

# ---------- Runtime ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Install server production deps only
COPY server/package*.json ./
RUN npm ci --omit=dev

# Copy compiled server
COPY --from=server_build /server/dist ./dist

# Copy built client into server "public" folder (your code serves process.cwd()/public)
COPY --from=client_build /client/dist ./public

EXPOSE 8080
CMD ["node", "dist/server.js"]