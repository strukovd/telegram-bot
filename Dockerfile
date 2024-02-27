FROM node:20.11.0
# LABEL org.opencontainers.image.authors="strukovd <strukoff97@gmail.com>"

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

ENV TZ=Asia/Bishkek
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

EXPOSE 7705

CMD [ "npm", "run", "start:prod" ]