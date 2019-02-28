FROM node:8-alpine

EXPOSE 3009

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
ADD package.json package_symlinks.js yarn.lock /app/

ADD . /app

RUN cd /app/ && yarn --pure-lockfile

WORKDIR /app

CMD ["yarn", "docker:start"]
