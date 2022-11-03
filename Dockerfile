FROM node:16-alpine
WORKDIR /app
ARG NODE_ENV
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "yarn.lock","./"]
RUN npm i yarn
RUN if ["$NODE_ENV" = "development"]; then yarn install; else yarn install --production; fi
COPY . .
EXPOSE 5000
RUN chown -R node /app
USER node
CMD ["yarn", "start"]
