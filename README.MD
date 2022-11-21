### welcome to docker

> in this repo we follow [this course](https://www.udemy.com/course/docker-and-kubernetes-the-complete-guide/)

#### prequisites
* ensure you follow the installation for your OS
* https://docs.docker.com/engine/install/fedora/#install-using-the-repository
* we chose fedora 37 at this point in time
* create a docker group to avooid the `sudo` hustle all the time
* https://docs.docker.com/engine/install/linux-postinstall/

```
docker login
sudo systemctl start docker
sudo docker run hello-world
```

* to starup docker on systemstart run
```
sudo systemctl enable docker.service
sudo systemctl enable containerd.service
```
##### lifecycle of a container
* `docker run` inits our container and fetches it if possible from the docker-hub -so it is more like a create AND run
* `docker run` = `docker create` + `docker start`
> consider:
* `docker create hello-world` // returns an id like `1e7b5eb62bfb875d23bb94de574a7136c9cf7594151ea0f143a96b2405c8984e`
* `docker start -a <idFromAbove>` // the hello-world container will run of the id where `-a` says give me all output
* an exited container from `docker ps -all` can be started up again! => `docker start -a <id>`

##### commands
* `docker run hello-world` will download from the docker hub if image is not there locally
  * syntax in depth
    > `docker run <image_name>`
    > `docker run <image_name> <command>`
    `docker run busybox echo hi there` where `echo hi there` overrides the defautl command, BUT we can only use commands, that exist as programs/executables inside the container!
    `docker run hello-world ls` will lead into an error, since we do not have ls installed
* `docker images` to check which local files we have on our machine
* `docker ps` --lists all running containers
 > only running containers will be shown
 > `docker run busy-box ping google.com` with lifetime 
* `docker ps --all` shows all containers ever created on this machine and when the ran
* `docker system prune` which will delete
> WARNING! This will remove:
>  - all stopped containers
>  - all networks not used by at least one container
>  - all dangling images
>  - all dangling build cache
* `docker logs <containerId>` //will retrive all emited output from a container, but it does NOT rerun or restart the container
* some docs for us https://linuxhandbook.com/sigterm-vs-sigkill/
* consider:
> `docker create busyboxping ping google.com` returns `<id>`
> `docker start <id>`
> `docker logs <id>`
> `docker ps` returns container id `<id>` is running
> `docker stop <id>` will now stop sends SIGTERM message in a window of 10 seconds, after this SIGKILL is fired, since ping runs forever OR 
> `docker kill <id>` will send SIGKILL message 


* `docker run redis` which will start the redis server BUT will not allow us to make use of the redis-cli
* `docker exec -it <containerId> <command>` => `-i -t` send `-input` and `-text` formatting
* `docker exec -it a5e0ae785adf redis-cli` e.g.
* `docker exec -it <containerId> sh` // opens a terminal inside the docker-container where `sh` is the command to gain shell, but you can also use `bash` or `zsh` depending on the completness of the container
* with this one can move around inside the container and even start `redis-cli`, if the process is not stopped from `strg-c` use `strg-d` to send end shell command and come back to hostsystem
* `docker run -it busybox sh` // one could also start the `run` with a `sh` but it would prevent other logs or infos propagating topwards
* so it is more common to `docker run` the desired container and open another shell to `docker exec -it` on it, like shown above

#####NOTE! BEWARE!
 >containers do NOT share a filesystem to each other, which means that they are encapsulated by the id, if one adds a connection between containers there is no possible to access from one instance to another, even if they are based on the same image!!

##### dockerfiles
* flow will always be like this
  1. specify a base image
  2. run soime commands to install additional programs in the container
  3. specify a command to run on startup container
* to excersise we will create an image that runs redis-server
* consider the dockerfile in `/redis-image` `cd redis-image` followed by `docker build .` where `.` is the entryoint which is clearly `Dockerfile`
> Analogy: **writing a dockerfile is like given a brand new computer and beeing told to install some programs onto it**
* some src about offical supported base images
  * https://github.com/docker-library/official-images
* each step of the Dockerfile will create itself a temporary image
* after the step is completed, the intermediate image will be deleted
* read this mindfully as output of our small 3step docker file
```bash 
docker build .
Sending build context to Docker daemon  2.048kB
Step 1/3 : FROM alpine
latest: Pulling from library/alpine
ca7dd9ec2225: Pull complete 
Digest: sha256:b95359c2505145f16c6aa384f9cc74eeff78eb36d308ca4fd902eeeb0a0b161b
Status: Downloaded newer image for alpine:latest
 ---> bfe296a52501
Step 2/3 : RUN apk add --update redis
 ---> Running in 17fcb04d5d75
fetch https://dl-cdn.alpinelinux.org/alpine/v3.16/main/x86_64/APKINDEX.tar.gz
fetch https://dl-cdn.alpinelinux.org/alpine/v3.16/community/x86_64/APKINDEX.tar.gz
(1/1) Installing redis (7.0.5-r0)
Executing redis-7.0.5-r0.pre-install
Executing redis-7.0.5-r0.post-install
Executing busybox-1.35.0-r17.trigger
OK: 9 MiB in 15 packages
Removing intermediate container 17fcb04d5d75
 ---> 5cd2718149c4
Step 3/3 : CMD ["redis-server"]
 ---> Running in d0c925dbc152
Removing intermediate container d0c925dbc152
 ---> 9696ab73986e
Successfully built 9696ab73986e
```
* on adding more build command with like `RUN` docker is so fast, because it can access a cache that holds temp build steps! quite nice
* tl:dr cached images from build steps are >9000!
```bash
Step 2/4 : RUN apk add --update redis
 ---> Using cache
 ---> 82d8800b5796
```
* BUT order matters, if we move the RUN to the top, the image hash is different and we need to build from scratch
* for gaining an image name/tag we need to
`docker build -t hagbard/redis:latest .`

#### alternative image creation technique, but this is not super common
* there is also the possibilty to create an image out of an existing container
* `docker run -it alpine sh` starts and emtpy docker with an alpine image
* inside the shell `apk add --update redis` =>  brings a running container with a modified filessystem, redis is added
* in another terminal we now `docker ps` to know the `<containerId>`
* `docker commit -c 'CMD ["redis-server"]'` // where `-c` allows us to run a command, which is inside `'...'` which will return another `<containerId2>` 
* we run this now `docker run <containerId2`


### Simple-Webapp Example 
> note this error: [idealTreeAlreadyExists](https://stackoverflow.com/questions/57534295/npm-err-tracker-idealtree-already-exists-while-creating-the-docker-image-for)

* we need to:
 > left is entry point seen from `dockerfile build .`
 > right is target inside container filesystem
* `WORKDIR /usr/app` specifiy a workdir inside the container
* `COPY ./ /usr/app/`  and copy them into the container

* now we are mapping container ports
* where left 8080 means, all coming from this localnetwork port are redirected to other port insided the container, consider `-p 8080:1337` would need the express to expose on `:1337`
`docker run -p 8080:8080 hagbardc3line/simple-webapp`
* after the build we could also verify about the correctness of our WORKDIR with this `docker run -it hagbardc3line/simple-webapp sh` which should be the same as `WORKDIR /usr/simple-webapp`

* on rebuilding, because changing the js in `index.js` docker detects a change and then also wants to redo `npm install`, how could we prevent this?
* we wil split the `COPY` step 
```bash
# copy assets to container
COPY ./package.json /usr/simple-webapp/
# install depts
RUN npm install
# now copy all of the rest, to avoid another npm run install
COPY ./ ./usr/simple-webapp
```
* and gained build cache
```bash
Step 4/6 : RUN npm install
 ---> Using cache
 ---> 7a03967d8363
 ```

### docker-compose
#### networking between containers
* we have 2 options here
  1. docker CLI use (issue here is one needs to do it every time!!, which we dont want)
  2.  docker-compose as tool (which we needed to install on fedora37 just now) -> introducing **docker-compose.yml**
* by building via docker compose docker will allow connection in between this containers, so they can exchange data
* inside the `index.js` for the redis client, we can specify `host: redis-server` which is given by the naming in the `docker-compose.yml`
* consider
```bash
docker-compose up --build
Creating network "visitor-counter_default" with the default driver
```

##### translation between normal docker and docker-compose commands
* `docker run myImage` -> `docker-compose up`
* `docker build .` && `docker run myImage` -> `docker-compose up --build`
* `docker run id` -> `docker-compose up -d` runs containers in the background
* `docker stop id` would be unhandy fopr each single image -> `docker compose down`

##### how to handle crashed containers?
* we modify our vistors `index.js` by adding a second route, which will end the servers runtime
* we can check on correctnes by `docker ps` only redis should run now, visitors is exited(0)
* note on nodejs Status Codes `0->everything is ok` BUT `1,2,3..etc -> Exit because something went wrong` keep this in mind, when writing your automatic container restarts
* docker-compose offers `restart policies` with 4 states 
  1. `"no"` - never restart (no-te the quotes) because yml will read `no` as `false` , curios and funny
  2. `always` -> container stopped for any reason, restart it
  3. `on-failure` -> only restarts if the container stops with an error code
  4. `unless-stopped` -> like `always` unless we DEVELOPERS forcibly stopped it
* `docker ps` -> `docker-compose ps` to inspect running containers, inside the /dir we are in, when there is also a `docker-compose.yml` given in that root

#### docker and kubernetes -- workflows#

* we want to create a flow of actions:

  1. pull from git feature branches
  2. make changes on it
  3. push back to feature
  4. create pull request to merge into main
  5. will trigger [TRAVIS CI](https://github.com/travis-ci/travis.rb) 
    * will run some tests
    * if tests are passing
  6. deploy to AWS Elastic Beanstack

### removed old react-app README

## split up to this repo, to gain a git repo

check this in depth [split repo](https://github.com/janpauldahlke/docker-kubernetes-travis-aws-flow)

#### chapter docker-kubernetes action workflow

* runs `npx create-react-app my-app` to gain an example project
* `cd my-app` go into root of frontend proj

##### creating the developer dockerfile
* `touch Dockerfile` -> production docker
* `touch Dockerfile.dev` -> development docker
* `docker build -f Dockerfile.dev .` /-f = file

##### Docker Volumes: how to gain hot reload for containers?
* consider we want to make changes on the `index.js` but want it to be reflected on our `docker run -p 3000:3000 <ebee06b498a6_anyId>`
* docker volumes map a folder from the local machine to the inner folder of the container
* empty expression example `docker run -p 3000:3000 -v /app/node_modules -v$(pwd):/app ebee06b498a6` // -> *(pwd)* is short for *present working directory*

> nasty error on linux
```bash
Failed to compile.

[eslint] EACCES: permission denied, mkdir '/app/node_modules/.cache'
ERROR in [eslint] EACCES: permission denied, mkdir '/app/node_modules/.cache'
```
solution is to alter Dockerfile with `USER` and `chown` possibly:
```bash
FROM node:alpine
 
USER node
 
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
 
COPY --chown=node:node ./package.json ./
RUN npm install
COPY --chown=node:node ./ ./
 
CMD ["npm", "start"]
```
```

Explanation of changes:

We are specifying that the USER which will execute RUN, CMD, or ENTRYPOINT instructions will be the node user, as opposed to root (default).

https://docs.docker.com/engine/reference/builder/#user

We are then creating a directory of /home/node/app prior to the WORKDIR instruction. This will prevent a permissions issue since WORKDIR by default will create a directory if it does not exist and set ownership to root.

The inline chown commands will set ownership of the files you are copying from your local environment to the node user in the container.

The end result is that some files and directories will no longer be owned by root, and no npm processes will be run by the root user. Instead, they will all be owned and run by the node user.
```

* the final `docker run` with docker volumes
`docker run -p 3000:3000 -v /home/node/app/node_modules -v $(pwd):/home/node/app 47f680845db3`
* please take a note, create-react-app is still the one hotreloading, but with docker volumes we can get the update reflected

* we could still improve further on, for this we use docker-compose
* consider this `docker-compose.yaml`
```bash
version: '3'
services:
  react-app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes: 
      - /home/node/app/node_modules   #bookmarking node_modules
      - .:/home/node/app              #mount localfilesystem
    restart: unless-stopped
```
* run it with
`docker-compose up --build`


#### running tests the pros and the cons, 
> tl:dr there is no ideal solution :-P
* assumes you have the container id in hand
* the CLI way is `docker run <ContainerId> npm run test -it` to also connect our machine to STDIN
* while developing also `docker exec -it <containerID> npm run test` could be of use, by doint so, we attach our self to the already running docker and gain hotlreload on changes // *not a perfect solution*
* we refactored `docker-compose.yaml` to run tests on a second `services`
* commands are provide to `docker-compose.yaml` like this ` command: ["npm", "run", "test"]`
* **pro** of this, it is encapsulated, BUT **con** is that all tests are rereun on changes all the time, and we dont have STDIN from `docker exec`, which allowed us top trigger tests manually
* we tried `docker ps` && `docker attach <containerId>` but we are not able to send to STDIN here
* another way is `docker exec -it <containerId> sh` which let's us slip directly into the running container and would allow us in another terminal window to `npm run test` and gain the runner options with STDIN

#### running the production version
* since we don't have a dev web server here, we go with nginx
* flow is
  1. use node:alpine
  2. copy package.josn
  3. install all depts // Deps ony need to execute build, we would need it, to save 150mb of depts
  4. `npm run build`
  5. copy stuff around || serve build directory
  6. start nginx
