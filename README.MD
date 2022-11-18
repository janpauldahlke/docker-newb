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


