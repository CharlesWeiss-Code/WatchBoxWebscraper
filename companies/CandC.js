const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
lowYear = "";
lowPaper = "";
lowBox = "";
highYear = "";
highPaper = "";
highBox = "";
lowTable = "";
highTable = "";

async function crownAndCaliber(lowP, highP, tPage, scrape) {
  for (var i = 3; i < refNums.length; i++) {
    lowYear = "";
    lowPaper = "";
    lowBox = "";
    highYear = "";
    highPaper = "";
    highBox = "";
    lowTable = "";
    highTable = "";
    url = "https://www.crownandcaliber.com/search?view=shop&q=" + refNums[i];
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
        await prepare(
          lowP,
          highP,
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White"
        );

        await highP.waitForTimeout(500);
        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');

        let lowURL = await lowP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        let highURL = await highP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        await utilFunc.downloadImage(lowURL, refNums[i] + "-CandC-LOW");
        await utilFunc.downloadImage(highURL, refNums[i] + "-CandC-HIGH");
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
        await prepare(
          lowP,
          highP,
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black"
        );

        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');
        let lowURL = await lowP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        let highURL = await highP.evaluate(() => {
          const image = document.querySelector(
            "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-5.medium-12.small-12 > div > div > div > div.slider.slick-initialized.slick-slider > div.slick-list.draggable > div > div.slick-slide.slick-current.slick-active > div > div > img:nth-child(1)"
          );
          return image.src;
        });
        await utilFunc.downloadImage(lowURL, refNums[i] + "-CandC-LOW");
        await utilFunc.downloadImage(highURL, refNums[i] + "-CandC-HIGH");
      }
    } else {
      await tPage.goto(url, { waitUntil: "networkidle0" });

      if (await utilFunc.noResults(tPage, "#searchspring-content > h3")) {
        lowest = "";
        highest = "";
      } else {
        await prepare(lowP, highP, url);
        await lowP.waitForSelector('div[class="prod-specs"]');
        lowTable = await utilFunc.getItem(lowP, 'div[class="prod-specs"]');
        await highP.waitForSelector('div[class="prod-specs"]');
        highTable = await utilFunc.getItem(highP, 'div[class="prod-specs"]');
      }
    }
    assignData();
    scrape.addWatch(
      new Watch(
        refNums[i],
        lowYear,
        highYear,
        lowBox,
        lowPaper,
        "",
        highBox,
        highPaper,
        "",
        lowest,
        highest,
        "",
        "",
        lowP.url(),
        highP.url(),
        tPage.url()
      ),
      "CandC"
    );
    console.log("Lowest:" + "\t" + String(lowest).replace(/\s+/g, ""));
    console.log("LowestYear:" + "\t" + lowYear);
    console.log("LowestPaper" + "\t" + lowPaper);
    console.log("LowestBox" + "\t" + lowBox);
    console.log("LOWEST URL: " + lowP.url() + "\n");

    console.log("Highest:" + "\t" + String(highest).replace(/\s+/g, ""));

    console.log("highestYear:" + "\t" + highYear);
    console.log("highestPaper" + "\t" + highPaper);
    console.log("highestBox" + "\t" + highBox);
    console.log("HIGHEST URL: " + highP.url() + "\n\n");
  }
}

assignData = () => {
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

  lowYear = lowTable
    .substring(lowYearIndex1, lowYearIndex2)
    .replace(/\s+/g, "");

  lowPaper = lowTable.substring(lowBoxIndex1, lowBoxIndex2).replace(/\s+/g, "");
  lowBox = lowTable
    .substring(lowPaperIndex1, lowPaperIndex2)
    .replace(/\s+/g, "");
  highYear = highTable
    .substring(highYearIndex1, highYearIndex2)
    .replace(/\s+/g, "");
  highPaper = highTable
    .substring(highBoxIndex1, highBoxIndex2)
    .replace(/\s+/g, "");
  highBox = highTable
    .substring(highPaperIndex1, highPaperIndex2)
    .replace(/\s+/g, "");
};

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
  console.log("lowurl: " + lowP.url());
  lowest = await utilFunc.getItem(
    lowP,
    'span[class="current-price product-price__price"]'
  );
  highest = await utilFunc.getItem(
    highP,
    'span[class="current-price product-price__price"]'
  );

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
