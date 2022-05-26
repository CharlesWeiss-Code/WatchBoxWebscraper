const utilFunc = require("../utilityFunctions.js");
import { Watch } from "../DataStructures/Watch.js";
lowest = "";
highest = "";
highTable = "";
lowTable = "";
lowYear = "";
highYear = "";
PHigh = "";
PLow = "";
lowURL = "";
highURL = "";

async function bobs(lowP, highP, tPage) {
  result = [];
  for (var i = 2; i < refNums.length; i++) {
    lowest = "";
    highest = "";
    highTable = "";
    lowTable = "";
    lowYear = "";
    highYear = "";
    PHigh = "";
    PLow = "";
    lowURL = "";
    highURL = "";
    console.log("");

    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage
      .goto(newURL, { waitUntil: "networkidle0", timeout: 0 })
      .catch(async () => {
        await tPage.goto(newURL, { waitUntil: "networkidle0" });
      });
    if (refNums[i] === "116500LN-0001" || refNums[i] === "116500LN-0002") {
      specialURL =
        "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=116500LN";

      await tPage.goto(specialURL, { waitUntil: "networkidle0" });
      if (
        await utilFunc.noResults(
          tPage,
          "#searchspring-content > div > div > div > div > div > div.no-results"
        )
      ) {
        lowest = "";
        highest = "";
      } else {
        await prepare(lowP, highP, specialURL); // sorts page
        await getData(lowP, highP); // gets data tables and price
        // take screenshot

        let lowURL = await lowP.evaluate(() => {
          const image = document.querySelector("#mainImage");
          return image.src;
        });

        highURL = await lowP.evaluate(() => {
          const image = document.querySelector("#mainImage");
          return image.src;
        });
        await utilFunc.downloadImage(lowURL, refNums[i] + "-Bobs-LOW");
        await utilFunc.downloadImage(highURL, refNums[i] + "-Bobs-HIGH");
      }
    } else {
      if (
        await utilFunc.noResults(
          tPage,
          "#searchspring-content > div > div > div > div > div > div.no-results"
        )
      ) {
        lowest = "";
        highest = "";
      } else {
        await prepare(lowP, highP, newURL); // sorts page
        await getData(lowP, highP); // gets data tables and price
      }
    }
    result.push(
      new Watch(
        refNums[i],
        lowYear,
        highYear,
        "",
        PLow,
        "",
        PHigh,
        lowest,
        hgihest,
        lowP.url(),
        highP.url()
      )
    );
    console.log("Lowest: " + "\t" + String(lowest).replace(/\s+/g, ""));
    console.log("LowYear: " + "\t" + lowYear);
    console.log("Papers Low: " + "\t" + PLow);
    console.log("LOWEST URL: " + lowURL + "\n");

    console.log("Highest: " + "\t" + String(highest).replace(/\s+/g, ""));
    console.log("HighYear: " + "\t" + highYear);
    console.log("Papers High: " + "\t" + PHigh);
    console.log("HIGHEST URL: " + highURL + "\n\n\n");
  }
  return result;
}

async function select(page, sel, Text) {
  let $elemHandler = await page.$(sel);
  let properties = await $elemHandler.getProperties();
  for (const property of properties.values()) {
    const element = property.asElement();
    if (element) {
      let hText = await element.getProperty("text");
      let text = await hText.jsonValue();
      if (text === Text) {
        let hValue = await element.getProperty("value");
        let value = await hValue.jsonValue();
        await page.select(sel, value); // or use 58730
      }
    }
  }
}

async function getData(lowP, highP) {
  await lowP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "3"
  );

  await highP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "2"
  );
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

  lowTable = await lowP.$$eval("tbody", (options) => options[1].textContent);

  highTable = await highP.$$eval("tbody", (options) => options[1].textContent);

  index1YearLow = -1;
  if (lowTable.indexOf("Serial/Year:") != -1) {
    index1YearLow = lowTable.indexOf("Serial/Year") + 12;
  } else {
    index1YearLow = lowTable.indexOf("Serial") + 6;
  }
  index2YearLow = lowTable.indexOf("Gender:");
  PLow = "";
  if (lowTable.indexOf("warranty card") != -1) {
    index1BPLow = lowTable.indexOf("warranty card");
    index2BPLow = lowTable.indexOf("Warranty");
    PLow = lowTable.substring(index1BPLow, index2BPLow);
  }

  index1YearHigh = -1;
  if (highTable.indexOf("Serial/Year:") != -1) {
    index1YearHigh = highTable.indexOf("Serial/Year") + 12;
  } else {
    index1YearHigh = highTable.indexOf("Serial") + 6;
  }
  index2YearHigh = highTable.indexOf("Gender:");
  PHigh = "";
  if (highTable.indexOf("warranty card") != -1) {
    index1BPHigh = highTable.indexOf("warranty card");
    index2BPHigh = highTable.indexOf("Warranty");
    PHigh = highTable.substring(index1BPHigh, index2BPHigh);
  }

  lowYear = "";
  if (lowTable.indexOf("/Year") !== -1) {
    lowYear = lowTable.substring(index1YearLow, index2YearLow);
    index = lowYear.indexOf("- ") + 2;
    lowYear = lowYear.substring(index);
  }

  highYear = "";
  if (highTable.indexOf("/Year") !== -1) {
    highYear = highTable.substring(index1YearHigh, index2YearHigh);
    index = highYear.indexOf("- ") + 2;
    highYear = highYear.substring(index);
  }

  if (String(lowP.url()) != "about:blank") {
    lowURL = lowP.url();
  }
  if (!String(highP.url()) != "about:blank") {
    highURL = highP.url();
  }
}

async function prepare(lowP, highP, url) {
  await lowP.goto(url + "#/sort:price:asc", {
    waitUntil: "networkidle0",
  });

  await lowP.waitForTimeout(1000);
  await select(
    lowP,
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "Price - Low to High"
  );

  await highP.goto(url + "#/sort:price:desc", {
    waitUntil: "networkidle0",
  });

  await select(
    highP,
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "Price - High to Low"
  );
}

module.exports = { bobs };
