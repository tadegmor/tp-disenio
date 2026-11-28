# Nombre de imagen completo (docker.io/...): Podman lo exige y Docker lo acepta igual
FROM docker.io/library/node:22-alpine
WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el proyecto y compilar para producción
COPY . .

ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV BACKEND_URL=http://backend:8080

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]