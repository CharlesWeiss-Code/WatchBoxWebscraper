const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require("fs");

var lowest = "";
var lowYear = "";
var lowTable = "";
var lowBP = "";
var highest = "";
var highYear = "";
var lowPaper = "No";
var lowBox = "No";
var highBox = "No";
var highPaper = "No";
var highTable = "";
var highBP = "";
var imageLow = "";
var imageHigh = "";
var brandLow = "";
var brandHigh = "";
var lowSku = "";
var highSku = "";
async function bazaar(lowP, highP, tPage, list) {
  result = [];
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = "";
    lowYear = "";
    lowTable = "";
    lowBP = "";
    highest = "";
    highYear = "";
    lowPaper = "No";
    lowBox = "No";
    highBox = "No";
    highPaper = "No";
    highTable = "";
    highBP = "";
    imageLow = "";
    imageHigh = "";
    brandLow = "";
    brandHigh = "";
    lowSku = "";
    highSku = "";

    var newURL = "https://www.luxurybazaar.com/search-results?q=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    if (
      !(await utilFunc.noResults(
        tPage,
        'ul[class="products-grid infinite-load-items-wrapper ss-targeted ng-scope"]'
      ))
    ) {
      // no results
      continue;
    } else {
      await lowP.goto(
        "https://www.luxurybazaar.com/search-results?q=" +
          refNums[i] +
          "#/sort:ss_sort_price_asc:asc",
        { waitUntil: "networkidle0" }
      );
      await highP.goto(
        "https://www.luxurybazaar.com/search-results?q=" +
          refNums[i] +
          "#/sort:ss_sort_price_desc:desc",
        { waitUntil: "networkidle0" }
      );

      await lowP.waitForTimeout(500);
      await highP.waitForTimeout(500);
      lowest = await utilFunc.getItem(lowP, 'span[class="price ng-binding"]');

      highest = await utilFunc.getItem(highP, 'span[class="price ng-binding"]');

      await lowP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );
      await highP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );

      await lowP.waitForTimeout(500);
      await highP.waitForTimeout(500);

      lowTable = String(
        await utilFunc.getItem(lowP, 'div[class="attributes-table-container"]')
      );
      // console.log(lowTable) gets it
      highTable = String(
        await utilFunc.getItem(highP, 'div[class="attributes-table-container"]')
      );

      imageLow = String(
        await lowP
          .$eval("img[class='gallery-image visible']", (el) => el.src)
          .catch((err) => {
            return "";
          })
      );
      imageHigh = String(
        await highP
          .$eval("img[class='gallery-image visible']", (el) => el.src)
          .catch((err) => {
            return "";
          })
      );

      lowSku = await utilFunc.getItem(lowP, "div[class='web-id']");
      highSku = await utilFunc.getItem(highP, "div[class='web-id']");

      lowYearIndex1 = lowTable.indexOf("Year of Manufacture") + 19;
      lowYearIndex2 = lowYearIndex1 + 5;

      lowBPIndex1 = lowTable.indexOf("Included") + 8;
      lowBPIndex2 = lowTable.indexOf("Lug Material");
      highYearIndex1 = highTable.indexOf("Year of Manufacture") + 19;
      highYearIndex2 = highYearIndex1 + 5;

      highBPIndex1 = highTable.indexOf("Included") + 8;
      highBPIndex2 = highTable.indexOf("Lug Material");
      lowYear = lowTable
        .substring(lowYearIndex1, lowYearIndex2)
        .replace("\n", "")
        .replace("N/A", "")
        .replace("Unknown", "");
      lowBP = lowTable.substring(lowBPIndex1, lowBPIndex2).replace("\n", "");
      if (lowBP.replace(/[^a-zA-Z ]/g, "") === "Manufacturers Box and Papers") {
        lowPaper = "Yes";
        lowBox = "Yes";
      }

      highYear = highTable
        .substring(highYearIndex1, highYearIndex2)
        .replace("\n", "")
        .replace("N/A", "")
        .replace("Unknown", "");
      highBP = highTable
        .substring(highBPIndex1, highBPIndex2)
        .replace("\n", "");
        if (highBP.replace(/[^a-zA-Z ]/g, "") === "Manufacturers Box and Papers") {
        highPaper = "Yes";
        highBox = "Yes";
      }

      index1BrandLow = lowTable.indexOf("Signatures") + 10;
      index2BrandLow = lowTable.indexOf("Strap Color");

      index1BrandHigh = highTable.indexOf("Signatures") + 10;
      index2BrandHigh = highTable.indexOf("Strap Color");

      brandHigh = highTable.substring(index1BrandHigh, index2BrandHigh).trim();

      brandLow = lowTable.substring(index1BrandLow, index2BrandLow).trim();
    }
    console.log(lowBox, lowPaper, highBox, highPaper);
    w = new Watch(
      refNums[i],
      lowYear.trim(),
      highYear.trim(),
      lowBox,
      lowPaper,
      highBox,
      highPaper,
      lowest,
      highest,
      "",
      "",
      lowP.url(),
      highP.url(),
      tPage.url(),
      imageLow,
      imageHigh,
      brandLow,
      brandHigh,
      lowSku,
      highSku
    );
    list.push(w);
    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");

    //console.log(w);
    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
}

module.exports = { bazaar };
