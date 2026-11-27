# Stage 1: Build React + Vite app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# Empty VITE_BACKEND_URL so API calls use same-origin relative /api/...
# which Nginx proxies to presensi-app:3000 (works from any LAN IP / phone)
ENV VITE_BACKEND_URL=""
RUN npx vite build

# Stage 2: Serve with Nginx (HTTP + self-signed HTTPS for phone camera/GPS)
FROM nginx:alpine

RUN apk add --no-cache openssl && \
    mkdir -p /etc/nginx/ssl && \
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
      -keyout /etc/nginx/ssl/selfsigned.key \
      -out /etc/nginx/ssl/selfsigned.crt \
      -subj "/C=ID/ST=Sumsel/L=Palembang/O=SMK Xaverius/CN=192.168.1.10" \
      -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:192.168.1.10"

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
