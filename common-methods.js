var casper = require('casper').create({
    verbose: true, // allows us to send log messages to our console
    logLevel: 'debug', // four different options: debug, info, warning, error
    pageSettings: {
        loadImages: false, // tell casper whether it should crawl for images
        loadPlugins: false, // tell casper whether it should crawl for plugins like flash, quicktime, etc.
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4' // some websites like amazon might deny casperjs if they don't see a user agent
    },
    clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"] // inject whatever javascript you want into your script here
})

casper.start('https://oregonstate.edu/', function() {
    this.echo(this.getTitle())
})

casper.then(function() {
    this.echo(this.getCurrentUrl())
})

casper.run(function() {
    this.echo('Done').exit()
})