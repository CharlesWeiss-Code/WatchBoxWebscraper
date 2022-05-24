const utilFunc = require("../utilityFunctions.js");

async function crownAndCaliber(lowP, highP, tPage) {
  specification = [];
  for (var i = 2; i < refNums.length; i++) {
    lowTable = null;
    highTable = null;
    url =
      "https://www.crownandcaliber.com/search?view=shop&q=" +
      refNums[i] +
      "&oq=" +
      refNums[i] +
      "&queryAssumption=correction";
    console.log("CandC URL: ***  " + url);

    if (refNums[i] == "116500LN-0001") {
      // special white daytona. https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:asc
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White",
        { waituntil: "networkidle0" }
      );

      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        await lowP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:asc",
          { waitUntil: "networkidle0" }
        );
        await highP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:desc",
          { waitUntil: "networkidle0" }
        );
        lowest = await findLowestPrice2CandC(lowP);
        highest = await findHighestPrice2CandC(highP);

        await lowP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );

        await lowP.waitForTimeout(500);

        await highP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );

        await highP.waitForTimeout(500);
        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
      }
    } else if (refNums[i] == "116500LN-0002") {
      //SPECIAL BLACK DAYTONA
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black",
        { waituntil: "networkidle0" }
      );
      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        await lowP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black/sort:ss_price:asc",
          { waitUntil: "networkidle0" }
        );
        await lowP.waitForTimeout(500);

        lowest = await findLowestPrice2CandC(lowP);

        await lowP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );

        await highP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black/sort:ss_price:desc",
          { waitUntil: "networkidle0" }
        );
        await highP.waitForTimeout(500);

        highest = await findHighestPrice2CandC(highP);

        await highP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );

        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
      }
    } else {
      await tPage.goto(url, { waitUntil: "networkidle0" });

      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        console.log("\n");
        console.log(url);
        lowest = await findLowestPriceCandC(lowP, url);
        highest = await findHighestPriceCandC(highP, url);

        await lowP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );
        await lowP.waitForTimeout(500);

        await highP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );
        await highP.waitForTimeout(500);

        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
      }
    }
    lowYearIndex1 = -1;
    lowYearIndex2 = -1;
    if (lowTable.indexOf("Paper Date - ") != -1) {
      lowYearIndex1 = lowTable.indexOf("Paper Date - ") + 13;
      lowYearIndex2 = lowTable.indexOf("Case Size");
    } else {
      lowYearIndex1 = lowTable.indexOf("Approximate Age -") + 17;
      lowYearIndex2 = lowTable.indexOf("Case Material");
    }

    lowBoxIndex1 = lowTable.indexOf("Box - ") + 6;
    lowBoxIndex2 = lowTable.indexOf("Papers - ");
    lowPaperIndex1 = lowBoxIndex2 + 9;
    lowPaperIndex2 = lowTable.indexOf("Manual -");
    //console.log(lowTable);
    highYearIndex1 = -1;
    highYearIndex2 = -1;
    if (highTable.indexOf("Paper Date -") != -1) {
      highYearIndex1 = highTable.indexOf("Paper Date - ") + 13;
      highYearIndex2 = highTable.indexOf("Case Size");
    } else {
      highYearIndex1 = highTable.indexOf("Approximate Age -") + 17;
      highYearIndex2 = highTable.indexOf("Case Material");
    }

    highBoxIndex1 = highTable.indexOf("Box - ") + 6;
    highBoxIndex2 = highTable.indexOf("Papers - ");
    highPaperIndex1 = highBoxIndex2 + 8;
    highPaperIndex2 = highTable.indexOf("Manual -");

    console.log("Lowest:" + "\t" + lowest);
    console.log(
      "LowestYear:" +
        "\t" +
        lowTable.substring(lowYearIndex1, lowYearIndex2).replace(/\s+/g, "")
    );
    console.log(
      "LowestPaper" +
        "\t" +
        lowTable.substring(lowBoxIndex1, lowBoxIndex2).replace(/\s+/g, "")
    );
    console.log(
      "LowestBox" +
        "\t" +
        lowTable.substring(lowPaperIndex1, lowPaperIndex2).replace(/\s+/g, "")
    );
    console.log("LOWEST URL: " + lowP.url() + "\n");

    console.log("Highest:" + "\t" + highest);

    console.log(
      "highestYear:" +
        "\t" +
        highTable.substring(highYearIndex1, highYearIndex2).replace(/\s+/g, "")
    );
    console.log(
      "highestPaper" +
        "\t" +
        highTable.substring(highBoxIndex1, highBoxIndex2).replace(/\s+/g, "")
    );
    console.log(
      "highestBox" +
        "\t" +
        highTable
          .substring(highPaperIndex1, highPaperIndex2)
          .replace(/\s+/g, "")
    );
    console.log("HIGHEST URL: " + highP.url() + "\n\n");
  }
}

async function findLowestPriceCandC(page, link) {
  newUrl = link + "#/sort:ss_price:asc";
  await page.goto(newUrl, { waitUntil: "networkidle0" });

  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

async function findLowestPrice2CandC(page) {
  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

async function findHighestPrice2CandC(page) {
  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}
async function findHighestPriceCandC(page, link) {
  newUrl = link + "#/sort:ss_price:desc";
  console.log(newUrl);
  await page.goto(newUrl, { waitUntil: "networkidle0" });

  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

module.exports = { crownAndCaliber };
