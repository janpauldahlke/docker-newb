# specify base image
FROM node:alpine

WORKDIR '/app'

# copy assets to container
COPY package.json .
# install depts
RUN npm install
# now copy all of the rest, to avoid another npm run install
COPY . . 

# Default command
CMD ["npm", "start"]