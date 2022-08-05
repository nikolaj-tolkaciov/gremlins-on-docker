// @ts-check
const { test, request } = require('@playwright/test')
const fs = require('fs')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const os = require('os')
const gremlinScript = require('./src/gremlin_script')
const errorMessageType = 'error'
const warningMessageType = 'warn'

const settings = {
  baseUrl: 'https://www.youtube.com',
  executionTimeInMinutes: 0.5,
  urlCheckIntervalInMinutes: 0.1,
  debugGremlins: false,
  takeScreenshotAtTheEnd: false,
  storeLogs: true,
  storeFullLogs: true,
  sendLogsToElasticSearch: false,
  elasticIndexName: 'gremlins',
  elasticUserName: '',
  elasticPassword: '',
  gremlinExecuteScript: gremlinScript + generateExecutionScript(5)
}

let errorsLogsString = ''
let warningsLogsString = ''
let fullLogsString = ''

class errorMessage {
  constructor(text) {
    this.textMsg = text
  }
  type() {
    return errorMessageType
  }
  text() {
    return this.textMsg
  }
}

test.describe('FuzzTesting', () => {
  test('release the Gremlins', async ({ page }) => {
    await page.goto(settings.baseUrl, { waitUntil: 'domcontentloaded' })
    registerListeners(page)

    //Add any navigation or login steps bellow
    await page.locator('#text >> text=Reject All').click()

    await executeGremlins(page)
    await storeLogsAndScreenshot(page)
    
    await page.close()
  })
})

function registerListeners(page) {
  page.on('console', msg => {
    parseConsoleMessage(msg)
  })

  page.on('requestfailed', err => {
    let errorsMessage = new errorMessage(err.url() + ' ' + err.failure().errorText)
    parseConsoleMessage(errorsMessage)
  })

  page.on('error', err => {
    let errorsMessage = new errorMessage(err)
    parseConsoleMessage(errorsMessage)
  })

  page.on('pageerror', err => {
    let errorsMessage = new errorMessage(err)
    parseConsoleMessage(errorsMessage)
  })
}

async function parseConsoleMessage(msg) {
  let currentTime = new Date()
  let timestampString = currentTime.toLocaleTimeString('en-GB', { hour12: false })
  let logString = timestampString + ', ' + msg.type() + ', ' + msg.text() + os.EOL

  if(settings.debugGremlins) {
    console.log(logString.slice(0, -1))
  }

  if(settings.storeLogs) {
    switch (msg.type()) {
      case errorMessageType:
        errorsLogsString += logString
      case warningMessageType:
        warningsLogsString += logString
      default:
        if(settings.storeFullLogs) fullLogsString += logString
    }
  }

  if(settings.sendLogsToElasticSearch) {
    if(settings.storeFullLogs || [errorMessageType, warningMessageType].includes(msg.type()))
      await sendLogs(msg, timestampString);
  }
}

async function executeGremlins(page) {
  let lastUrl = ""
  for (let i = 0; i < settings.executionTimeInMinutes/settings.urlCheckIntervalInMinutes; i++) {	
    let currentUrl = await page.url()
    if(lastUrl !== currentUrl) {
      if(settings.debugGremlins) { console.log('\nRelease Gremlins \nLast URL: ' + lastUrl + '\nNew URL: ' + currentUrl)}
      lastUrl = currentUrl
      await page.evaluate(`${settings.gremlinExecuteScript}`)
    }
    await new Promise(resolve => setTimeout(resolve, settings.urlCheckIntervalInMinutes * 60 * 1000))
  }
}

async function storeLogsAndScreenshot(page) {
  let today = new Date()
  let dateString =  today.toISOString().substring(0,10)
  
  if(settings.storeLogs) {
    let warningFile = 'warnings_' + dateString + '.txt'
    let errorFile = 'errors_' + dateString + '.txt'
        
    warningsLogsString = warningsLogsString.replace(/\\n/g, os.EOL)
    errorsLogsString = errorsLogsString.replace(/\\n/g, os.EOL)
    
    await writeFile('logs/' + dateString + '/' + warningFile, warningsLogsString)
    await writeFile('logs/' + dateString + '/' + errorFile, errorsLogsString)
    
    if(settings.storeFullLogs) {
      let fullFile = 'full_' + dateString + '.txt'
      fullLogsString = fullLogsString.replace(/\\n/g, os.EOL)
      await writeFile('logs/' + dateString + '/' + fullFile, fullLogsString)
    }
  }

  if(settings.takeScreenshotAtTheEnd) {
    let today = new Date()
    await page.screenshot({path: `screenshot-${today.getTime()}.png`});
  }
}

async function writeFile(path, contents, cb) {
  await mkdirp(getDirName(path))
  fs.appendFile(path, contents, (err) => {
    if (err) return cb(err)
    return cb
  })
}

async function sendLogs(message, timeStamp) {
  const context = await request.newContext()

    context.post(`http://${settings.elasticUserName}:${settings.elasticPassword}@elasticsearch:9200/${settings.elasticIndexName}/_doc/?pretty=`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
      data: {
        "timestamp": timeStamp,
        "type": message.type(),
        "message":  message.text(),
      }
    })
}

function generateExecutionScript(depth) {
  if (depth != 0) {
    return "window.gremlins&&gremlins.createHorde()\
          .gremlin(gremlins.species.formFiller())\
          .gremlin(gremlins.species.clicker().clickTypes(['click']))\
          .mogwai(gremlins.mogwais.gizmo().maxErrors(2000))\
          .gremlin(gremlins.species.toucher())\
          .gremlin(gremlins.species.scroller())\
          .gremlin(gremlins.species.typer())\
          .after(function releaseGremlinAgain() { " + generateExecutionScript(depth - 1) + " })\
          .unleash();"
  } else {
    return "window.gremlins&&gremlins.createHorde()\
          .gremlin(gremlins.species.formFiller())\
          .gremlin(gremlins.species.clicker().clickTypes(['click']))\
          .mogwai(gremlins.mogwais.gizmo().maxErrors(2000))\
          .gremlin(gremlins.species.toucher())\
          .gremlin(gremlins.species.scroller())\
          .gremlin(gremlins.species.typer())\
          .unleash();"
  }
}