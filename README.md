**This is a docker image for running Gremlins (https://github.com/marmelab/gremlins.js) from docker container with help of protractor to navigate to specific web page, perform authentication and collect logs from browser.**

The [Dockerfile](Dockerfile) was design based on the following projects:
- [docker-protractor (hortonworks)](https://github.com/hortonworks/docker-protractor)
- [Protractor and headless Chrome on Docker](http://float-middle.com/protractor-and-headless-chrome-on-docker-with-video-tutorial/) or [Docker image of Protractor with headless Chrome](https://github.com/jciolek/docker-protractor-headless)
- [docker-protractor](https://github.com/School-Improvement-Network/docker-protractor)

# To start Gremlins from this container iamge:
1. Clone this repo
3. Open "protractor/configuration_gremlins.js" file in prefered text editor or IDE
4. Modify "baseUrl" test so it would navigate to your prefered webpage
5. (Optional) Open "protractor/specs/gremlins.js" file in prefered text editor or IDE
6. (Optional) Modify "should navigate to website and login" test (or create new subsequent step for this purpose) add authentification steps if your application requres it
2. Navigate to cloned repo in your local machine with CMD/bash
7. Run *docker-compose build gremlins-on-docker*
7. Run *docker-compose up* (**Note** current restart policy is unless-stopped, so don't forget to stop container or change restart policy)

# Configuration options you should know about:
- You can capture screenshots at the end of execution by changing false -> true for "takeScreenshotAtTheEnd" (protractor/configuration_gremlins.js)
- You can turn on console output for every gremlin release at url change by changing false -> true for "debugGremlins" (protractor/configuration_gremlins.js)
- You can tweak gremlin execution run length by changing "executionTimeInMinutes" value (protractor/configuration_gremlins.js)
- You can tweak url check interval by changing "urlCheckIntervalInMinutes" value (protractor/configuration_gremlins.js). If your app under test is single page application you can match "urlCheckIntervalInMinutes" with "executionTimeInMinutes" in order not to use this feature

<sub>Based on the [docker-protractor](https://github.com/hortonworks/docker-protractor)</sub>
