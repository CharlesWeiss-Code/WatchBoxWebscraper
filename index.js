const { download } = require("express/lib/response");
const puppeteer = require("puppeteer");

const fs = require("fs");
const editJsonFile = require("edit-json-file");

const request = require("request");

const chrono = require("./companies/crono.js");
const ewc = require("./companies/ewc.js");
const Bazaar = require("./companies/bazaar.js");
const david = require("./companies/davidsw.js");
const Bobs = require("./companies/bobs.js");
const CandC = require("./companies/CandC");
const REF = require("./refNums.js");
const minArgs = require("./minimalArgs");




const utilFunc = require("./utilityFunctions");
/*
I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
*/
var lowPage = null
var highPage = null
var testPage = null

async function start() {


  // if (repeat(15)) {
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

  //console.log(utilFunc.newDay());

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
  // }

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

newPages = async (browser) => {
  lowPage.close();
  highPage.close();
  testPage.close();
  testPage = await browser.newPage();
  lowPage = await browser.newPage();
  highPage = await browser.newPage();
};

start();
