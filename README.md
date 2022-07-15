**This is a docker image for running [Gremlins](https://github.com/marmelab/gremlins.js) from docker container with help of playwright to navigate to a specific web page, perform authentication and collect logs from browser.**

The [Dockerfile](Dockerfile) was design based on the following projects:
- [Playwright](https://hub.docker.com/_/microsoft-playwright)

# How to use Gremlins on docker container image:
1. Clone this repo
2. Open "playwright/gremlins.js" file in a preferred text editor or IDE
3. Change "baseUrl" variable with your application's URL
4. (Optional) Add authentification steps if your application requires it under "//Add any navigation or login steps bellow" comment
5. Navigate to the cloned repo in your local machine with CMD/bash
6. Run *docker-compose build gremlins-on-docker*
7. Run *docker-compose up* (**Note** current restart policy is unless-stopped, so don't forget to stop container or change restart policy)

# gremlins.js settings you should know about:
- You can capture screenshots at the end of execution by changing false -> true for "takeScreenshotAtTheEnd"
- You can turn on console output for every gremlin release at URL change by changing false -> true for "debugGremlins"
- You can tweak gremlin execution run length by changing the "executionTimeInMinutes" value
- You can tweak URL check interval by changing "urlCheckIntervalInMinutes" value. If your app under test is single page application you can match "urlCheckIntervalInMinutes" with "executionTimeInMinutes" in order not to use this feature
- You can toggle full browser log writing to file by changing "storeFullLogs" parameter
- You can send logs directly to Elastic Search by changing "sendLogsToElasticSearch" to true and filling in the "elasticUserName" and "elasticPassword"
- You can dissable log storing by setting "storeLogs" to false

<sub>Based on the [Playwright](https://hub.docker.com/_/microsoft-playwright)</sub>
