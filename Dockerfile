# syntax=docker/dockerfile:1

FROM node:lts-slim

ENV NODE_ENV=production

WORKDIR /spido

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

