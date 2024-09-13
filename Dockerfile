FROM node:20 as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist/app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY mime.types /etc/nginx/mime.types
COPY /caminho/correto/para/ssl/cert.crt /etc/ssl/certs/cert.crt
COPY /caminho/correto/para/ssl/cert.key /etc/ssl/private/cert.key
EXPOSE 80
EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]