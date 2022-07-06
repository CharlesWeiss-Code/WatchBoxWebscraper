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
  if (/**repeat(15) */ true) {
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

    //************************************ */
    await testPage.goto("https://www.bobswatches.com/rolex/", {
      waitUntil: "networkidle0",
    });

    await testPage.click("#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-pagination.ss-targeted.ng-scope > div > div > div > div.categoryPaginationButton.categoryPaginationButtonNext.categoryPaginationButtonNextLast > a")


    totalPages = testPage.url().substring(testPage.url().indexOf("=")+1)
    
    var total = 0;
    console.log(testPage.url())
    await testPage.goto("https://www.bobswatches.com/rolex/?page=1")
    console.log("totalPages", totalPages)
    for (var pages = 1; pages <= totalPages; pages++) {
        thing = await testPage.$(
            "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-item-container.seocart_Category_wrapper.ss-targeted"
          );
          top = await testPage.evaluate((e) => e.children.length, thing);
          await testPage.click(
            "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-pagination.ss-targeted.ng-scope > div > div > div > div.categoryPaginationButton.categoryPaginationButtonNext.categoryPaginationButtonNextLast"
          );

        await testPage.goto("https://www.bobswatches.com/rolex/?page="+pages)
        await testPage.waitForTimeout(500)
        console.log("Total Watches", top)

      for (var i = 1; i <= top; i++) {
        const price = await utilFunc.getItem(
          testPage,
          "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-item-container.seocart_Category_wrapper.ss-targeted > div:nth-child(" +
            i +
            ") > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
        );
        const title = await utilFunc.getItem(
          testPage,
          "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-item-container.seocart_Category_wrapper.ss-targeted > div:nth-child(" +
            i +
            ") > div > form > a > p.productTitle"
        );
        total++;

        console.log(total,title, price, "******");
        
      }
      await testPage.click("#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div.ss-pagination.ss-targeted.ng-scope > div > div > div > div:nth-child(4)")
    }

    //************************************ */

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
