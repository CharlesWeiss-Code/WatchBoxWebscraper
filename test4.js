/**
 * Index is where everything starts. All the companies functions are executed here.
 * Settings for puppeteer can be configured here.  Probably the most important setting for me, "headless", can be
 * changed here.
 */

const puppeteer = require("puppeteer");

/**
 * I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
 */

var lowPage = null;
var highPage = null;
var testPage = null;
var firstToday = true;

async function start() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  });
  page = await browser.newPage();
  await setupPage(page);
  await page.goto(
    "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=116508-0013"
  );
  const top = await page.$eval("#wt-watches", (res) => res.children.length);
  for (var i = 1; i <= top; i++) {
    const price = await page
      .$eval(
        "#wt-watches > div:nth-child(" +
          i +
          ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong",
        (el) => el.innerText
      )
      .catch(() => "-1");
    console.log(parseFloat(price.replace(",", "").replace("$", "").trim()));
  }

  await browser.close();
}

async function setupPage(page) {
  const blocked_domains = ["googlesyndication.com", "adservice.google.com"];
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    const url = request.url();
    if (
      blocked_domains.some((domain) => url.includes(domain)) ||
      (request.isNavigationRequest() && request.redirectChain().length)
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

start();
