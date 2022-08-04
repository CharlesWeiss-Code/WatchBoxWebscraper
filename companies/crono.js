const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const refN = require("../refNums");
const { Puppeteer } = require("puppeteer");
var refNums = refN.getRefNums();

var lowest = "";
var highest = "";
var childLow = 1;
var childHigh = 1;
var brandLow = "";
var brandHigh = "";
var highTable = "";
var lowTable = "";
var yearLow = "";
var yearHigh = "";
var lowBP = "";
var lowBox = "No";
var lowPaper = "No";
var highBox = "No";
var highPaper = "No";
var lowImage = "";
var highImage = "";
var highBP = "";
var lowSku = "";
var highSku = "";
var lowDealerStatus = "";
var highDealerStatus = "";

async function chrono24(lowP, highP, tPage, list) {
  flag = true;
  for (var i = 59; i < refNums.length; i++) {
    lowest = "";
    highest = "";
    childLow = 1;
    childHigh = 1;
    brandLow = "";
    brandHigh = "";
    highTable = "";
    lowTable = "";
    yearLow = "";
    yearHigh = "";
    lowBP = "";
    lowBox = "No";
    lowPaper = "No";
    highBox = "No";
    highPaper = "No";
    lowImage = "";
    highImage = "";
    highBP = "";
    lowSku = "";
    highSku = "";

    console.log("\n\n");
    var newURL = utilFunc.getLink("C24", refNums[i]);

    console.log("NEW URL: " + newURL);
    console.log(
      i + 5 * refNums.length + "/" + refNums.length * 6,
      ((i + 5 * refNums.length) / (refNums.length * 6)) * 100 + "%"
    );
    await tPage.goto(newURL, { waitUntil: "networkidle0" }).catch(async (e) => {
      await utilFunc.reTry(tPage);
    });
    await tPage.waitForTimeout(500);
    var noWatchInList = noWatchesInList(list, refNums[i]);
    var noResult = await utilFunc.noResults2(
      tPage,
      "div[class='h1 m-b-0 text-center']",
      "We've found no results"
    );
    if (noWatchInList || noResult) {
      //no results or the watch doesnt have any entries
      console.log("No watch in list", noWatchInList, "No result", noResult);
      continue;
    } else {
      // results
      await prepareStuff(lowP, highP, newURL, list, refNums[i]);
      if (
        parseFloat(lowest.trim()) > parseFloat(highest.trim()) ||
        (highest === "" && lowest === "")
      ) {
        continue;
      } else {
        var highLink = highP.url();
        var lowLink = lowP.url();
        if (childHigh === -1) {
          highLink = "";
        }
        if (childLow === -1) {
          lowLink = "";
        }
        w = new Watch(
          refNums[i],
          yearLow,
          yearHigh,
          lowBox,
          lowPaper,
          highBox,
          highPaper,
          lowest.trim(),
          highest.trim(),
          lowDealerStatus,
          highDealerStatus,
          lowLink,
          highLink,
          tPage.url(),
          lowImage,
          highImage,
          brandLow,
          brandHigh,
          lowSku,
          highSku
        );
        fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
        console.log(JSON.stringify(w, null, "\t"));
      }
    }
  }
}

/**
 * @param {Puppeteer.Page} lowP that you want to get information from
 * @param {Puppeteer.Page} highP that you want to get information from
 * @param {String} url that will serve as a template for the actual urls that lowP and highP go to
 * @param {[Watch]} list of watches from the beginning of the current scrape to now
 * @param {String} rn that is currently being scraped
 * @returns {void} assigns the values neccesary for creating a new watch object
 */
prepareStuff = async (lowP, highP, url, list, rn) => {
  await lowP
    .goto(url + "&sortorder=1", { waitUntil: "networkidle0" })
    .catch(async (e) => {
      await utilFunc.reTry(lowP);
    });
  await lowP.waitForTimeout(500);
  if (await utilFunc.exists(lowP, "#modal-content > div > button")) {
    await lowP.click("#modal-content > div > button"); // cookie tracker button
    await lowP.waitForTimeout(500);
  }

  //await highP.click("#modal-content > div > a", {delay: 20})
  childHigh = await validChild(highP, list, rn, 2, "High");
  childLow = await validChild(lowP, list, rn, 2, "Low");
  if (childLow != -1) {
    await lowP.waitForTimeout(500);
    lowest = await utilFunc.getItem(
      lowP,
      "#wt-watches > div:nth-child(" +
        childLow +
        ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
    );
    if (lowest === "") {
      lowest = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(" +
          childHigh +
          ") > a > div > div.media-flex-body.p-y-2.p-r-2 > div.article-price-container > div.article-price > div > strong"
      );
    }
    lowDealerStatus = await utilFunc.getItem(
      lowP,
      "#wt-watches > div:nth-child(" +
        childLow +
        ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
    );

    if (lowDealerStatus === "") {
      lowDealerStatus = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(" +
          childLow +
          ") > a > div > div.media-flex-body.p-y-2.p-r-2 > div.article-seller-container > div > div.media-flex-body.d-flex.flex-column > div.article-seller-name.text-sm"
      );
    }

    if (lowDealerStatus.replace("\n", "").trim() === "Professional dealer") {
      lowDealerStatus = "PD";
    } else if (lowDealerStatus.replace("\n", "").trim() === "Private seller") {
      lowDealerStatus = "PS";
    } else {
      lowDealerStatus = "";
    }

    const lowLink = await lowP.$eval(
      "#wt-watches > div:nth-child(" + childLow + ") > a",
      (res) => res.href
    );
    await lowP.goto(lowLink, { waitUntil: "networkidle0" }).catch(async (e) => {
      await utilFunc.reTry(lowP);
    });
    await lowP.reload();
    await lowP.waitForTimeout(500);

    lowTable = String(
      await utilFunc.getItem(
        lowP,
        "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
      )
    );

    lowImage = String(
      await lowP
        .$eval("img[class='img-responsive mh-100']", (el) => el.src)
        .catch((err) => {
          return "";
        })
    );

    index1BrandLow = lowTable.indexOf("Brand") + 5;
    index2BrandLow = lowTable.indexOf("Model");

    if (
      index1BrandLow != 4 &&
      index1BrandLow != lowTable.indexOf("Brand new") + 5
    ) {
      if (index2BrandLow === -1) {
        index2BrandLow = lowTable.indexOf("Reference number");
      }
    }

    index1YearLow = lowTable.indexOf("Year of production") + 18;
    index2YearLow = lowTable.indexOf("Condition");
    if (index2YearLow === -1) {
      index2YearLow = lowTable.indexOf("Scope of delivery");
    }
    index1BPLow = lowTable.indexOf("Scope of delivery") + 17;
    index2BPLow = lowTable.indexOf("Gender");
    if (index2BPLow === -1) {
      index2BPLow = lowTable.indexOf("Location");
    }

    lowSku = await utilFunc.getItem(
      lowP,
      "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)"
    );

    brandLow = lowTable.substring(index1BrandLow, index2BrandLow).trim();
    if (brandLow.length > 50) {
      brandLow = "";
    }

    yearLow = lowTable
      .substring(index1YearLow, index2YearLow)
      .replace(/\s+/g, "")
      .replace("Unknown", "");

    lowBP = lowTable.substring(index1BPLow, index2BPLow).trim().toLowerCase();
    if (lowBP.indexOf("original box") != -1) {
      lowBox = "Yes";
    }
    if (lowBP.indexOf("original papers") != -1) {
      lowPaper = "Yes";
    }
  }
  if (childHigh != -1) {
    await highP
      .goto(url + "&searchorder=11&sortorder=11", { waitUntil: "networkidle0" })
      .catch(async (e) => {
        await utilFunc.reTry(highP);
      });
    await highP.waitForTimeout(1000);
    //await highP.click("#modal-content > div > a", {delay: 20})
    await highP.waitForTimeout(500);
    highest = await utilFunc.getItem(
      highP,
      "#wt-watches > div:nth-child(" +
        childHigh +
        ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
    );
    if (highest === "") {
      highest = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child(" +
          childHigh +
          ") > a > div > div.media-flex-body.p-y-2.p-r-2 > div.article-price-container > div.article-price > div > strong"
      );
    }
    highDealerStatus = await utilFunc.getItem(
      highP,
      "#wt-watches > div:nth-child(" +
        childHigh +
        ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
    );

    if (highDealerStatus === "") {
      highDealerStatus = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child(" +
          childHigh +
          ") > a > div > div.media-flex-body.p-y-2.p-r-2 > div.article-seller-container > div > div.media-flex-body.d-flex.flex-column > div.article-seller-name.text-sm"
      );
    }

    if (highDealerStatus.replace("\n", "").trim() === "Professional dealer") {
      highDealerStatus = "PD";
    } else if (highDealerStatus.replace("\n", "").trim() === "Private seller") {
      highDealerStatus = "PS";
    } else {
      highDealerStatus = "";
    }

    if (await utilFunc.exists(highP, "#modal-content > div > button")) {
      await highP.click("#modal-content > div > button");
    }

    // await highP.click("#wt-watches > div:nth-child(" + childHigh + ") > a", {
    //   delay: 20,
    // });
    const highLink = await highP.$eval(
      "#wt-watches > div:nth-child(" + childHigh + ") > a",
      (res) => res.href
    );
    await highP
      .goto(highLink, { waitUntil: "networkidle0" })
      .catch(async (e) => {
        await utilFunc.reTry(highP);
      });

    await highP.reload();
    await highP.waitForTimeout(500);

    highTable = String(
      await utilFunc.getItem(
        highP,
        "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
      )
    );

    highImage = String(
      await highP
        .$eval("img[class='img-responsive mh-100']", (el) => el.src)
        .catch((err) => {
          return "";
        })
    );

    /***************** */

    index1BrandHigh = highTable.indexOf("Brand") + 5;
    index2BrandHigh = highTable.indexOf("Model");

    if (
      index1BrandHigh != 4 &&
      index1BrandLow != lowTable.indexOf("Brand new") + 5
    ) {
      if (index2BrandHigh === -1) {
        index2BrandHigh = highTable.indexOf("Reference number");
      }
    }
    /***************** */

    /***************** */
    index1YearHigh = highTable.indexOf("Year of production") + 18;
    index2YearHigh = highTable.indexOf("Condition");
    if (index2YearHigh === -1) {
      index2YearHigh = highTable.indexOf("Scope of delivery");
    }
    /***************** */

    /***************** */

    index1BPHigh = highTable.indexOf("Scope of delivery") + 17;
    index2BPHigh = highTable.indexOf("Gender");
    if (index2BPHigh === -1) {
      index2BPHigh = highTable.indexOf("Location");
    }
    /***************** */
    highSku = await utilFunc.getItem(
      highP,
      "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2)"
    );

    if (brandHigh.length > 50) {
      brandHigh = "";
    }
    brandHigh = highTable.substring(index1BrandHigh, index2BrandHigh).trim();

    yearHigh = highTable
      .substring(index1YearHigh, index2YearHigh)
      .replace(/\s+/g, "")
      .replace("Unknown", "");

    highBP = highTable
      .substring(index1BPHigh, index2BPHigh)
      .trim()
      .toLowerCase();
    if (highBP.indexOf("original box") != -1) {
      highBox = "Yes";
    }
    if (highBP.indexOf("original papers") != -1) {
      highPaper = "Yes";
    }
  }
};

/**
 * @param {Puppeteer.Page} page that you want to find the lowest nth-child(k) for k that isn't a "Top" choice by Chrono24.
 * @param {[Watch]} arr of watches from the beginning of the current scrape to now
 * @param {String} rn that is currently being scraped
 * @returns {int} nth-child(k) for k that isn't a "Top" choice by Chrono24.
 */
validChild = async (page, arr, rn, pageNum, highOrLow) => {
  console.log(page.url())
  await page.waitForTimeout(1000);
  min = getBuffer(arr, 0.9, rn);
  max = getBuffer(arr, 1.1, rn);
  console.log("Min " + min + "\tMax " + max);
  top = await page
    .$eval("#wt-watches", (e) => e.children.length)
    .catch(() => {
      return 1;
    });
  console.log(top + " possible watches on page " + (pageNum-1));
  for (var i = 1; i <= top; i++) {
    var watch = await typeOf(page, "#wt-watches > div:nth-child(" + i + ")");
    var isntTop = await noTop(page, "#wt-watches > div:nth-child(" + i + ")");
    var price = await page
      .$eval(
        "#wt-watches > div:nth-child(" +
          i +
          ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong",
        (el) => el.innerText
      )
      .catch(() => "-1");
    price = parseFloat(price.replace("$", "").replace(",", "").trim());
    if (watch && isntTop) {
      console.log(price, i);
    }
    if (watch && isntTop && price > min && price < max) {
      console.log("Selected:",price, i);
      return i;
    }
  }

  if (page.url().indexOf("&showpage=") != -1) {
    await page
      .goto(page.url().substring(0, page.url().lastIndexOf("=") + 1) + pageNum)
      .catch(async () => await utilFunc.reTry(page));
    console.log("Going to page " + pageNum + "\n" + page.url());
  } else {
    await page
      .goto(page.url() + "&showpage=" + pageNum, { waitUntil: "networkidle0" })
      .catch(async () => {
        await utilFunc.reTry(page);
      });
    console.log("Going to page " + pageNum + "\n" + page.url());
  }

  if (await utilFunc.exists(page, "div[id='wt-watches']")) {
    await page.waitForTimeout(1000);
    return await validChild(page, arr, rn, pageNum + 1);
  } else {
    page.goto("about:blank");
    console.log("No listing fits the requirements: " + highOrLow);
    return -1;
  }
};

/**
 * @param {[Watch]} list of watches from the beginning of the current scrape to now
 * @param {float} percent that you want to multiply the average by
 * @param {String} refNum that you want to find the average price of
 * @returns {float} maximum/minimum price used to filter chrono24 results
 */
getBuffer = (list, percent, refNum) => {
  var price = 0;
  var num = 0;

  for (var i = 0; i < list.length; i++) {
    watch = list[i];
    low = parseFloat(watch["lowPrice"].trim());
    high = parseFloat(watch["highPrice"].trim());
    if (watch["refNum"].trim().indexOf(refNum.trim()) != -1) {
      if (percent === 0.9) {
        if (low != NaN) {
          price += low;
          num++;
        }
      } else {
        if (high != NaN) {
          price += high;
          num++;
        }
      }
    }
  }
  if (num != 0) {
    return (price / num) * percent;
  } else {
    if (percent === 0.9) {
      return 0;
    } else {
      return Number.MAX_SAFE_INTEGER;
    }
  }
};

/**
 * @param {Puppeteer.Page} page that the child element is in.
 * @param {String} sel that you want to check the type of
 * @returns {boolean} is the type a watch or not
 */
typeOf = async (page, sel) => {
  let element = await page.$(sel);
  if (element === null) {
    return false;
  } else {
    let value = await page.evaluate((el) => el.className, element);
    if (String(value) === "article-item-container wt-search-result") {
      return true;
    } else {
      return false;
    }
  }
};

/**
 * @param {Puppeteer.Page} page
 * @param {String} sel in question that may represent a "Top" choice from Chrono24
 * @returns {boolean} is the selector a "Top" choice or not.
 */
noTop = async (page, sel) => {
  let element = await page.$(sel);
  if (element === null) {
    return false;
  } else {
    let value = await page.evaluate((el) => el.textContent, element);
    return value.indexOf("Top") === -1;
  }
};

/**
 * @param {[Watch]} list of watches from the beginning of the current scrape to now
 * @param {String} rn of the current watch being scraped
 * @returns {boolean} is the current reference number represented anywhere in the [Watches]
 */
noWatchesInList = (list, rn) => {
  for (var i = 0; i < list.length; i++) {
    if (list[i]["refNum"].trim().indexOf(rn) != -1) {
      console.log("Watch Exists");
      return false;
    }
  }
  return true;
};

module.exports = { chrono24 };
