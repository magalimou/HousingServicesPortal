FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos package.json y package-lock.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Copiar wait-for-it.sh y darle permisos de ejecución
COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Exponer el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación usando wait-for-it.sh
CMD ["./wait-for-it.sh", "db:3306", "--timeout=60", "--strict", "--", "node", "src/index.js"]
