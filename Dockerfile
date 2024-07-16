FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

COPY wait-for-it.sh .
RUN chmod +x wait-for-it.sh

EXPOSE 3000

# Command to start the application using wait-for-it.sh and nodemon
CMD ["./wait-for-it.sh", "db:3306", "--timeout=60", "--strict", "--", "npm", "run", "dev"]
