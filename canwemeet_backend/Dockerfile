# install deps
FROM node:20-alpine AS builder
WORKDIR /backend
COPY package*.json ./
RUN npm ci
COPY . .

# copy deps and run app
FROM node:20-alpine
WORKDIR /backend
COPY --from=builder /backend/ ./
RUN npm ci
EXPOSE 1234
CMD node app.js
