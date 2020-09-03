const puppeteer = require('puppeteer')
const fs = require('fs')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const os = require('os')
const gremlinScript = require('./src/gremlin_script')

const settings = {
  executionTimeInMinutes: 0.5,
  urlCheckIntervalInMinutes: 0.1,
  debugGremlins: true,
  takeScreenshotAtTheEnd: true,
  storeFullLogs: true,
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
    return 'error'
  }
  text() {
    return this.textMsg
  }
}

try {
  (async () => {
    const browser = await puppeteer.launch({headless: false})
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 800 })
    await page.goto('https://www.youtube.com', { waitUntil: 'networkidle2' })

    registerListeners(page)
    await executeGremlins(page)
    await storeLogsAndScreenshot(page)
    
    await browser.close();
  })()
} catch (err) {
  console.error(err)
}

function registerListeners(page) {
  page.on('console', msg => {
    parseConsoleMessage(msg)
  })

  page.on('requestfailed', err => {
    errorsMessage = new errorMessage(err.url() + ' ' + err.failure().errorText)
    parseConsoleMessage(errorsMessage)
  })

  page.on('error', err => {
    errorsMessage = new errorMessage(err)
    parseConsoleMessage(errorsMessage)
  })

  page.on('pageerror', err => {
    errorsMessage = new errorMessage(err)
    parseConsoleMessage(errorsMessage)
  })
}

function parseConsoleMessage(msg) {
  let currentTime = new Date()
  timestampString = currentTime.toLocaleTimeString('en-GB', { hour12: false })

  if (msg.type() === 'error') {
    errorsLogsString += timestampString + ' ' + msg.type() + ': ' + msg.text() + os.EOL
  } else if (msg.type() === 'warning') {
    warningsLogsString += timestampString + ' ' + msg.type() + ': ' + msg.text() + os.EOL
  } else if (settings.storeFullLogs) {
    fullLogsString += timestampString + ' ' + msg.type() + ': ' + msg.text() + os.EOL
  }

  if(settings.debugGremlins) {
    console.log(msg.type() + ': ' + msg.text())
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
    await new Promise(resolve => setTimeout(resolve, settings.urlCheckIntervalInMinutes * 60 * 1000));
  }
}

async function storeLogsAndScreenshot(page) {
  let today = new Date()
  let dateString =  today.toISOString().substring(0,10)
  
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