ARG NPM_TOKEN

FROM node:10.15.0-alpine

ARG NPM_TOKEN

RUN apk update
RUN apk add g++ git make openssh python

ENV PYTHON /usr/bin/python

RUN mkdir -p /work-dir

WORKDIR /work-dir

COPY . .

RUN cp ./.circleci/npm/.npmrc ./.npmrc

RUN rm -rf ./node_modules
RUN rm -rf ./client/node_modules
RUN rm -rf ./db/node_modules
RUN rm -rf ./fetcher/node_modules
RUN rm -rf ./pubsub/node_modules
RUN rm -rf ./server/node_modules
RUN yarn cache clean

RUN yarn install --no-optional --pure-lockfile
RUN yarn install:client --no-optional --pure-lockfile
RUN yarn install:db --no-optional --pure-lockfile
RUN yarn install:fetcher --no-optional --pure-lockfile
RUN yarn install:server --no-optional --pure-lockfile
RUN yarn install:pubsub --no-optional --pure-lockfile

RUN yarn build:client
RUN yarn build:db
