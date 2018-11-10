var casper = require("casper").create({
    verbose: true,
    logLevel: 'error',
    pageSettings: {
      loadPlugins: false,
      loadImages: false
    }
});

var url = 'https://www.bestbuy.com/site/reviews/sony-playstation-4-1tb-console-black/5850905';
var currentPage = 1
var ratingsList = []

var terminate = function() {
    this.echo(ratingsList.length + " Reviews found")
    this.echo(ratingsList)
    this.echo("Exiting..").exit();
};

// Return the current page by looking for the disabled page number link
function getSelectedPage() {
    var el = document.querySelector('a.current-page');
    return parseInt(el.textContent);
}

function getRatings() {
    var ratings = document.querySelectorAll('div.reviews-content-wrapper span.c-review-average')
    var ratingList = Array.prototype.map.call(ratings, function(e) {
        return e.innerHTML;
    })
    return ratingList
}

var processPage = function() {
    ratings = this.evaluate(getRatings);
    Array.prototype.forEach.call(ratings, function(e) {
        ratingsList.push(e)
    })

    if (currentPage >= 3) {
        return terminate.call(casper);
    }

    currentPage++;

    // We use waitFor() to wait until the expression has been evaluated.
    // Once the element has loaded, we call processPage().
    // If the element does not load before the default timeout occurs, the script exits by calling terminate().
    this.thenClick("li.page.next a").then(function() {
        this.waitFor(function() {
            return currentPage === this.evaluate(getSelectedPage);
        }, processPage, terminate);
    });
};

casper.start(url);

casper.waitForSelector('li.page.next a', processPage, terminate, 5000)

casper.run();