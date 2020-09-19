FROM ubuntu:20.04

# activate debian non interactiv mode
ARG DEBIAN_FRONTEND=noninteractive


# set locale info
ENV TZ=Europe/Berlin

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install r-base r-base-dev -y
RUN apt-get install locales -y


# user / home and working directory
RUN useradd docker \
	&& mkdir /home/docker \
	&& chown docker:docker /home/docker \
	&& addgroup docker staff


# http server
RUN apt-get install python3 -y


# switch user and directory
USER docker
WORKDIR /home/docker


# files 
COPY ./ ./

# starting up services
EXPOSE 8000
CMD python3 -m http.server 8000

