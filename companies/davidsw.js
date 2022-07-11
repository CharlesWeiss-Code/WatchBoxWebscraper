const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require("fs");
async function davidsw(lowP, highP, tPage, list) {
  for (var i = 0; i < refNums.length; i++) {
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

    var newURL =
      "https://davidsw.com/?s=" +
      refNums[i] +
      "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
    lowest = -1;
    highest = -1;
    if (refNums[i] == "116500LN-0001") {
      // special white daytona
      newURL =
        "https://davidsw.com/?filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

    } else if (refNums[i] == "116500LN-0002") {
      newURL =
        "https://davidsw.com/?filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
    }
    else if (refNums[i] === "16570 BLK IX OYS") {
      newURL = "https://davidsw.com/?filter_dial-color=black&s=16570&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
      
    } else if (refNums[i] === "16570 WHT IX OYS") {
      newURL = "https://davidsw.com/?filter_dial-color=white&s=16570&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
    } else if (refNums[i] === "126710BLNR-0002") {
      newURL = "https://davidsw.com/?s=126710BLNR&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
    } else if (refNums[i] === "126710BLRO-0001") {
      newURL = "https://davidsw.com/?s=126710BLRO&post_type=product&type_aws=true&aws_id=1&aws_filter=1" 
    } else if (refNums[i] === "116400GV-0001") {
      newURL = "https://davidsw.com/?filter_dial-color=black&s=116400GV&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
    } else if (refNums[i] === "214270-0003") {
      newURL = "https://davidsw.com/?filter_dial-color=black&s=214270&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
    }
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    if (
      await utilFunc.exists(tPage, "#main > div > div.col.large-9 > div > p")
    ) {
      // no results
      continue;
    } else {
      console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
      //https://davidsw.com/?s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1
      //https://davidsw.com/?orderby=price&paged=1&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1
      //https://davidsw.com/?orderby=price&paged=1&=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1
      
      await lowP
        .goto(getUrl(newURL, "orderby=price&paged=1&"),
          { waitUntil: "networkidle0" }
        )
        .catch(async () => {
          await lowP.waitForTimeout(1000);
          await lowP.reload();
          await lowP.waitForTimeout(1000);
        });
      await highP
        .goto(getUrl(newURL, "orderby=price-desc&"),
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
        imageLow = String(await lowP
          .$eval("img[class='wp-post-image skip-lazy lazy-load-active']", (el) => el.src)
          .catch((err) => {
            return "";
          }))
         imageHigh= String(await highP
          .$eval("img[class='wp-post-image skip-lazy lazy-load-active']", (el) => el.src)
          .catch((err) => {
            return "";
          }))
      } else {
        await assignDataOneResult(lowP);

        imageHigh = String(await highP
          .$eval("img[class='wp-post-image skip-lazy lazy-load-active']", (el) => el.src)
          .catch((err) => {
            return "";
          }))
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
      lowBoxIndex2 = lowTableBoxAndPaper.indexOf("Warranty Papers")
    }

    highBoxIndex1 = highTableBoxAndPaper.indexOf("Box") + 3;
    highBoxIndex2 = highTableBoxAndPaper.indexOf("Hangtag");
    if (highBoxIndex2 === -1) {
      highBoxIndex2 = highTableBoxAndPaper.indexOf("Warranty Papers")
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
    //console.log(w);
    list.push(w);
    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");

    //utilFunc.addToJson(w);
    console.log(JSON.stringify(w, null, "\t"));
  }
}

module.exports = { davidsw };

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
  console.log(brandLow, brandHigh);

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
  console.log(lowSku, highSku);
}

getUrl = (url, filter) => url.substring(0,url.indexOf("&")+1)+filter+url.substring(url.indexOf("&s")+1)

