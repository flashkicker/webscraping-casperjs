const casper = require('casper').create({
    verbose: true,
    logLevel: 'error',
    clientScripts: ["vendor/jquery.min.js", "vendor/lodash.js"]
})

// initialize an empty array in which you will store all your links
var links = []

// use jquery to specify the html selector that you want
// then map the links using lodash
function getLinks() {
    var links = $('li.b_algo > h2 a')
    return _.map(links, function(e) {
        return e.getAttribute("href")
    })
}

// specify the url you want the script to start with
// inside the callback function
casper.start('http://bing.com/', function() {
    this.waitForSelector('form[action="/search"]')
})

// fill method fills the fields of a form with some given values
// we are providing the search query casperjs to the form
// set true to tell casper that we actually want to submit the form
casper.then(function() {
    this.fill('form[action="/search"]', { q: 'casperjs' }, true)
})

// push the links into our links array through the getLinks method
// the evaluate function essentially executes the function passed to it within the DOM
casper.then(function() {
    links = this.evaluate(getLinks)
})

// execute the script and print out the urls in a readable manner
// make sure to exit
casper.run(function() {
    this.echo(links.length + ' links found')
    this.echo(' - ' + links.join('\n - ')).exit()
})