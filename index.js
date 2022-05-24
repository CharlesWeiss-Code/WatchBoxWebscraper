const { download } = require("express/lib/response");
const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");

const CandC = require("./companies/CandC.js");
const chrono = require("./companies/crono.js");
const ewc = require("./companies/ewc.js");
const Bazaar = require("./companies/bazaar.js");
const david = require("./companies/davidsw.js");
const Bobs = require("./companies/bobs.js");

const REF = require("./refNums.js");
const minArgs = require("./minimalArgs");
const utilFunc = require("./utilityFunctions.js");

/*
I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
*/

async function start() {
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
    if (blocked_domains.some((domain) => url.includes(domain))) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await highPage.setRequestInterception(true);
  highPage.on("request", (request) => {
    const url = request.url();
    if (blocked_domains.some((domain) => url.includes(domain))) {
      request.abort();
    } else {
      request.continue();
    }
  });

  //await CandC.crownAndCaliber(lowPage, highPage, testPage); // mostly done (daytona stuff)
  await Bobs.bobs(lowPage, highPage, testPage); // mostly done (filter table data)
  //await david.davidsw(lowPage, highPage, testPage); // mostly done (filter table data)
  //await Bazaar.bazaar(lowPage, highPage, testPage); // Done
  //await ewc.EWC(lowPage, highPage, testPage); //pretty much done
  //await chrono.chrono24(lowPage, highPage, testPage); // done;
  //start();

  await browser.close();
}
start();
