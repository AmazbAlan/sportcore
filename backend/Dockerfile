# backend/Dockerfile
FROM node:20

WORKDIR /srv/app

COPY . .

RUN npm install
RUN npm run build

EXPOSE 1337

CMD ["npm", "run", "develop"]
