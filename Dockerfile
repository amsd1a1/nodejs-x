FROM node:latest
EXPOSE 3000

COPY ./ /app
WORKDIR /app

RUN apt-get update
RUN apt-get install -y iproute2
RUN apt-get install -y unzip
RUN npm install -r package.json
RUN chmod +x nginx

ENTRYPOINT [ "node", "server.js" ]