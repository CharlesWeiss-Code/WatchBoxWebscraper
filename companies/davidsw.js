const utilFunc = require("../utilityFunctions.js");

async function davidsw(lowP, highP, tPage) {
  for (var i = 5; i < refNums.length; i++) {
    console.log("");
    lowTables = null;
    highTables = null;
    lowBox = "null";
    lowPaper = "null";
    highBox = "null";
    highPaper = "null";
    lowYear = "null";
    highYear = "null";

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
          "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
          { waitUntil: "networkidle0" }
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
          { waitUntil: "networkidle0" }
        );

        //checkign to see if lowP is the list of watches or if it went straight to one watch.
        if (tPage.url().indexOf("&post_type") != -1) {
          await lowP.waitForSelector('span[class="price"]');
          await highP.waitForSelector('span[class="price"]');

          lowest = await utilFunc.getItem(lowP, 'span[class="price"]');
          highest = await utilFunc.getItem(highP, 'span[class="price"]');
        } else {
          // only one watch therefore lowest = highest
          await lowP.waitForSelector('span[class="price"]');

          lowest = await utilFunc.getItem(lowP, 'span[class="price"]');

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

        if (tPage.url().indexOf("&post_type") != -1) {
          // checking to see if it shows multiple watches or went straight to one watch
          await lowP.waitForSelector('span[class="price"]');
          await highP.waitForSelector('span[class="price"]');

          lowest = await utilFunc.getItem(lowP, 'span[class="price"]');
          highest = await utilFunc.getItem(highP, 'span[class="price"]');
        } else {
          // only one watch therefore lowest = highest
          await lowP.waitForSelector('span[class="price"]');

          lowest = await utilFunc.getItem(lowP, 'span[class="price"]');

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
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
          { waitUntil: "networkidle0" }
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
            refNums[i] +
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
          { waitUntil: "networkidle0" }
        );
        if (
          await utilFunc.exists(
            tPage,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box"
          )
        ) {
          // checking to see if it shows multiple watches or went straight to one watch
          await lowP.waitForSelector('span[class="price"]');

          lowest = await utilFunc.getItem(lowP, 'span[class="price"]');

          await highP.waitForSelector('span[class="price"]');
          highest = await utilFunc.getItem(highP, 'span[class="price"]');

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

          lowTableBoxAndPaper = lowTables[6];
          lowTableGeneral = lowTables[0];

          highTableBoxAndPaper = highTables[6];
          highTableGeneral = highTables[0];

          lowBoxIndex1 = lowTableBoxAndPaper.indexOf("Box") + 3;
          lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Hangtag");

          highBoxIndex1 = highTableBoxAndPaper.indexOf("Box") + 3;
          highBoxIndex2 = highTableBoxAndPaper.indexOf("Hangtag");

          lowBox = lowTableBoxAndPaper.substring(lowBoxIndex1, lowBoxIndex2);
          highBox = highTableBoxAndPaper.substring(
            highBoxIndex1,
            highBoxIndex2
          );

          lowPaperIndex1 =
            lowTableBoxAndPaper.indexOf("Warranty Papers / Card") + 22;

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
        } else {
          await lowP.waitForSelector("tbody");
          lowTables = await lowP.$$eval("tbody", (options) =>
            options.map((option) => option.textContent)
          );
          console.log(tPage.url());
          // only one watch therefore highData = lowData
          // already on the specific watch page. no need to click anything
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );
          lowTableBoxAndPaper = lowTables.at(6);
          lowBoxIndex1 = lowTableBoxAndPaper.indexOf("Box") + 3;
          lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Hangtag");

          lowBox = lowTableBoxAndPaper.substring(lowBoxIndex1, lowBoxIndex2);

          lowPaperIndex1 =
            lowTableBoxAndPaper.indexOf("Warranty Papers / Card") + 22;

          lowPaper = lowTableBoxAndPaper.substring(lowPaperIndex1);
          lowTableGeneral = lowTables.at(0);
          indexLow = lowTableGeneral.indexOf("Year");
          if (indexLow != -1) {
            lowYear = lowTableGeneral.substring(indexLow + 4);
          }

          highest = lowest;
          highYear = lowYear;
          highBox = lowBox;
          highPaper = lowPaper;
        }
      }
    }
    //console.log("LOW TABLES: " + lowTables + "\n");
    console.log("Lowest: " + lowest);
    console.log("Low Year: " + lowYear.replace(/\s+/g, ""));
    console.log("Low Box: " + lowBox.replace(/\s+/g, ""));
    console.log("Low Paper: " + lowPaper.replace(/\s+/g, ""));
    console.log("lOWEST URL: " + lowP.url() + "\n");
    console.log("Highest: " + highest);
    console.log("High Year: " + highYear.replace(/\s+/g, ""));
    console.log("High Box: " + highBox.replace(/\s+/g, ""));
    console.log("High Paper: " + highPaper.replace(/\s+/g, ""));
    console.log("HIGHEST URL: " + highP.url());
  }
}

module.exports = { davidsw };
