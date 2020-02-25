**This is a docker image for running Gremlins (https://github.com/marmelab/gremlins.js) from docker container with help of protractor to navigate to specific web page, perform authentication and collect logs from browser.**

The [Dockerfile](Dockerfile) was design based on the following projects:
- [docker-protractor] (https://github.com/hortonworks/docker-protractor)
- [Protractor and headless Chrome on Docker](http://float-middle.com/protractor-and-headless-chrome-on-docker-with-video-tutorial/) or [Docker image of Protractor with headless Chrome](https://github.com/jciolek/docker-protractor-headless)
- [docker-protractor](https://github.com/School-Improvement-Network/docker-protractor)

# To start Gremlins from this container iamge:
1. Clone this repo
2. Navigate to cloned repo in your local machine with CMD/bash
3. Open "protractor/specs/gremlins.js" file in prefered text editor or IDE
4. Modify "should navigate to website and login" test so it would navigate to your prefered webpage
5. (Optional) In a same "should navigate to website and login" test (or create new subsequent step for this purpose) add authentification requred steps if your application requres it
6. Run docker-compose up (**Note** current restart policy is unless-stopped, so don't forget to stop container or change restart policy)

<sub>Based on the [docker-protractor](https://github.com/hortonworks/docker-protractor).</sub>
