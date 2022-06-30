const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");

async function davidsw(lowP, highP, tPage, scrape) {
  for (var i = 3; i < refNums.length; i++) {
    console.log("");
    lowTables = "";
    highTables = "";
    lowBox = "";
    lowPaper = "";
    highBox = "";
    highPaper = "";
    lowYear = "";
    highYear = "";
    brandLow = ""
    brandHigh = ""

    var newURL =
      "https://davidsw.com/?s=" +
      refNums[i] +
      "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    lowest = -1;
    highest = -1;
    if (refNums[i] == "116500LN-0001") {
      // special white daytona
      await tPage.goto(
        "https://davidsw.com/?filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
        { waitUntil: "networkidle0", timeout: 60000 }
      );
      if (
        await utilFunc.noResults(
          tPage,
          "#main > div > div.col.large-9 > div > p"
        )
      ) {
        // no results
        continue;
      } else {
        await tPage.waitForTimeout(1000);
        await lowP
          .goto(
            "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
            { waitUntil: "networkidle0" }
          )
          .catch(async (error) => {
            await lowP.waitForTimeout(1000);
            await lowP.reload();
            await lowP.waitForTimeout(1000);
          });
        await highP
          .goto(
            "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
            { waitUntil: "networkidle0" }
          )
          .catch(async (error) => {
            await highP.waitForTimeout(1000);
            await highP.reload();
            await highP.waitForTimeout(1000);
          });

        //checkign to see if lowP is the list of watches or if it went straight to one watch.
        if (
          await utilFunc.exists(
            tPage,
            "#wrapper > div > div.page-title-inner.flex-row.container.medium-flex-wrap.flex-has-center > div.flex-col.flex-center.text-center > h1"
          )
        ) {
          await assignDataResults(lowP, highP);
        } else {
          console.log("here");
          await assignDataOneResult(lowP);
        }
      }
    } else if (refNums[i] == "116500LN-0002") {
      // special black daytona
      await tPage.goto(
        "https://davidsw.com/?filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
        { waitUntil: "networkidle0", timeout: 60000 }
      );

      if (
        await utilFunc.noResults(
          tPage,
          "#main > div > div.col.large-9 > div > p"
        )
      ) {
        // no results
        continue;
      } else {
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

        if (await utilFunc.exists(tPage, 'div[class="shop-container"]')) {
          await assignDataResults(lowP, highP);
        } else {
          await assignDataOneResult(lowP);
        }
      }
    } else {
      await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
      if (
        await utilFunc.exists(tPage, "#main > div > div.col.large-9 > div > p")
      ) {
        // no results
        continue;
      } else {
        await lowP
          .goto(
            "https://davidsw.com/?orderby=price&paged=1&s=" +
              refNums[i] +
              "&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
            { waitUntil: "networkidle0" }
          )
          .catch(async () => {
            await lowP.waitForTimeout(1000);
            await lowP.reload();
            await lowP.waitForTimeout(1000);
          });
        await highP
          .goto(
            "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
              refNums[i] +
              "&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
            { waitUntil: "networkidle0" }
          )
          .catch(async () => {
            await highP.waitForTimeout(1000);
            await highP.reload();
            await highP.waitForTimeout(1000);
          });
        if (
          await utilFunc.exists(
            tPage,
            "#wrapper > div > div.page-title-inner.flex-row.container.medium-flex-wrap.flex-has-center > div.flex-col.flex-center.text-center > h1"
          )
        ) {
          await assignDataResults(lowP, highP);
        } else {
          await assignDataOneResult(lowP);
        }
      }
    }
    //console.log("LOW TABLES: " + lowTables + "\n");
    lowTableBoxAndPaper = lowTables[6];
    lowTableGeneral = lowTables[0];

    highTableBoxAndPaper = highTables[6];
    highTableGeneral = highTables[0];

    lowBoxIndex1 = lowTableBoxAndPaper.indexOf("Box") + 3;
    lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Hangtag");

    highBoxIndex1 = highTableBoxAndPaper.indexOf("Box") + 3;
    highBoxIndex2 = highTableBoxAndPaper.indexOf("Hangtag");

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
      "",
      highBox.replace(/\s+/g, ""),
      highPaper.replace(/\s+/g, ""),
      "",
      lowest,
      highest,
      "",
      "",
      lowP.url(),
      highP.url(),
      tPage.url()
    );
    //console.log(w);
    //utilFunc.addToJson(w);
    //#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-407249.status-publish.first.instock.product_cat-rolex.product_cat-cosmograph-daytona.has-post-thumbnail.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.title-wrapper > p.category.uppercase.is-smaller.no-text-overflow.product-cat.op-7
  }
}

module.exports = { davidsw };

async function assignDataOneResult(lowP) {
  lowTables = "";
  await lowP.waitForSelector("tbody").catch(async (e) => {
    await lowP.reload().then(async () => {
      await lowP.waitForSelector("tbody");
    });
  });
  lowTables = await lowP.$$eval("tbody", (options) =>
    options.map((option) => option.textContent)
  );

  // only one watch therefore highData = lowData
  // already on the specific watch page. no need to click anything
  lowest = await utilFunc.getItem(
    lowP,
    'span[class="woocommerce-Price-amount amount"]'
  );
  brandLow = await (await utilFunc.getItem(lowP,"h1[class='product-title product_title entry-title']"))
  brandLow = brandLow.substring(0,brandLow.indexOf(" ")).trim()
  brandHigh = brandLow
  console.log(brandLow,brandHigh)    

  highest = lowest;
  highTables = lowTables;
}

async function assignDataResults(lowP, highP) {
  // checking to see if it shows multiple watches or went straight to one watch
  await lowP.waitForSelector('span[class="price"]');

  lowest = await utilFunc.getItem(lowP, 'span[class="price"]');

  await highP.waitForSelector('span[class="price"]');
  highest = await utilFunc.getItem(highP, 'span[class="price"]');

  brandLow = await (await utilFunc.getItem(lowP,"p[class='category uppercase is-smaller no-text-overflow product-cat op-7']")).trim()
  brandHigh = await (await utilFunc.getItem(highP, "p[class='category uppercase is-smaller no-text-overflow product-cat op-7']")).trim()
  console.log(brandLow,brandHigh)         

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
}
