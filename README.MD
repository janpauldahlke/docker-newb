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




