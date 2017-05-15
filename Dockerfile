FROM dtr-11111111.prod-iae.bsp.gsa.gov/docker-datacenter/node:7.7

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
RUN npm config set registry https://artifactory.helix.gsa.gov/artifactory/api/npm/GS-IAE-Npm
RUN npm install

EXPOSE 3000
CMD npm run prod
