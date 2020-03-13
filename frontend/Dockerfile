FROM node:lts-alpine AS builder
WORKDIR /app

COPY ./device-control/ .
COPY nginx.conf nginx.conf

RUN npm install && \
    npm run ng build 

FROM nginx:alpine
COPY --from=builder /app/dist/device-control/ /usr/share/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

