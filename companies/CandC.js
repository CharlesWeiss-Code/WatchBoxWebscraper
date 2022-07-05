const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
var fs = require('fs');
var json2csv = require('json2csv')


//var fields = ['refNum','lowBox','lowPaper','highBox','highPaper','lowPrice','highPrice','highLink','LowLink','lowAge','highAge','lowDealerStatus','highDealerStatus','lowBP','highBP','generalLink','dateOfScrape','imageLow','imageHigh','brandLow','brandHigh','website']



lowYear = "";
lowPaper = "";
lowBox = "";
highYear = "";
highPaper = "";
highBox = "";
lowTable = "";
highTable = "";
lowYearIndex1 = -1;
lowYearIndex2 = -1;
lowImage = "";
highImage = "";
brandLow = "";
brandHigh = "";

async function crownAndCaliber(lowP, highP, tPage, list) {
  for (var i = 0; i < refNums.length; i++) {
    url = "https://www.crownandcaliber.com/search?view=shop&q=" + refNums[i];
    console.log("CandC URL: ***  " + url);

    if (refNums[i] == "116500LN-0001") {
      // special white daytona. https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:asc
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White",
        { waituntil: "networkidle0" }
      );

      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        continue;
      } else {
        await prepare(
          lowP,
          highP,
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White"
        );

        await highP.waitForTimeout(500);
        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        lowImage = await lowP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        highImage = await highP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
      }
    } else if (refNums[i] == "116500LN-0002") {
      //SPECIAL BLACK DAYTONA
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black",
        { waituntil: "networkidle0" }
      );
      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        continue;
      } else {
        await prepare(
          lowP,
          highP,
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black"
        );

        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');
        
        brandLow = await (
          await utilFunc.getItem(lowP, "tbody > tr:nth-child(1)")
        )
          .replace("Brand:", "")
          .trim();
        brandLow = await (
          await utilFunc.getItem(lowP, "tbody > tr:nth-child(1)")
        )
          .replace("Brand:", "")
          .trim();

        lowImage = await lowP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        highImage = await highP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
      }
    } else {
      await tPage.goto(url, { waitUntil: "networkidle0" });

      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        // no results
        continue;
      } else {
        await prepare(lowP, highP, url);
        await lowP.waitForSelector('div[class="prod-specs"]');
        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        await highP.waitForSelector('div[class="prod-specs"]');
        highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');
      }
    }
    var lowYearIndex1 = lowTable.indexOf("Approximate Age - ") + 18;
    var lowYearIndex2 = lowTable.indexOf("Case Material - ");
    if (lowTable.indexOf("Paper Date - ") != -1) {
      lowYearIndex1 = lowTable.indexOf("Paper Date - ") + 13;
      lowYearIndex2 = lowTable.indexOf("Case Size");
    }

    var lowBoxIndex1 = lowTable.indexOf("Box - ") + 6;
    var lowBoxIndex2 = lowTable.indexOf("Papers - ");
    var lowPaperIndex1 = lowBoxIndex2 + 9;
    var lowPaperIndex2 = lowTable.indexOf("Manual -");

    var highYearIndex1 = highTable.indexOf("Approximate Age - ") + 18;
    var highYearIndex2 = highTable.indexOf("Case Material - ");

    if (highTable.indexOf("Paper Date -") != -1) {
      highYearIndex1 = highTable.indexOf("Paper Date - ") + 13;
      highYearIndex2 = highTable.indexOf("Case Size");
    }

    var highBoxIndex1 = highTable.indexOf("Box - ") + 6;
    var highBoxIndex2 = highTable.indexOf("Papers - ");
    var highPaperIndex1 = highBoxIndex2 + 8;
    var highPaperIndex2 = highTable.indexOf("Manual -");

    var lowYear = lowTable
      .substring(lowYearIndex1, lowYearIndex2)
      .replace(/\s+/g, "")
    if (lowYear.length > 5) {
      lowYear = lowYear.slice(-4)
    }

    const lowPaper = lowTable
      .substring(lowBoxIndex1, lowBoxIndex2)
      .replace(/\s+/g, "");
    const lowBox = lowTable
      .substring(lowPaperIndex1, lowPaperIndex2)
      .replace(/\s+/g, "");
    var highYear = highTable
      .substring(highYearIndex1, highYearIndex2)
      .replace(/\s+/g, "")
      if (highYear.length > 5) {
        highYear = highYear.slice(-4)
      }
  
    const highPaper = highTable
      .substring(highBoxIndex1, highBoxIndex2)
      .replace(/\s+/g, "");
    const highBox = highTable
      .substring(highPaperIndex1, highPaperIndex2)
      .replace(/\s+/g, "");

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
      brandHigh
    );
    list.push(w)
    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");

    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.TSV(w)
    //await csvWriter.writeRecords(w)
    //utilFunc.addToJson(w);
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
  
  brandLow = await utilFunc.getItem(lowP, "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding")
  brandHigh = await utilFunc.getItem(highP, "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > div.card-title.ng-binding")
  await lowP.click(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
    { delay: 20 }
  );

  await lowP.waitForTimeout(500);

  await highP.click(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
    { delay: 20 }
  );
};

module.exports = { crownAndCaliber };
