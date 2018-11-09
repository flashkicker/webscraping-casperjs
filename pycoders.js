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

// need this to write our scraped data to a file
// this is imported into phantomjs by default
var fs = require('fs')
var url = 'http://pycoders.com/archive'

// declare empty arrays
var links = []
var titles = []
var dates = []

// function generateTable() {
//     var data
//     return data = "<tr>\n <td>" + dates.join('\n ') + "</td>\n  <td>" + titles.join('\n ') + "</td>\n  <td>" + links.join('\n ') + "</td>\n </tr>"
// }

// the page has hundreds of links so we use map to gather them all up
// notice that all the links are found under a div tag with the class .mb-3
// and we want the a element inside them
function getLinks() {
    var link = $('.mb-3 a')
    return _.map(link, function(e) {
        return "http://pycoders.com" + e.getAttribute('href')
    })
}

// you can either use innerHTML or innerText but since we want to retain the whitespaces (&nbsp) we use innerHTML
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

// once we have our functions set up we can start the script
casper.start(url)

casper.then(function() {
    links = this.evaluate(getLinks)
})

// casper.then(function() {
//     titles = this.evaluate(getTitles)
// })

// casper.then(function() {
//     dates = this.evaluate(getDates)
// })

// generate table inside casper.run
// write it to an html file using the fs module
// casper.run(function() {
//     var html
//     html = "<table><tr><td>Date</td><td>Title</td><td>Link</td></tr>"
//     html = html + generateTable()
//     html += "</table>"
//     fs.write('data.html', html, 'w')
//     this.echo("\n Write complete.").exit()
// })

casper.run(function() {
    this.echo(links.length + ' links found')
    this.echo(' - ' + links.join('\n - ')).exit()
    // this.echo(' - ' + titles.join('\n - '))
    // this.echo(' - ' + dates.join('\n - ')).exit()
})