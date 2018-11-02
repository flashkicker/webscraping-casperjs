var casper = require("casper").create({
	verbose: true,
	logLevel: "debug",
	pageSettings: {
		loadImages: false,
		loadPlugins: false,
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4"
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
	return JSON.stringify(output)
}

function getLinks() {
	var link = $(".campaign a")
	return _.map(link, function(e) {
		return e.getAttribute("href")
	})
}

function getTitles() {
	var title = $(".campaign a")
	return _.map(title, function(e) {
		return e.innerHTML.replace(/\:.*$/g, "")
	})
}
function getDates() {
	var date = $(".campaign")
	return _.map(date, function(e) {
		return e.innerText.replace(/\-.*$/g, "")
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
