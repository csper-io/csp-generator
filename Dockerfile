FROM node:latest

WORKDIR /builder

COPY angular.json Makefile package.json ts* ./

RUN npm install 
RUN npm install -g typescript
RUN npm install -g @angular/cli
RUN npm install -g web-ext

COPY src /builder/src
COPY background /builder/background

RUN ls
RUN make release