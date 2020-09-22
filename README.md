**This is a docker image for running [Gremlins](https://github.com/marmelab/gremlins.js) from docker container with help of protractor to navigate to a specific web page, perform authentication and collect logs from browser.**

The [Dockerfile](Dockerfile) was design based on the following projects:
- [docker-protractor (hortonworks)](https://github.com/hortonworks/docker-protractor)
- [Protractor and headless Chrome on Docker](http://float-middle.com/protractor-and-headless-chrome-on-docker-with-video-tutorial/) or [Docker image of Protractor with headless Chrome](https://github.com/jciolek/docker-protractor-headless)
- [docker-protractor](https://github.com/School-Improvement-Network/docker-protractor)

# How to use Gremlins on docker container image:
1. Clone this repo
2. Open "puppeteer/gremlins.js" file in a preferred text editor or IDE
3. Change "baseUrl" variable with your application's URL
5. (Optional) Add authentification steps if your application requires it under "//Add any navigation or login steps bellow" comment
7. Run *docker-compose build gremlins-on-docker*
8. Run *docker-compose up* (**Note** current restart policy is unless-stopped, so don't forget to stop container or change restart policy)

# gremlins.js settings you should know about:
- You can capture screenshots at the end of execution by changing false -> true for "takeScreenshotAtTheEnd"
- You can turn on console output for every gremlin release at URL change by changing false -> true for "debugGremlins"
- You can tweak gremlin execution run length by changing the "executionTimeInMinutes" value
- You can tweak URL check interval by changing "urlCheckIntervalInMinutes" value. If your app under test is single page application you can match "urlCheckIntervalInMinutes" with "executionTimeInMinutes" in order not to use this feature
- You can toggle full browser log writing to file by changing "storeFullLogs" parameter

<sub>Based on the [docker-protractor](https://github.com/hortonworks/docker-protractor)</sub>
