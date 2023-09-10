FROM node:18

# Install postgresql client
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD [ "npm run dbMigrate && npm run start" ]