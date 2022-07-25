const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer } = require("puppeteer");
async function davidsw(lowP, highP, tPage) {
  for (var i = 77; i < refNums.length; i++) {
    console.log("");
    lowTables = "";
    highTables = "";
    lowBox = "";
    lowPaper = "No";
    highBox = "";
    highPaper = "No";
    lowYear = "";
    highYear = "";
    brandLow = "";
    brandHigh = "";
    imageLow = "";
    imageHigh = "";
    lowSku = "";
    highSku = "";
    lowest = "";
    highest = "";

    var newURL = utilFunc.getLink("DavidSW", refNums[i]);

    console.log("URL: " + newURL);
    console.log(
      i + 3 * refNums.length + "/" + refNums.length * 6,
      ((i + 3 * refNums.length) / (refNums.length * 6)) * 100 + "%"
    );
    await tPage
      .goto(newURL, { waitUntil: "networkidle0" })
      .catch(async (e) => {await utilFunc.reTry(tPage)});
    if (
      await utilFunc.exists(tPage, "#main > div > div.col.large-9 > div > p")
    ) {
      // no results
      continue;
    } else {
      await lowP
        .goto(getUrl(newURL, "orderby=price&paged=1&"), {
          waitUntil: "networkidle0",
        }).catch(async (e) => {await utilFunc.reTry(lowP)})
      await highP
        .goto(getUrl(newURL, "orderby=price-desc&"), {
          waitUntil: "networkidle0",
        }).catch(async (e) => {await utilFunc.reTry(highP)})
      if (
        await utilFunc.exists(
          tPage,
          "#wrapper > div > div.page-title-inner.flex-row.container.medium-flex-wrap.flex-has-center > div.flex-col.flex-center.text-center > h1"
        )
      ) {
        await assignDataResults(lowP, highP);
        imageLow = String(
          await lowP
            .$eval(
              "img[class='wp-post-image skip-lazy lazy-load-active']",
              (el) => el.src
            )
            .catch((err) => {
              return "";
            })
        );
        imageHigh = String(
          await highP
            .$eval(
              "img[class='wp-post-image skip-lazy lazy-load-active']",
              (el) => el.src
            )
            .catch((err) => {
              return "";
            })
        );
      } else {
        await assignDataOneResult(lowP);

        imageHigh = String(
          await highP
            .$eval(
              "img[class='wp-post-image skip-lazy lazy-load-active']",
              (el) => el.src
            )
            .catch((err) => {
              return "";
            })
        );
        imageLow = imageHigh;
      }
    }

    //console.log("LOW TABLES: " + lowTables + "\n");
    lowTableBoxAndPaper = lowTables[6];
    lowTableGeneral = lowTables[0];

    highTableBoxAndPaper = highTables[6];
    highTableGeneral = highTables[0];

    lowBoxIndex1 = lowTableBoxAndPaper.indexOf("Box") + 3;
    lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Hangtag");
    if (lowBoxIndex2 === -1) {
      lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Warranty Papers");
      otherLowBoxIndex2 = lowTableBoxAndPaper.indexOf("Booklet");
      if (otherLowBoxIndex2 < lowBoxIndex2) {
        lowBoxIndex2 = otherLowBoxIndex2;
      }
    }
    console.log(lowTableBoxAndPaper.replace("\n", "'/n'").replace(" ", "' '"));
    highBoxIndex1 = highTableBoxAndPaper.indexOf("Box") + 3;
    highBoxIndex2 = highTableBoxAndPaper.indexOf("Hangtag");
    if (highBoxIndex2 === -1) {
      highBoxIndex2 = highTableBoxAndPaper.indexOf("Warranty Papers");
      otherhighBoxIndex2 = highTableBoxAndPaper.indexOf("Booklet");
      if (otherhighBoxIndex2 < highBoxIndex2) {
        highBoxIndex2 = otherhighBoxIndex2;
      }
    }

    lowBox = lowTableBoxAndPaper.substring(lowBoxIndex1, lowBoxIndex2);
    highBox = highTableBoxAndPaper.substring(highBoxIndex1, highBoxIndex2);

    lowPaperIndex1 = lowTableBoxAndPaper.indexOf("Warranty Papers / Card") + 22;

    highPaperIndex1 =
      highTableBoxAndPaper.indexOf("Warranty Papers / Card") + 22;

    lowPaper = lowTableBoxAndPaper.substring(lowPaperIndex1);
    highPaper = highTableBoxAndPaper.substring(highPaperIndex1);

    indexLow = lowTableGeneral.indexOf("Year");
    if (indexLow != -1) {
      lowYear = lowTableGeneral.substring(indexLow + 4);
    }
    indexHigh = highTableGeneral.indexOf("Year");
    if (indexHigh != -1) {
      highYear = highTableGeneral.substring(indexHigh + 4);
    }

    w = new Watch(
      refNums[i],
      lowYear.trim(),
      highYear.trim(),
      lowBox.replace(/\s+/g, ""),
      lowPaper.replace(/\s+/g, ""),
      highBox.replace(/\s+/g, ""),
      highPaper.replace(/\s+/g, ""),
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

    fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
    console.log(JSON.stringify(w, null, "\t"));
  }
}

module.exports = { davidsw };

/**
 * @param {Puppeteer.Page} lowP that you want to get data from
 * @returns {void} assigns data from lowP to both lowest and highest price watches
 */
async function assignDataOneResult(lowP) {
  lowTables = "";
  lowTables = await lowP.$$eval("tbody", (options) =>
    options.map((option) => option.textContent)
  );
  lowSku = await utilFunc.getItem(lowP, "span[class='sku']");
  highSku = lowSku;

  // only one watch therefore highData = lowData
  // already on the specific watch page. no need to click anything
  lowest = await utilFunc.getItem(
    lowP,
    'span[class="woocommerce-Price-amount amount"]'
  );
  brandLow = await await utilFunc.getItem(
    lowP,
    "h1[class='product-title product_title entry-title']"
  );
  brandLow = brandLow.substring(0, brandLow.indexOf(" ")).trim();
  brandHigh = brandLow;

  highest = lowest;
  highTables = lowTables;
}

/**
 * @param {Puppeteer.Page} lowP that you want to get data from
 * @param {Puppeteer.Page} highP that you want to get data from
 * @returns {void} assigns data to both lowest and highest price watches
 */
async function assignDataResults(lowP, highP) {
  // checking to see if it shows multiple watches or went straight to one watch
  await lowP.waitForSelector('span[class="price"]');

  lowest = await utilFunc.getItem(lowP, 'span[class="price"]');

  await highP.waitForSelector('span[class="price"]');
  highest = await utilFunc.getItem(highP, 'span[class="price"]');

  brandLow = await (
    await utilFunc.getItem(
      lowP,
      "p[class='category uppercase is-smaller no-text-overflow product-cat op-7']"
    )
  ).trim();
  brandHigh = await (
    await utilFunc.getItem(
      highP,
      "p[class='category uppercase is-smaller no-text-overflow product-cat op-7']"
    )
  ).trim();

  await lowP.waitForSelector('div[class="title-wrapper"]');
  await highP.waitForSelector('div[class="title-wrapper"]');

  await lowP.click('div[class="title-wrapper"]', { delay: 20 });
  await highP.click('div[class="title-wrapper"]', { delay: 20 });

  await lowP.waitForSelector("tbody");
  await highP.waitForSelector("tbody");

  lowTables = await lowP.$$eval("tbody", (options) =>
    options.map((option) => option.textContent)
  );
  highTables = await highP.$$eval("tbody", (options) =>
    options.map((option) => option.textContent)
  );

  lowSku = await utilFunc.getItem(lowP, "span[class='sku']");
  highSku = await utilFunc.getItem(highP, "span[class='sku']");
}

/**
 * @param {String} url that you want to modify
 * @param {String} filter that you want to apply to the url
 */
getUrl = (url, filter) =>
  url.substring(0, url.indexOf("&") + 1) +
  filter +
  url.substring(url.indexOf("&s") + 1);
