# install deps
FROM node:20-alpine AS builder
WORKDIR /frontend
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# copy deps and run app
FROM node:20-alpine
WORKDIR /frontend
COPY --from=builder /frontend/ ./
EXPOSE 3000
CMD ["npm", "start"]
