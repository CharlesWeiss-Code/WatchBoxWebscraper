const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const REF = require("../refNums");
const refNums = REF.getRefNums();
var fs = require("fs");

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

async function crownAndCaliber(lowP, highP, tPage, list) {
  for (var i = 0; i < refNums.length; i++) {
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
    var url =
      "https://www.crownandcaliber.com/search?view=shop&q=" + refNums[i];
    console.log("CandC URL: ***  " + url);

    if (refNums[i] === "116500LN-0001") {
      url =
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White";
    } else if (refNums[i] === "116500LN-0002") {
      url =
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black";
    }

    await tPage.goto(url, { waitUntil: "networkidle0" });
    if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
      //no results
      continue;
    } else {
      //results
      await prepare(lowP, highP, url);
      assignData();

      w = new Watch(
        refNums[i],
        lowYear,
        highYear,
        lowBox,
        lowPaper,
        highBox,
        highPaper,
        lowest.replace(/\s+/g, ""),
        highest.replace(/\s+/g, ""),
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
      list.push(w);
      fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");
      console.log(JSON.stringify(w, null, "\t"));
    }
  }
}

prepare = async (lowP, highP, link) => {
  endAsc = "#/sort:ss_price:asc";
  endDesc = "#/sort:ss_price:desc";
  if (link.indexOf("116500LN") != -1) {
    endAsc = "/sort:ss_price:asc";
    endDesc = "/sort:ss_price:desc";
  }
  await lowP.goto(link + endAsc, { waitUntil: "networkidle0" });
  await highP.goto(link + endDesc, {
    waitUntil: "networkidle0",
  });
  lowest = await utilFunc.getItem(
    lowP,
    'span[class="current-price product-price__price"]'
  );
  highest = await utilFunc.getItem(
    highP,
    'span[class="current-price product-price__price"]'
  );

  brandLow = await utilFunc.getItem(
    lowP,
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding"
  );
  brandHigh = await utilFunc.getItem(
    highP,
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding"
  );
  await lowP.click(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
    { delay: 20 }
  );

  await lowP.waitForTimeout(500);

  await highP.click(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
    { delay: 20 }
  );

  await lowP.waitForSelector('div[class="prod-specs"]');
  lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
  await highP.waitForSelector('div[class="prod-specs"]');
  highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');

  lowSku = await (
    await utilFunc.getItem(lowP, "p[class='itemNo']")
  ).replace("Item No. ", "");
  highSku = await (
    await utilFunc.getItem(highP, "p[class='itemNo']")
  ).replace("Item No. ", "");

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

assignData = () => {
  var lowYearIndex1 = lowTable.indexOf("Approximate Age - ") + 18;
  var lowYearIndex2 = lowTable.indexOf("Case Material - ");
  if (lowYearIndex1 === -1) {
    lowYearIndex1 = lowTable.indexOf("Year - ") + 7;
  }

  var lowBoxIndex1 = lowTable.indexOf("Box - ") + 6;
  var lowBoxIndex2 = lowTable.indexOf("Papers - ");
  var lowPaperIndex1 = lowBoxIndex2 + 9;
  var lowPaperIndex2 = lowTable.indexOf("Manual -");

  var highYearIndex1 = highTable.indexOf("Approximate Age - ") + 18;
  var highYearIndex2 = highTable.indexOf("Case Material - ");
  if (highYearIndex1 === -1) {
    highYearIndex1 = highTable.indexOf("Year - ") + 7;
  }

  var highBoxIndex1 = highTable.indexOf("Box - ") + 6;
  var highBoxIndex2 = highTable.indexOf("Papers - ");
  var highPaperIndex1 = highBoxIndex2 + 8;
  var highPaperIndex2 = highTable.indexOf("Manual -");
  
  
  
  lowYear = lowTable
    .substring(lowYearIndex1, lowYearIndex2)
    .replace(/\s+/g, "");
  if (lowYear.length > 5) {
    lowYear = lowYear.slice(-4);
  }

  lowPaper = lowTable.substring(lowBoxIndex1, lowBoxIndex2).replace(/\s+/g, "");
  lowBox = lowTable
    .substring(lowPaperIndex1, lowPaperIndex2)
    .replace(/\s+/g, "");
  highYear = highTable
    .substring(highYearIndex1, highYearIndex2)
    .replace(/\s+/g, "");
  if (highYear.length > 5) {
    highYear = highYear.slice(-4);
  }

  highPaper = highTable
    .substring(highBoxIndex1, highBoxIndex2)
    .replace(/\s+/g, "");
  highBox = highTable
    .substring(highPaperIndex1, highPaperIndex2)
    .replace(/\s+/g, "");

};

module.exports = { crownAndCaliber };
