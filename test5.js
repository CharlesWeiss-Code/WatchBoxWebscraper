const puppeteer = require("puppeteer");

var browser = null;
var page = null;

const f = async (URL) => {
  try {
    await page.goto(URL);
    console.log("Success: " + URL);
    await browser.close();
  } catch (error) {
    console.log("Error with: " + URL);
    await f("https://www.google.com");
  }
};

setup = async () =>
  new Promise(async function (resolve, reject) {
    browser = await puppeteer.launch({
      headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    });
    page = await browser.newPage();
    resolve();
  });

setup().then(async () => {
  await f(0);
});
