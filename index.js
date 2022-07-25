/**
 * Index is where everything starts. All the companies functions are executed here.
 * Settings for puppeteer can be configured here.  Probably the most important setting for me, "headless", can be
 * changed here.
 */

const puppeteer = require("puppeteer");
const chrono = require("./companies/crono.js");
const ewc = require("./companies/ewc.js");
const Bazaar = require("./companies/bazaar.js");
const david = require("./companies/davidsw.js");
const Bobs = require("./companies/bobs.js");
const CandC = require("./companies/CandC");
const REF = require("./refNums.js");
const minArgs = require("./minimalArgs");
const utilFunc = require("./utilityFunctions");
/**
 * I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
 */

var lowPage = null;
var highPage = null;
var testPage = null;

async function start() {
  refNums = REF.getRefNums();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: minArgs.getMinimalArgs(),
  });
  testPage = await browser.newPage();
  lowPage = await browser.newPage();
  highPage = await browser.newPage();

  await setupPage(lowPage);
  await setupPage(highPage);
  await setupPage(testPage);

  // await Bazaar.bazaar(lowPage, highPage, testPage);
  // await newPages(browser);
  // await utilFunc.sendMessage(
  //   "Completed Bazaar: " + new Date().toLocaleString()
  // );
  // await CandC.crownAndCaliber(lowPage, highPage, testPage);
  // await newPages(browser);
  // utilFunc.sendMessage("Completed CandC: " + new Date().toLocaleString());

  // await ewc.EWC(lowPage, highPage, testPage);
  // await newPages(browser);
  // utilFunc.sendMessage("Completed EWC: " + new Date().toLocaleString());

  // await david.davidsw(lowPage, highPage, testPage);
  // await newPages(browser);
  // utilFunc.sendMessage("Completed DavidSW: " + new Date().toLocaleString());

  // await Bobs.bobs(lowPage, highPage, testPage);
  // await newPages(browser);
  // utilFunc.sendMessage("Completed Bobs: " + new Date().toLocaleString());

  await chrono.chrono24(
    lowPage,
    highPage,
    testPage,
    utilFunc.getPricesForAverage()
  );
  await browser.close();
  utilFunc.sendMessage("Completed C24: " + new Date().toLocaleString());
  utilFunc.sendMessage("**SCRAPE COMPLETED**\n" + new Date().toLocaleString());
}

newPages = async (browser) => {
  lowPage.close();
  highPage.close();
  testPage.close();
  testPage = await browser.newPage();
  lowPage = await browser.newPage();
  highPage = await browser.newPage();
};

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
