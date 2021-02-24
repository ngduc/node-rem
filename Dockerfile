FROM node:8-alpine

EXPOSE 3009

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
ADD package.json package-lock.json /app/

ADD . /app

RUN cd /app/ && npm install

WORKDIR /app

CMD ["npm", "run docker:start"]
