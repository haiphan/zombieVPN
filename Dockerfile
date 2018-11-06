FROM node:10.11-alpine

RUN mkdir -p /app/dist
WORKDIR /app

COPY package.json /app/
COPY tsconfig.json /app/
COPY src /app/src

RUN npm install
RUN npm run build

EXPOSE 9000
CMD npm run start