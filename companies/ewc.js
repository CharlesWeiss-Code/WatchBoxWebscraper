const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer } = require("puppeteer");


async function EWC(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    brandLow = "";
    brandHigh = "";
    lowSku = "";
    highSku = "";

    var newURL = utilFunc.getLink("EWC", refNums[i]);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });

    console.log("URL: " + newURL);
    console.log(
      i + 2*refNums.length + "/" + refNums.length * 6,
      ((i + 2*refNums.length) / (refNums.length * 6)) * 100 + "%"
    );
    await tPage.waitForTimeout(1000);

    if (await utilFunc.noResults(tPage, "body > section > h3")) {
      continue;
    } else {
      //EWC Is weird and needs its own function.
      lowest = await findPriceEWC(lowP, newURL, "asc");
      highest = await findPriceEWC(highP, newURL, "desc");

      brandLow = await utilFunc.getItem(
        lowP,
        "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
      );
      brandHigh = await utilFunc.getItem(
        highP,
        "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
      );

      lowSku = await utilFunc.getItem(
        lowP,
        "body > section > section.flex.flex-wrap.watch-list.mx-auto > section > div > div.flex.flex-col.h-full.justify-start.mt-2 > p"
      );
      highSku = await utilFunc.getItem(
        highP,
        "body > section > section.flex.flex-wrap.watch-list.mx-auto > section > div > div.flex.flex-col.h-full.justify-start.mt-2 > p"
      );

      lowSku = lowSku.substring(lowSku.indexOf("(") + 1, lowSku.indexOf(")"));
      highSku = highSku.substring(
        highSku.indexOf("(") + 1,
        highSku.indexOf(")")
      );
      brandLow = brandLow.substring(0, brandLow.indexOf(" "));
      brandHigh = brandHigh.substring(0, brandHigh.indexOf(" "));
      console.log(brandLow, brandHigh);
    }

    w = new Watch(
      refNums[i],
      "",
      "",
      "",
      "",
      "",
      "",
      String(lowest),
      String(highest),
      "",
      "",
      "",
      "",
      tPage.url(),
      "",
      "",
      brandLow,
      brandHigh,
      lowSku,
      highSku
    );
    //console.log(w);

    fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
}

/**
 * @param {Puppeteer.Page} page that you want to find the lowest and highest prices of
 * @param {String} url that you want the page to go to
 * @param {String} type of price you want to return. Either "asc" or String
 * @returns {int} price
 */
async function findPriceEWC(page, url, type) {
  await page.goto(url, { waituntil: "networkidle0", timeout: 60000 });
  prices = await page.$$eval(
    "body > section > section.flex.flex-wrap.watch-list.mx-auto > section > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p",
    (price) =>
      price.map((value) =>
        parseInt(String(value.textContent).replace("$", "").replace(",", ""))
      )
  );
  lowest = Math.min.apply(null, prices);
  highest = Math.max.apply(null, prices);
  if (type === "asc") {
    return lowest;
  } else {
    return highest;
  }
}

module.exports = { EWC };
