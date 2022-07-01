const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require('fs')
lowest = "";
highest = "";
highTable = "";
lowTable = "";
lowYear = "";
highYear = "";
PHigh = "";
PLow = "";
lowBox = ""
highBox = ""
lowURL = "";
highURL = "";
imageLow = "";
imageHigh = "";
var brandLow = "";
var brandHigh = "";

async function bobs(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
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
    imageLow = "";
    imageHigh = "";
    brandLow = "";
    brandHigh = "";
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
        continue;
      } else {
        await prepare(lowP, highP, specialURL); // sorts page
        await getData(lowP, highP); // gets data tables and price
        // take screenshot

        imageLow = await lowP.evaluate(() => {
          const image = document.querySelector("#mainImage");
          return image.src;
        });

        imageHigh = await lowP.evaluate(() => {
          const image = document.querySelector("#mainImage");
          return image.src;
        });
      }
    } else {
      if (
        await utilFunc
          .noResults(
            tPage,
            "#searchspring-content > div > div > div > div > div > div.no-results"
          )
          .catch((e) => {
            console.log(e);
          })
      ) {
        continue;
      } else {
        await prepare(lowP, highP, newURL); // sorts page
        await getData(lowP, highP); // gets data tables and price
      }
    }

    if (lowBox.indexOf(brandLow) != -1) {
      lowBox = "Yes"
    }
    if (highBox.indexOf(brandHigh) != -1) {
      highBox = "Yes"
    }
    w = new Watch(
      refNums[i],
      lowYear.trim(),
      highYear.trim(),
      lowBox,
      PLow,
      highBox,
      PHigh,
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
      brandHigh
    );
    //console.log(w);
    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");
   //console.log(lowTable)
    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
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
  PLow = "No";
  if (lowTable.indexOf("warranty card") != -1) {
    PLow = "Yes"
  }
  lowBox = lowTable.substring(lowTable.indexOf("Box & Papers")+14,lowTable.indexOf("Warranty"))
  lowBox = lowBox.substring(0,lowBox.indexOf(","))
  

  highBox = highTable.substring(highTable.indexOf("Box & Papers")+14,highTable.indexOf("Warranty"))
  highBox = highBox.substring(0,highBox.indexOf(","))
  

  index1YearHigh = -1;
  if (highTable.indexOf("Serial/Year:") != -1) {
    index1YearHigh = highTable.indexOf("Serial/Year") + 12;
  } else {
    index1YearHigh = highTable.indexOf("Serial") + 6;
  }
  index2YearHigh = highTable.indexOf("Gender:");
  PHigh ="No";
  if (highTable.indexOf("warranty card") != -1) {
    PHigh = "Yes"
  }

  lowYear = "";
  if (lowTable.indexOf("/Year") !== -1) {
    lowYear = lowTable.substring(index1YearLow, index2YearLow);
    index = lowYear.indexOf("- ") + 2;
    lowYear = lowYear.substring(index)
    lowYear = lowYear.replace(" or newer","+");
  }

  brandLow = "";
  brandHigh = "";
  brandLow = await (await utilFunc.getItem(lowP, "tbody > tr:nth-child(1)"))
    .replace("Brand:", "")
    .trim();
  brandHigh = await (await utilFunc.getItem(highP, "tbody > tr:nth-child(1)"))
    .replace("Brand:", "")
    .trim();
  
  highYear = "";
  if (highTable.indexOf("/Year") !== -1) {
    highYear = highTable.substring(index1YearHigh, index2YearHigh);
    index = highYear.indexOf("- ") + 2;
    highYear = highYear.substring(index)
    highYear = highYear.replace(" or newer","+");
  }

  if (String(lowP.url()) != "about:blank") {
    lowURL = lowP.url();
  }
  if (String(highP.url()) != "about:blank") {
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
