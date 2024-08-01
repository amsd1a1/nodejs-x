FROM nginx:latest
EXPOSE 80
WORKDIR /app
USER root

COPY nginx.conf /etc/nginx/nginx.conf
COPY . ./

RUN chmod +x ./entrypoint.sh
RUN chmod +x ./serv/xv

RUN apt-get update && apt-get install -y iproute2 systemctl


ENTRYPOINT [ "./entrypoint.sh" ]