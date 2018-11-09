// wait for page load, click review tab, scrape contents
// print reviews and date
// can't use jquery (supposedly in some sites you can't inject jquery or it breaks your script)

var casper = require('casper').create({
    verbose: true,
    logLevel: 'error',
    pageSettings: {
        loadImages: false,
        loadPlugins: false,
    }
})

var url = 'https://www.bestbuy.com/site/sony-playstation-4-1tb-console-black/5850905.p?skuId=5850905'

var dates = []
var ratings = []

function getDates() {
    var dates = document.querySelectorAll('div.reviews-content-wrapper time.submission-date')
    var dateList = Array.prototype.map.call(dates, function(e) {
        return e.getAttribute('title')
    })
    return dateList
}

function getRatings() {
    var ratings = document.querySelectorAll('div.reviews-content-wrapper span.c-review-average')
    var ratingList = Array.prototype.map.call(ratings, function(e) {
        return e.innerHTML;
    })
    return ratingList
}

casper.start(url, function() {
    this.echo(this.getTitle())
})

casper.waitForSelector('button.c-accordion-heading', function() {
    console.log("Button loaded")
})

casper.then(function() {
    this.click('button.c-accordion-heading')
    console.log("Clicked reviews tab")
})

casper.waitForSelector('div.reviews-content-wrapper span.c-review-average', function() {
    console.log("Ratings loaded")
})

casper.then(function() {
    dates = this.evaluate(getDates)
    ratings = this.evaluate(getRatings)
})

casper.run(function() {
    this.echo(ratings.length + ' ratings found')
    this.echo(' - ' + dates.join('\n - '))
    this.echo(' - ' + ratings.join('\n - ')).exit()
})