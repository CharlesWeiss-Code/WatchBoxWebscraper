const { download } = require("express/lib/response");
const puppeteer = require("puppeteer");

const fs = require("fs");
const editJsonFile = require("edit-json-file");

const request = require("request");

const CandC = require("./companies/CandC.js");
const chrono = require("./companies/crono.js");
const ewc = require("./companies/ewc.js");
const Bazaar = require("./companies/bazaar.js");
const david = require("./companies/davidsw.js");
const Bobs = require("./companies/bobs.js");

const REF = require("./refNums.js");
const minArgs = require("./minimalArgs");

const AllScrapes = require("./DataStructures/AllScrapes");
const Scrape = require("./DataStructures/Scrape");

const utilFunc = require("./utilityFunctions");
/*
I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
*/

async function start() {
  if (/**repeat(15) */  true) {
    currentScrape = new Scrape();
    refNums = REF.getRefNums();

    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      args: minArgs.getMinimalArgs(),
    });
    const lowPage = await browser.newPage();
    const highPage = await browser.newPage();
    const testPage = await browser.newPage();
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
    await CandC.crownAndCaliber(lowPage, highPage, testPage, watches) // can get sku but not daytona????
    await ewc.EWC(lowPage, highPage, testPage, watches)
    await david.davidsw(lowPage, highPage, testPage, watches) // can get sku
    await Bazaar.bazaar(lowPage, highPage, testPage, watches) // can get sku
    await Bobs.bobs(lowPage, highPage, testPage, watches) // can get sku
    await chrono.chrono24(lowPage, highPage, testPage, watches); // can get sku


    await browser.close();
  }
  // if (timeIsGood()) {
  //   utilFunc.uploadNewDataFile();
  // }
  //await start();
}

repeat = (hour) => {
  current = new Date();
  console.log(current.toUTCString()); /**runs at 6AM every day */
  return current.getUTCHours() === hour;
};

start();
