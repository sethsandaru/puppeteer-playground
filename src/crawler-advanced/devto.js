/**
 * Advanced: Go to DevTo and crawl the news
 * Note: This is not logged in version. For the logged in version, the HTML might had a little bit differences.
 */
const {go} = require('puppeteer-go');

const url = "https://dev.to";
const totalPages = 2; // total page we want to retrieve
const articleSelector = 'div.crayons-story'

go(url, pageSolving, {
    headless: true,
    args: [`--window-size=1920,1080`],
    defaultViewport: null
})

/**
 * Handle the page
 * @param {Page} page
 * @returns {Promise<void>}
 */
async function pageSolving(page) {

    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });
    console.log("Added jQuery helper")

    await page.screenshot({path: 'devto.png'});
    console.log("Screenshot taken.")

    await page.waitForSelector("#substories", {visible: true, timeout: 2000})
    console.log("Waited #substories")

    // setup console for execute

    // use this to expose this context function to the puppeteer context
    page.on('console', msg => {
        for (let i = 0; i < msg._args.length; ++i)
            console.log(`${i}: ${msg._args[i]}`);
    });

    // scroll to footer to get more detail
    await autoScroll(page)
    await page.screenshot({path: 'devto-after-scrolled.png', fullPage: true});

    console.log("Getting Articles Detail")
    const allArticles = await page.evaluate((articleSelector) => {

        const articleList = [];
        console.log("Total Articles", window.$(articleSelector).length)

        $(articleSelector).each(function () {
            const $article = $(this)

            // article data with basic detail
            const articleDetail = {
                title: $article.find(".crayons-story__title > a").text().trim(),
                author: $article.find("a.crayons-story__secondary.fw-medium")[0].innerHTML.trim(),
                createdDate: $article.find("time").attr('datetime').trim(),
                tags: [],
            }

            // TODO: If I feel free, I will extend it and grab the post's body.

            // get tags
            $article.find('.crayons-story__tags').children().each(function () {
                articleDetail.tags.push(
                    $(this).text()
                )
            })

            // add to the big list
            articleList.push(articleDetail)
        })

        return articleList;

    }, articleSelector)

    console.log("FINAL DATA", allArticles)
}


function autoScroll(page){
    return page.evaluate(() => {
        return new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 15000;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 2000);
        })
    });
}