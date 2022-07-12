const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer } = require("puppeteer");
lowest = "";
highest = "";
highTable = "";
lowTable = "";
lowYear = "";
highYear = "";
PHigh = "";
PLow = "";
lowBox = "";
highBox = "";
lowURL = "";
highURL = "";
imageLow = "";
imageHigh = "";
lowSku = "";
highSku = "";
var brandLow = "";
var brandHigh = "";

async function bobs(lowP, highP, tPage, list) {
  for (var i = 0; i < refNums.length; i++) {
    lowest = "";
    highest = "";
    highTable = "";
    lowTable = "";
    lowYear = "";
    highYear = "";
    PHigh = "No";
    PLow = "No";
    lowURL = "";
    highURL = "";
    imageLow = "";
    imageHigh = "";
    brandLow = "";
    lowSku = "";
    highSku = "";
    brandHigh = "";
    highBox = "No";
    lowBox = "No";
    console.log("");

    var newURL = utilFunc.getLink("Bobs", refNums[i])
      

    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);

    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 0 });

    await tPage.waitForTimeout(500);
    if (
      await utilFunc.noResults(
        tPage,
        "#searchspring-content > div > div > div > div > div > div.no-results"
      )
    ) {
      continue;
    } else {
      await prepare(lowP,highP,newURL)
      await getData(lowP, highP); // gets data tables and price
      imageLow = await lowP.evaluate(() => {
        const image = document.querySelector("#mainImage");
        return image.src;
      });

      imageHigh = await lowP.evaluate(() => {
        const image = document.querySelector("#mainImage");
        return image.src;
      });
    }

    if (lowBox.indexOf(brandLow) != -1) {
      lowBox = "Yes";
    } else {
      lowBox = "No";
    }
    if (highBox.indexOf(brandHigh) != -1) {
      highBox = "Yes";
    } else {
      highBox = "No";
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
      brandHigh,
      lowSku,
      highSku
    );
    list.push(w);

    //console.log(w);
    fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
    //console.log(lowTable)
    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
}

/**
 * 
 * @param {Puppeteer.Page} lowP that you want to assign data from
 * @param {Puppeteer.Page} highP that you want to assign data from
 * @returns {void}
 */
async function getData(lowP, highP) {
  await lowP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "3"
  );

  await highP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "2"
  );

  await lowP.waitForTimeout(500)

  lowest = await utilFunc.getItem(
    lowP,
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
  );

  await highP.waitForTimeout(500)


  highest = await utilFunc.getItem(
    highP,
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
  );

  lowSku = await lowP.$eval("meta[itemprop='sku']", (el) => el.content);

  highSku = await highP.$eval("meta[itemprop='sku']", (el) => el.content);



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
  console.log("'"+lowest+"'","'"+highest+"'")

  if (lowest === "") {
    console.log("llkjhasdfkljhasdf")
    lowest = await utilFunc.getItem(lowP, "span[class='price']")
  }
  if (highest === "") {
    highest = await utilFunc.getItem(highP, "span[class='price']")
  }

  index1YearLow = -1;
  if (lowTable.indexOf("Serial/Year:") != -1) {
    index1YearLow = lowTable.indexOf("Serial/Year") + 12;
  } else {
    index1YearLow = lowTable.indexOf("Serial") + 6;
  }
  index2YearLow = lowTable.indexOf("Gender:");
  PLow = "No";
  if (lowTable.indexOf("warranty card") != -1) {
    PLow = "Yes";
  }
  lowBox = lowTable
    .substring(
      lowTable.indexOf("Box & Papers") + 12,
      lowTable.indexOf("Warranty")
    )
    .trim();
  lowBox = lowBox.substring(0, lowBox.indexOf(","));

  highBox = highTable
    .substring(
      highTable.indexOf("Box & Papers") + 12,
      highTable.indexOf("Warranty")
    )
    .trim();
  highBox = highBox.substring(0, highBox.indexOf(","));

  index1YearHigh = -1;
  if (highTable.indexOf("Serial/Year:") != -1) {
    index1YearHigh = highTable.indexOf("Serial/Year") + 12;
  } else {
    index1YearHigh = highTable.indexOf("Serial") + 6;
  }
  index2YearHigh = highTable.indexOf("Gender:");
  PHigh = "No";
  if (highTable.indexOf("warranty card") != -1) {
    PHigh = "Yes";
  }

  lowYear = "";
  if (lowTable.indexOf("/Year") !== -1) {
    lowYear = lowTable.substring(index1YearLow, index2YearLow);
    index = lowYear.indexOf("- ") + 2;
    lowYear = lowYear.substring(index);
    lowYear = lowYear.replace(" or newer", "+");
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
    highYear = highYear.substring(index);
    highYear = highYear.replace(" or newer", "+");
  }

  if (String(lowP.url()) != "about:blank") {
    lowURL = lowP.url();
  }
  if (String(highP.url()) != "about:blank") {
    highURL = highP.url();
  }
}


/**
 * @param {Puppeteer.Page} lowP that you want to navagate to the right URL
 * @param {Puppeteer.Page} highP that you want to navagate to the right URL
 * @param {String} url that you want to modify
 */
async function prepare(lowP, highP, url) {
  if (url.indexOf("#") === -1) {
    await lowP.goto(url + "#/sort:price:asc", {
      waitUntil: "networkidle0",
    });
    await highP.goto(url + "#/sort:price:desc", {
      waitUntil: "networkidle0",
    });
  } else {
    await lowP.goto(url + "/sort:price:asc", {
      waitUntil: "networkidle0",
    });
    await highP.goto(url + "/sort:price:desc", {
      waitUntil: "networkidle0",
    });
  }
}
module.exports = { bobs };
