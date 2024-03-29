const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const REF = require("../refNums");
const refNums = REF.getRefNums();
var fs = require("fs");
const { Puppeteer } = require("puppeteer");

var lowYear = "";
var lowPaper = "No";
var lowBox = "No";
var highYear = "";
var highPaper = "No";
var highBox = "No";
var lowTable = "";
var highTable = "";
var lowImage = "";
var highImage = "";
var brandLow = "";
var brandHigh = "";
var lowSku = "";
var highSku = "";

async function crownAndCaliber(lowP, highP, tPage, startIndex) {
  for (var i = startIndex; i < refNums.length; i++) {
    try {
      lowYear = "";
      lowPaper = "No";
      lowBox = "No";
      highYear = "";
      highPaper = "No";
      highBox = "No";
      lowTable = "";
      highTable = "";
      lowImage = "";
      highImage = "";
      brandLow = "";
      brandHigh = "";
      lowSku = "";
      highSku = "";

      var url = utilFunc.getLink("C&C", refNums[i]);

      console.log("CandC URL: ***  " + url);
      console.log(
        i + refNums.length + "/" + refNums.length * 6,
        ((i + refNums.length) / (refNums.length * 6)) * 100 + "%"
      );
      await tPage.goto(url, { waitUntil: "networkidle0" }).catch(async (e) => {
        await utilFunc.reTry(tPage,0);
      });
      await tPage.waitForTimeout(500);
      if (
        await utilFunc.noResults(
          tPage,
          "h3[class='ss-title ss-results-title ss-no-results-title ng-binding ng-scope']"
        )
      ) {
        //no results
        continue;
      } else {
        //results
        await prepare(lowP, highP, url);
        assignData();

        if (lowest != "" || highest != "") {
          w = new Watch(
            refNums[i],
            lowYear,
            highYear,
            lowBox,
            lowPaper,
            highBox,
            highPaper,
            lowest.replaceAll(/\s+/g, ""),
            highest.replaceAll(/\s+/g, ""),
            "",
            "",
            lowP.url(),
            highP.url(),
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
    } catch (error) {
      console.log("Restarting at " + i + " ...");
      await crownAndCaliber(lowP, highP, tPage, i);
      break;
    }
  }
}

/**
 * @param {Puppeteer.Page} lowP that you want to get the table of information from (lowest price)
 * @param {Puppeteer.Page} highP that you want to get the table of information from (highest price)
 * @param {String} link that you want to direct lowP and highP to
 */
prepare = async (lowP, highP, link) => {
  endAsc = "/sort:ss_price:asc";
  endDesc = "/sort:ss_price:desc";

  await lowP
    .goto(link + endAsc, { waitUntil: "networkidle0" })
    .catch(async (e) => {
      await utilFunc.reTry(lowP,0);
    });
  await highP
    .goto(link + endDesc, {
      waitUntil: "networkidle0",
    })
    .catch(async (e) => {
      await utilFunc.reTry(highP,0);
    });

  if (await utilFunc.exists(lowP, "#searchspring-content > h3")) {
    await lowP.goto(link + "#/sort:ss_price:asc").catch(async (e) => {
      await utilFunc.reTry(lowP,0);
    });
  }

  await lowP.waitForTimeout(1000);

  if (await utilFunc.exists(highP, "#searchspring-content > h3")) {
    await highP.goto(link + "#/sort:ss_price:desc").catch(async (e) => {
      await utilFunc.reTry(highP,0);
    });
  }
  await highP.waitForTimeout(1000);

  lowest = String(
    await utilFunc.getItem(
      lowP,
      "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span"
    )
  );
  highest = String(
    await utilFunc.getItem(
      highP,
      "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span"
    )
  );

  brandLow = await utilFunc.getItem(
    lowP,
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding"
  );
  brandHigh = await utilFunc.getItem(
    highP,
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding"
  );

  await lowP.reload();
  await lowP.waitForTimeout(500);
  await lowP
    .click(
      "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
      { delay: 20 }
    )
    .catch(async (err) => {
      await lowP.waitForTimeout(999999);
      console.log("COULDNT CLICK THE THING");
      await lowP.goto(lowP.url()).catch(async (e) => {
        await utilFunc.reTry(lowP,0);
      });
      await lowP.waitForTimeout(500);
      await lowP.click(
        "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
        { delay: 20 }
      );
    });

  await lowP.reload();
  await lowP.waitForTimeout(500);
  await highP.click(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
    { delay: 20 }
  );

  await highP.reload();
  await highP.waitForTimeout(500);

  lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');

  highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');

  lowSku = await (
    await utilFunc.getItem(lowP, "p[class='itemNo']")
  ).replaceAll("Item No. ", "");
  highSku = await (
    await utilFunc.getItem(highP, "p[class='itemNo']")
  ).replaceAll("Item No. ", "");

  lowImage = await lowP
    .$eval("img[class='zoomImg']", (el) => el.src)
    .catch((err) => {
      return "";
    });
  highImage = await highP
    .$eval("img[class='zoomImg']", (el) => el.src)
    .catch((err) => {
      return "";
    });
};

/**
 * @returns {void} assigns all neccesary fields for a new watch object
 */
assignData = () => {
  var lowYearIndex1 = lowTable.indexOf("Approximate Age - ") + 18;
  //var lowYearIndex2 = lowTable.indexOf("Case Material - ");
  if (lowYearIndex1 === 17) {
    lowYearIndex1 = lowTable.indexOf("Year - ") + 7;
  }
  lowYear = lowTable.substring(lowYearIndex1).trim();
  lowYear = lowYear.substring(0, lowYear.indexOf("\n"));

  var lowBoxIndex1 = lowTable.indexOf("Box - ") + 6;
  var lowBoxIndex2 = lowTable.indexOf("Papers - ");
  var lowPaperIndex1 = lowBoxIndex2 + 9;
  var lowPaperIndex2 = lowTable.indexOf("Manual -");

  var highYearIndex1 = highTable.indexOf("Approximate Age - ") + 18;
  var highYearIndex2 = highTable.indexOf("Case Material - ");
  if (highYearIndex1 === 17) {
    highYearIndex1 = highTable.indexOf("Year - ") + 7;
  }
  highYear = highTable.substring(highYearIndex1).trim();
  highYear = highYear.substring(0, highYear.indexOf("\n"));

  var highBoxIndex1 = highTable.indexOf("Box - ") + 6;
  var highBoxIndex2 = highTable.indexOf("Papers - ");
  var highPaperIndex1 = highBoxIndex2 + 8;
  var highPaperIndex2 = highTable.indexOf("Manual -");

  lowYear = lowYear.replaceAll(/\s+/g, "");
  if (lowYear.length > 5 && lowYear.indexOf("-Present") === -1) {
    lowYear = lowYear.slice(-4);
  } else {
    lowYear = lowYear.substring(0, 4) + "+";
  }

  lowPaper = lowTable.substring(lowBoxIndex1, lowBoxIndex2).replaceAll(/\s+/g, "");
  lowBox = lowTable
    .substring(lowPaperIndex1, lowPaperIndex2)
    .replaceAll(/\s+/g, "");

  highYear = highTable
    .substring(highYearIndex1, highYearIndex2)
    .replaceAll(/\s+/g, "");

  if (highYear.length > 5 && highYear.indexOf("-Present") === -1) {
    highYear = highYear.slice(-4);
  } else {
    highYear = highYear.substring(0, 4) + "+";
  }

  highPaper = highTable
    .substring(highBoxIndex1, highBoxIndex2)
    .replaceAll(/\s+/g, "");
  highBox = highTable
    .substring(highPaperIndex1, highPaperIndex2)
    .replaceAll(/\s+/g, "");
};

module.exports = { crownAndCaliber };
