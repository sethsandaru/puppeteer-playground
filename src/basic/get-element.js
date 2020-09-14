/**
 * Basic: Use Puppeteer-Go to go the a specific website
 * Then get an element, data,...
 *
 * This basic, we will get the H1 data
 */
const {go} = require('puppeteer-go');

go('https://sethphat.com', async (page) => {
    const elements = await page.$$("h1")

    let h1Data = await page.evaluate(() => {
        return document.getElementsByTagName("h1")[0].innerText;
    })

    console.log("Element Totals:", elements.length)
    console.log("Element Data:", h1Data)
});