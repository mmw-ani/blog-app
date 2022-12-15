FROM node:alpine
WORKDIR /usr/src/app
COPY package*.json .
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["sh","-c", "node seeders.js ;node index.js" ]