# specify base image
FROM node:alpine
#create workdir fopr node > 15
WORKDIR /usr/app
# copy assets to container
COPY ./ /usr/app/
# install depts
RUN npm install
# Default command
CMD ["npm", "start"]