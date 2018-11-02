var casper = require('casper').create({
    verbose: true,
    logLevel: 'debug',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.4 (KHTML, like Gecko) Chrome/22.0.1229.94 Safari/537.4'
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
// notice that all the links are found under the div tag with the class campaign
// and we want the a element inside them
function getLinks() {
    var link = $('.campaign a')
    return _.map(link, function(e) {
        return e.getAttribute('href')
    })
}

// you can either use innerHTML or innerText but since we want to retain the whitespaces (&nbsp) we use innerHTML
function getTitles() {
    var title = $('.campaign a')
    return _.map(title, function(e) {
        return e.innerHTML
    })
}

// we are cutting off everything in our string starting from the title to the end using regex
// function getTitles() {
//     var title = $('.campaign a')
//     return _.map(title, function(e) {
//         return e.innerHTML.replace(/\:.*$/g, "")
//     })
// }

function getDates() {
    var date = $('.campaign')
    return _.map(date, function(e) {
        return e.innerText
    })
}

// use regex to cut off everything after the hyphen so we only get the date
// function getDates() {
//     var date = $('.campaign')
//     return _.map(date, function(e) {
//         return e.innerText.replace(/\-.*$/g, "")
//     })
// }

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
    this.echo(' - ' + links.join('\n - '))
    // this.echo(' - ' + titles.join('\n - ')).exit()
    // this.echo(' - ' + dates.join('\n - ')).exit()
})