const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require('fs')
async function bazaar(lowP, highP, tPage, scrape) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    lowYear = "";
    lowTable = "";
    lowBP = "";
    highest = "-1";
    highYear = "";
    highTable = "";
    highBP = "";
    brandLow = ""
    brandHigh =""
    //https://www.luxurybazaar.com/search-results?q=116500LN-0001
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
      if (await utilFunc.exists(lowP, 'span[class="price ng-binding"]')) {
        lowest = await utilFunc.getItem(lowP, 'span[class="price ng-binding"]');
      }
      if (await utilFunc.exists(highP, 'span[class="price ng-binding"]')) {
        highest = await utilFunc.getItem(
          highP,
          'span[class="price ng-binding"]'
        );
      }
      await lowP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );
      await highP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );
      console.log("LOWPAGE URL: " + lowP.url());
      await lowP.waitForSelector('div[class="attributes-table-container"]');

      lowTable = await utilFunc.getItem(
        lowP,
        'div[class="attributes-table-container"]'
      );

      await highP.waitForSelector('div[class="attributes-table-container"]');
      highTable = await utilFunc.getItem(
        highP,
        'div[class="attributes-table-container"]'
      );

      assignData();
    }
    w = new Watch(
      refNums[i],
      lowYear.trim(),
      highYear.trim(),
      "",
      "",
      lowBP.trim(),
      "",
      "",
      highBP.trim(),
      lowest,
      highest,
      "",
      "",
      lowP.url(),
      highP.url(),
      tPage.url(),
      "",
      "",
      brandLow,
      brandHigh
    );

    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");

    //console.log(w);
    console.log(JSON.stringify(w,null,"\t"))
    //utilFunc.addToJson(w);
  }
}

assignData = () => {
  lowYearIndex1 = lowTable.indexOf("Year of Manufacture") + 19;
  lowYearIndex2 = lowYearIndex1 + 5;

  lowBPIndex1 = lowTable.indexOf("Included") + 8;
  lowBPIndex2 = lowTable.indexOf("Lug Material");
  highYearIndex1 = highTable.indexOf("Year of Manufacture") + 19;
  highYearIndex2 = highYearIndex1 + 5;

  highBPIndex1 = highTable.indexOf("Included") + 8;
  highBPIndex2 = highTable.indexOf("Lug Material");
  lowYear = lowTable.substring(lowYearIndex1, lowYearIndex2).replace("\n", "");
  lowBP = lowTable.substring(lowBPIndex1, lowBPIndex2).replace("\n", "");
  highYear = highTable
    .substring(highYearIndex1, highYearIndex2)
    .replace("\n", "");
  highBP = highTable.substring(highBPIndex1, highBPIndex2).replace("\n", "");
  index1BrandLow = lowTable.indexOf("Signatures")+10
  index2BrandLow = lowTable.indexOf("Strap Color")

  index1BrandHigh = highTable.indexOf("Signatures")+10
  index2BrandHigh = highTable.indexOf("Strap Color")

  brandHigh = highTable.substring(index1BrandHigh,index2BrandHigh).trim()

  brandLow = lowTable.substring(index1BrandLow,index2BrandLow).trim()

};

module.exports = { bazaar };
