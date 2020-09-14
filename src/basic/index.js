/**
 * Basic: Use Puppeteer-Go to go the a specific website
 * Then take a screenshot
 */
const {go} = require('puppeteer-go');

go('https://sethphat.com', async (page) => {
    await page.screenshot({path: 'screenshot.png'});
});