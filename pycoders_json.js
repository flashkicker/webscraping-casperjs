var casper = require("casper").create({
	verbose: true,
	logLevel: "debug",
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) Gecko/20130404 Firefox/23.0"			
	},
	clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
})
var fs = require("fs")

var url = "http://pycoders.com/archive"

var links = []
var titles = []
var dates = []
var output = []

function outputJSON() {
	for (var i = 0; i < links.length; i++) {
		output.push({
			link: links[i],
			title: titles[i],
			date: dates[i]
		})
	}
	return JSON.stringify(output, null, 2)
}

function getLinks() {
    var link = $('.mb-3 a')
    return _.map(link, function(e) {
        return "http://pycoders.com" + e.getAttribute('href')
    })
}

function getTitles() {
    var title = $('.mb-3 a')
    return _.map(title, function(e) {
        var title = e.innerHTML
        return title.slice(0, title.indexOf('(') - 1)
    })
}

function getDates() {
    var date = $('.mb-3 a')
    return _.map(date, function(e) {
        var date = e.innerHTML
        return date.slice(date.indexOf('(') + 1, -1)
    })
}

casper.start(url)

casper.then(function() {
	links = this.evaluate(getLinks)
})

casper.then(function() {
	titles = this.evaluate(getTitles)
})

casper.then(function() {
	dates = this.evaluate(getDates)
})

casper.run(function() {
	var data = outputJSON()
	fs.write("data.json", data, "w")
	this.echo("\n Write complete.").exit()
})
