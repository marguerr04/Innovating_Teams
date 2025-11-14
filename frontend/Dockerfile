# --- ETAPA 1: "Build" (Construcción) ---
# Usamos una imagen oficial de Node.js 18 para construir el proyecto
FROM node:18-alpine AS builder

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos el package.json y package-lock.json primero
# Esto aprovecha el caché de Docker y solo reinstala si las dependencias cambian
COPY package.json package-lock.json ./

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto del código fuente de tu proyecto (src, public, etc.)
#
COPY . .

# Ejecutamos el script de build (definido en package.json)
RUN npm run build

# --- ETAPA 2: "Serve" (Producción) ---
# Usamos una imagen súper ligera de Nginx para servir los archivos
FROM nginx:alpine

# Eliminamos la configuración por defecto de Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestro propio archivo de configuración de Nginx (que crearemos a continuación)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos estáticos (HTML, JS, CSS) desde la etapa "builder"
# La build de React se crea en la carpeta /app/build
COPY --from=builder /app/build /usr/share/nginx/html

# Exponemos el puerto 80 (en el que Nginx escucha por defecto)
EXPOSE 80

# Comando para iniciar el servidor Nginx cuando el contenedor se ejecute
CMD ["nginx", "-g", "daemon off;"]