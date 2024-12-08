FROM node:18

ARG SETTINGS

ENV API=/home/app/api
ENV SETTINGS=${SETTINGS}

RUN mkdir -p ${API}

WORKDIR ${API}

EXPOSE 8000

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
