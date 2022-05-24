const utilFunc = require("../utilityFunctions.js");

async function bazaar(lowP, highP, tPage) {
  for (var i = 2; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    //https://www.luxurybazaar.com/search-results?q=116500LN-0001
    var newURL = "https://www.luxurybazaar.com/search-results?q=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    if (
      await utilFunc.exists(
        tPage,
        "#searchspring-content > div.category-products.ng-scope > div > div:nth-child(1) > h3"
      )
    ) {
      // this is the only one that can have its own function. there are two selectors
      lowest = 0;
      highest = 0;
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
          lowP,
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

      lowTable = await getItem(lowP, 'div[class="attributes-table-container"]');
      lowYearIndex1 = lowTable.indexOf("Year of Manufacture") + 19;
      lowYearIndex2 = lowYearIndex1 + 5;

      lowBPIndex1 = lowTable.indexOf("Included") + 8;
      lowBPIndex2 = lowTable.indexOf("Lug Material");

      await highP.waitForSelector('div[class="attributes-table-container"]');
      highTable = await utilFunc.getItem(
        highP,
        'div[class="attributes-table-container"]'
      );
      highYearIndex1 = highTable.indexOf("Year of Manufacture") + 19;
      highYearIndex2 = highYearIndex1 + 5;

      highBPIndex1 = highTable.indexOf("Included") + 8;
      highBPIndex2 = highTable.indexOf("Lug Material");
      console.log("Lowest: " + lowest);
      console.log(
        "Low year: " + lowTable.substring(lowYearIndex1, lowYearIndex2)
      );
      console.log(
        "Low BP: " + lowTable.substring(lowBPIndex1, lowBPIndex2) + "\n"
      );
      console.log("LOWEST URL: " + lowP.url());
      console.log("Highest: " + highest);
      console.log(
        "High year: " + highTable.substring(highYearIndex1, highYearIndex2)
      );
      console.log(
        "High BP: " + highTable.substring(highBPIndex1, highBPIndex2) + "\n"
      );
      console.log("HIGHEST URL: " + highP.url());
    }
  }
}

module.exports = { bazaar };
