FROM node:hydrogen-alpine

# Create app directory
WORKDIR /usr/src/app

# node-gyp dependencies
RUN apk add --update --no-cache python3 make g++ && rm -rf /var/cache/apk/*

# Files required by pnpm install
COPY package.json package-lock.json ./

RUN npm ci

# App source
COPY . .

CMD [ "npm", "run", "start:dev" ]