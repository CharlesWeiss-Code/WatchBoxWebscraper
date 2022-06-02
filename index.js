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
AS = new AllScrapes();

async function start() {
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

  //await CandC.crownAndCaliber(lowPage, highPage, testPage, currentScrape); // mostly done (daytona stuff)

  //await Bobs.bobs(lowPage, highPage, testPage, currentScrape); //  Best one.
  await david.davidsw(lowPage, highPage, testPage, currentScrape); // mostly done (filter table data)
  await Bazaar.bazaar(lowPage, highPage, testPage, currentScrape); // Done
  await ewc.EWC(lowPage, highPage, testPage, currentScrape); //pretty much done
  await chrono.chrono24(lowPage, highPage, testPage, currentScrape); // done;
  //AllScrapes.addScrape(currentScrape);
  // console.log(AllScrapes.getDict()) + "\n\n\n";
  // console.log(AllScrapes.getAllScrapes());

  await browser.close();
  //await start();
}

start();
