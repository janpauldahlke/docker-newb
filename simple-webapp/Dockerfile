# specify base image
FROM node:alpine

#create workdir for node > 15 is needed
# left is entry point seen from `dockerfile build .`
# right is target inside container filesystem
WORKDIR /usr/simple-webapp

# copy assets to container
COPY ./package.json /usr/simple-webapp/
# install depts
RUN npm install
# now copy all of the rest, to avoid another npm run install
COPY ./ ./usr/simple-webapp

# Default command
CMD ["npm", "start"]