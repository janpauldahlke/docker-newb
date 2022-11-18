# Use an existing docker image as base
FROM alpine

# download and install depts
RUN apk add --update bash
RUN apk add --update redis
# tell the image what to do when it starts the container
CMD ["redis-server"]