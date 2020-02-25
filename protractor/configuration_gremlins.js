exports.config = {
	capabilities: {
		browserName: 'chrome',
		loggingPrefs: {
			browser: 'ALL', // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL". 
			driver: 'ALL'
		},
		perfLoggingPrefs: {
			enableNetwork: true,
			enablePage: true
		},
		'goog:chromeOptions': {
			args: ["--no-sandbox", "--headless", "--disable-gpu", "--window-size=1920,1080"]
		}
	},
	allScriptsTimeout: 10 * 60 * 1000, //10min increased for fuzz testing
	getPageTimeout: 10 * 60 * 1000, //10min increased for fuzz testing
	jasmineNodeOpts: {
		defaultTimeoutInterval: 10 * 60 * 1000, //10min increased for fuzz testing
	},
	directConnect: true,
	specs: [
		'specs/gremlins.js'
	],
	baseUrl: 'https://youtube.com',
	params: {
		executionTimeInMinutes: 2,
		urlCheckIntervalInMinutes: 0.1,
		takeScreenshotAtTheEnd: false,
		debugGremlins: false
	}
}