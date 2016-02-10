FROM ubuntu:trusty
ENV DEBIAN_FRONTEND noninteractive

#install node
RUN sudo apt-get update
RUN sudo apt-get -qq update
RUN sudo apt-get install -y nodejs npm
RUN sudo update-alternatives --install /usr/bin/node node /usr/bin/nodejs 10

#install mongodb
RUN sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo "deb http://downloads-distro.mongodb.org/repo/debian-sysvinit dist 10gen" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.2.list
RUN sudo apt-get update
RUN sudo apt-get install -y mongodb-org

# Create app directory
RUN sudo mkdir /src

COPY . /src
WORKDIR /src
# Install app dependencies
RUN npm install
RUN chmod +x start.sh
EXPOSE 8888
CMD [ "npm", "start" ]

