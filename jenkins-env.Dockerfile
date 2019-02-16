FROM node:10
RUN npm config set registry https://repo.hzky.xyz/repository/npm/
RUN npm install -g gulp-cli