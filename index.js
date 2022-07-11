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

var lowPage = null
var highPage = null
var testPage = null


async function start() {

  refNums = REF.getRefNums();

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
    args: minArgs.getMinimalArgs(),
  });
  testPage = await browser.newPage();
  lowPage = await browser.newPage();
  highPage = await browser.newPage();

  const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

  await lowPage.setRequestInterception(true);
  lowPage.on("request", (request) => {
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

  await highPage.setRequestInterception(true);
  highPage.on("request", (request) => {
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



  var watches = [];
  await Bazaar.bazaar(lowPage, highPage, testPage, watches);
  await newPages(browser);
  await CandC.crownAndCaliber(lowPage, highPage, testPage, watches);
  await newPages(browser);
  await ewc.EWC(lowPage, highPage, testPage, watches);
  await newPages(browser);
  await david.davidsw(lowPage, highPage, testPage, watches);
  await newPages(browser);
  await Bobs.bobs(lowPage, highPage, testPage, watches);
  await newPages(browser);
  await chrono.chrono24(lowPage, highPage, testPage, watches);

  await browser.close();

  //await start()
}

newPages = async (browser) => {
  lowPage.close();
  highPage.close();
  testPage.close();
  testPage = await browser.newPage();
  lowPage = await browser.newPage();
  highPage = await browser.newPage();
};

start();
