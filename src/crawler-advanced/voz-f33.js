/**
 * Advanced: We will go to f33 of Voz and get all the newest threads
 */

const {go} = require('puppeteer-go');

go('https://voz.vn/f/diem-bao.33/', pageSolving)

async function pageSolving(page) {
    await page.waitForSelector('.structItem-title')

    const allThreads = await page.evaluate(() => {
        // this page does has $ (Jquery), use it instead
        const containerThreads = $('.structItemContainer-group.js-threadList');
        const threads = [];

        containerThreads.children().each(function () {
            const $childObj = $(this);

            const threadDetailObj = {}

            // thread base detail
            threadDetailObj.title = $childObj.find('.structItem-title > a').text();
            threadDetailObj.creatorName = $childObj.find('.username')[0].innerText;
            threadDetailObj.createdDate = $childObj.find('.structItem-startDate time').attr('datetime');

            // thread base attributes
            const $latestObj = $childObj.find('.structItem-cell.structItem-cell--latest');
            threadDetailObj.latestCommentDate = $latestObj.find('.structItem-latestDate.u-dt').attr('datetime');
            threadDetailObj.latestUserCommentName = $latestObj.find('.username').text();

            // thread other attributes
            threads.push(threadDetailObj)
        });

        return threads
    })

    console.log(allThreads)
}
