const fs = require('fs')
const mkdirp = require('mkdirp')
const getDirName = require('path').dirname
const os = require('os')
const gremlinScript = require('../lib/gremlin_script')

const landingPageContent = by.css('[title="YouTube"]')
			
describe('fuzz testing Youtube', function() {
	
	it('should navigate to website and login', function() {
		browser.ignoreSynchronization = true
		browser.get('/')
		browser.driver.wait(() => {return browser.driver.findElement(landingPageContent)})
		//Add any project specifc steps for authentification bellow
	})
	
	it('should release the... gremlins and wait', async function() {
		let lastUrl = ""
		for (let i = 0; i < browser.params.executionTimeInMinutes/browser.params.urlCheckIntervalInMinutes; i++) {	
			browser.getCurrentUrl().then(async (url) => {
				if(lastUrl !== url) {
					if(browser.params.debugGremlins) { console.log("\nRelease Gremlins \nLast URL: " + lastUrl + "\nNew URL: " + url)}
					lastUrl = url
					browser.executeScript("javascript:" + gremlinScript + generateExecutionScript(5))
				}
				await browser.driver.sleep(browser.params.urlCheckIntervalInMinutes * 60 * 1000)
			})
		}
	})
	
	it('s my precious... logs', function() {	
		let today = new Date()
		let dateString =  today.toISOString().substring(0,10)
		
		let warningFile = "warnings_" + dateString + ".txt"
		let errorFile = "errors_" + dateString + ".txt"
		let fullFile = "full_" + dateString + ".txt"
		
		let warningsLogsString = ""
		let errorsLogsString = ""
		let fullLogsString = ""
		
		browser.manage().logs().get('browser').then(function(browserLogs) {
			browserLogs.forEach(function(log) {
				var timestamp = new Date(log.timestamp)
				timestampString = timestamp.toLocaleTimeString('en-GB', { hour12: false })
				if (log.level.value > 900) { // it's an error log
					errorsLogsString += timestampString + " " + log.level.name + ": " + log.message + os.EOL
				} else if (log.level.value > 800) { // it's an warning log
					warningsLogsString += timestampString + " " + log.level.name + ": " + log.message + os.EOL
				}
				fullLogsString += timestampString + " " + log.level.name + ": " + log.message + os.EOL
			})
			  
			warningsLogsString = warningsLogsString.replace(/\\n/g, os.EOL)
			errorsLogsString = errorsLogsString.replace(/\\n/g, os.EOL)
			fullLogsString = fullLogsString.replace(/\\n/g, os.EOL)
			
			writeFile('logs/' + dateString + "/" + warningFile, warningsLogsString)
			writeFile('logs/' + dateString + "/" + errorFile, errorsLogsString)
			writeFile('logs/' + dateString + "/" + fullFile, fullLogsString)
		});

		if(browser.params.takeScreenshotAtTheEnd) {
			browser.takeScreenshot().then((png) => {writeScreenShot(png, `screenshot-${today.getTime()}.png`)})
		}
	});
	
	function writeFile(path, contents, cb) {
		mkdirp(getDirName(path), function (err) {
			if (err) return cb(err)
			fs.appendFile(path, contents, (err) => {
				if (err) return cb(err)
				return cb
			})
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

	function writeScreenShot(data, filename) {
		let stream = fs.createWriteStream(filename)
		stream.write(new Buffer(data, 'base64'))
		stream.end()
	}
})