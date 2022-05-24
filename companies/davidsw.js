const utilFunc = require("../utilityFunctions.js");

async function davidsw(lowP, highP, tPage) {
  for (var i = 3; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    highest = "-1";
    lowTableBoxAndPaper = "";
    highTableBoxAndPaper = "";
    yearLow = "null";
    yearHigh = "null";
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
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.waitForTimeout(500);
        await lowP.waitForTimeout(500);
        //checkign to see if lowP is the list of watches or if it went straight to one watch.
        if (tPage.url().indexOf("&post_type") != -1) {
          lowest = await utilFunc.getItem(
            lowP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-401591.status-publish.first.instock.product_cat-rolex.product_cat-submariner.has-post-thumbnail.featured.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span"
          );
          highest = await utilFunc.getItem(
            highP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-401591.status-publish.first.instock.product_cat-rolex.product_cat-submariner.has-post-thumbnail.featured.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span"
          );
        } else {
          // there is one watch therefore lowest = highest
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          highest = lowest;
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
        await lowP.waitForTimeout(500);
        await highP.waitForTimeout(500);
        if (tPage.url().indexOf("&post_type") != -1) {
          // checking to see if it shows multiple watches or went straight to one watch
          lowest = await utilFunc.getItem(
            lowP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-398817.status-publish.first.instock.product_cat-rolex.product_cat-cosmograph-daytona.has-post-thumbnail.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span > span > bdi"
          );
          highest = await utilFunc.getItem(
            highP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-398817.status-publish.first.instock.product_cat-rolex.product_cat-cosmograph-daytona.has-post-thumbnail.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span > span > bdi"
          );
        } else {
          // only one watch therefore lowest = highest
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          highest = lowest;
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
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&s=" +
            refNums[i] +
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
            refNums[i] +
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        if (
          await utilFunc.exists(
            tPage,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box"
          )
        ) {
          // checking to see if it shows multiple watches or went straight to one watch
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );
          highest = await utilFunc.getItem(
            highP,
            'span[class="woocommerce-Price-amount amount"]'
          );
          await lowP.click('div[class="title-wrapper"]', { delay: 20 });
          await highP.click('div[class="title-wrapper"]', { delay: 20 });

          lowTableBoxAndPaper = await lowP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          lowTableGeneral = await lowP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          indexLow = lowTableGeneral.indexOf("Year");
          if (indexLow != -1) {
            yearLow = lowTableGeneral.substring(indexLow + 4);
          }
          highTableBoxAndPaper = await highP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          highTableGeneral = await highP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          indexHigh = highTableGeneral.indexOf("Year");
          if (indexHigh != -1) {
            yearHigh = highTableGeneral.substring(indexHigh + 4);
          }
        } else {
          console.log(tPage.url());
          // only one watch therefore highData = lowData
          // already on the specific watch page. no need to click anything
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          lowTableBoxAndPaper = await lowP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          lowTableGeneral = await lowP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          //console.log("lowTableGeneral: " + lowTableGeneral);
          indexLow = lowTableGeneral.indexOf("Year");
          if (indexLow != -1) {
            yearLow = lowTableGeneral.substring(indexLow + 4);
          }

          highest = lowest;
          yearHigh = yearLow;
          highTableBoxAndPaper = lowTableBoxAndPaper;
        }
      }
    }
    console.log("Lowest: " + lowest);
    console.log("Low Year: " + yearLow);
    console.log("Low Box and Paper: " + lowTableBoxAndPaper);
    console.log("lOWEST URL: " + lowP.url());
    console.log("Highest: " + highest + "\n");
    console.log("High Year: " + yearHigh);
    console.log("High Box and Paper: " + highTableBoxAndPaper);
    console.log("HIGHEST URL: " + highP.url());
  }
}

async function findLowestPriceDavidsw(page, refNum) {
  link =
    "https://davidsw.com/?orderby=price&paged=1&s=" +
    refNum +
    "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  console.log("lowest price at page");
  return await page.$eval('span[class="price"]', (price) => price.textContent);
}

async function findHighestPriceDavidsw(page, refNum) {
  //https://davidsw.com/?orderby=price-desc&paged=1&s=124060&post_type=product&type_aws=true&aws_id=1&aws_filter=1
  link =
    "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
    refNum +
    "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  return await page.$eval('span[class="price"]', (price) => price.textContent);
}

module.exports = { davidsw };
