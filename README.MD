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






