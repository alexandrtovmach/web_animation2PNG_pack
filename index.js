const puppeteer = require('puppeteer');
const fs = require('fs');
const {link, recordDuration=1, fullPage, FPS=60} = require('./config.js');

if (!link) {
  throw new Error('"link" is required. Please check the "config.js"')
} else if (typeof(recordDuration) !== 'number') {
  throw new Error('"recordDuration" must be a integer. Please check the "config.js"')
} else if (typeof(FPS) !== 'number') {
  throw new Error('"FPS" must be a integer. Please check the "config.js"')
}

(async () => {
  let counter = 0;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const dir = `./screenshots/${/\/\/([a-zA-Z0-9\.]*)\//.exec(link)[1].replace(/\./g, '')}`

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  await page.goto(link);

  while(counter < recordDuration*FPS) {
    counter++;
    await page.screenshot({
      path: `${dir}/${counter}.png`,
      fullPage: fullPage
    })
  }
  

  await browser.close();
})();