const utilFunc = require("../utilityFunctions.js");

async function bobs(lowP, highP, tPage) {
  for (var i = 8; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 0 });
    if (
      await utilFunc.noResults(
        tPage,
        "#searchspring-content > div > div > div > div > div > div.no-results"
      )
    ) {
      lowest = 0;
      highest = 0;
    } else {
      await lowP.goto(newURL + "#/sort:price:asc", {
        waitUntil: "networkidle0",
      });
      await highP.goto(newURL + "#/sort:price:desc", {
        waitUntil: "networkidle0",
      });

      await lowP.waitForSelector(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
      );
      await highP.waitForSelector(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
      );

      lowest = await utilFunc.getItem(
        lowP,
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
      );
      highest = await utilFunc.getItem(
        highP,
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
      );

      // if the selector is there then the <a> must me there

      await lowP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );

      await highP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );

      await lowP.waitForSelector("tbody");
      await highP.waitForSelector("tbody");

      lowTable = await lowP.$$eval(
        "tbody",
        (options) => options[1].textContent
      );

      highTable = await highP.$$eval(
        "tbody",
        (options) => options[1].textContent
      );

      index1YearLow = -1;
      if (lowTable.indexOf("Serial/Year:") != -1) {
        index1YearLow = lowTable.indexOf("Serial/Year:") + 12;
      } else {
        index1YearLow = lowTable.indexOf("Serial") + 6;
      }
      index2YearLow = lowTable.indexOf("Gender:");
      index1BPLow = lowTable.indexOf("Box & Papers") + 13;
      index2BPLow = lowTable.indexOf("Warranty");

      index1YearHigh = -1;
      if (highTable.indexOf("Serial/Year:") != -1) {
        index1YearHigh = highTable.indexOf("Serial/Year:") + 12;
      } else {
        index1YearHigh = highTable.indexOf("Serial") + 6;
      }
      index2YearHigh = highTable.indexOf("Gender:");
      index1BPHigh = highTable.indexOf("Box & Papers") + 13;

      index2BPHigh = highTable.indexOf("Warranty");
      [lowYear] = lowTable
        .substring(index1YearLow, index2YearLow)
        .match(/(\d+)/);

      [highYear] = highTable
        .substring(index1YearLow, index2YearLow)
        .match(/(\d+)/);

      console.log("Lowest: " + "\t" + lowest.replace(/\s+/g, ""));
      console.log("LowYear: " + "\t" + lowYear);
      console.log(
        "lowBoxAndPapers" + "\t" + lowTable.substring(index1BPLow, index2BPLow)
      );
      console.log("LOWEST URL: " + lowP.url());

      console.log("Highest: " + "\t" + highest.replace(/\s+/g, ""));
      console.log("HighYear: " + "\t" + highYear);
      console.log(
        "HighBoxAndPapers: " +
          "\t" +
          highTable.substring(index1BPHigh, index2BPHigh)
      );
      console.log("HIGHEST URL: " + highP.url());
    }
  }
}

module.exports = { bobs };
