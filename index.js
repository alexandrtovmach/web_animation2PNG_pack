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
  const dir = `./screenshots/${/\/\/([a-zA-Z0-9\.]*)\//.exec(link)[1].replace(/\./g, '')}`

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  puppeteer.launch()
    .then((browser) => {
      browser.newPage()
        .then((page) => {
          page.goto(link)
            .then(() => {
              pageLoading(page)
                .then(() => {
                  browser.close();
                })
            })
        })
    });

  const pageLoading = function (pageInstance) {
    return new Promise(function executor(resolve) {
      counter++;
      pageInstance.screenshot({
        path: `${dir}/${counter}.png`,
        fullPage: fullPage
      })
      .then(() => {
        if (counter >= recordDuration*FPS) {
          console.log(`Captured ${counter}.png`);
          console.log("Finished");
          resolve();
        } else {
          console.log(`Captured ${counter}.png`);
          setTimeout(executor.bind(null, resolve), 500/FPS);
        }
      })
    });
  }
  
})();