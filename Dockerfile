# Schritt 1: Build
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Schritt 2: Produktionsimage
FROM node:20

WORKDIR /app

COPY --from=build /app ./
# RUN npm prune --production

EXPOSE 4173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
