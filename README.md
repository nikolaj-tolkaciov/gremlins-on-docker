**This is a docker image for running [Gremlins](https://github.com/marmelab/gremlins.js) from a docker container with help of a Playwright to navigate to a specific web page, perform authentication and collect logs from the browser.**

The [Dockerfile](Dockerfile) was designed based on the following projects:
- [Playwright](https://hub.docker.com/_/microsoft-playwright)

# How to use Gremlins on docker container image:
1. Clone this repo
2. Open the "playwright/gremlins.spec.js" file in a preferred text editor or IDE
3. Change the "baseUrl" variable with your application's URL
4. (Optional) Add authentification steps if your application requires it under "//Add any navigation or login steps below" comment
5. Navigate to the cloned repo in your local machine with CMD/bash/terminal
6. Run *docker-compose build gremlins-on-docker*
7. Run *docker-compose up* (**Note** current restart policy is unless-stopped, so don't forget to stop container or change restart policy)

# Settings you should know about:

**gremlins.spec.js:**
- You can capture screenshots at the end of execution by changing false -> true for "takeScreenshotAtTheEnd"
- You can turn on console output for every gremlin release at URL change by changing false -> true for "debugGremlins"
- You can tweak Gremlin execution run length by changing the "executionTimeInMinutes" value
- You can tweak the URL check interval by changing the "urlCheckIntervalInMinutes" value. If your app under test is single page application you can match "urlCheckIntervalInMinutes" with "executionTimeInMinutes" in order not to use this feature
- You can toggle full browser log writing to file by changing the "storeFullLogs" parameter
- You can send logs directly to Elastic Search by changing "sendLogsToElasticSearch" to true and filling in the "elasticUserName" and "elasticPassword"
- You can change the Elastic search index name to where all logs will be sent by changing the "elasticIndexName" value
- You can disable log storing by setting "storeLogs" to false

**playwright.config.js**
- You can change the browser by changing "browserName" to chromium/firefox/chrome/msedge

# Troubleshooting:
- Current Youtube setup is anticipating GDPR popup and clicking "Refect all" button, if the geolocation from where you are running Gremlins do not have GDPR, comment out gremlins.spec.js line #48

<sub>Based on the [Playwright](https://hub.docker.com/_/microsoft-playwright)</sub>
