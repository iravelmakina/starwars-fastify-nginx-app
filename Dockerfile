# base image
FROM nginx:latest

# installing tools, nodejs and cleaning up
RUN apt-get update && apt-get install -y curl gnupg supervisor \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# copying nginx configuration and serving static files
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY static /home/html

# setting up nodejs application
COPY package.json /home/package.json
COPY src/main.js /home/main.js
COPY node_modules /home/node_modules

# adding supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# starting services
ENTRYPOINT ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
