FROM node:22-alpine

# Install Docker CLI to execute docker commands on the host socket
# Install sqlite to query Home Assistant DB directly
RUN apk add --no-cache docker-cli sqlite

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
