const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
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

    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);

    if (refNums[i] === "116500LN-0001") {
      newURL =
        "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=116500LN#/filter:custom_field_9:White";
    } else if (refNums[i] === "16570 BLK IX OYS") {
      newURL =
        "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=16570#/filter:custom_field_9:Black";
    } else if (refNums[i] === "16570 WHT IX OYS") {
      newURL =
        "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=16570#/filter:custom_field_9:White";
    } else if (refNums[i] === "116500LN-0002") {
      newURL =
        "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=116500LN#/filter:custom_field_9:Black";
    } else if (refNums[i] === "126710BLNR-0002") {
      newURL = "https://www.bobswatches.com/shop?query=126710BLNR#/filter:custom_field_7:Jubilee/filter:custom_field_9:Black"
    } else if (refNums[i] === "214270-0003") {
      newURL = "https://www.bobswatches.com/shop?query=214270#/filter:custom_field_9:Black"
    }
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
      await prepare(lowP, highP, newURL); // sorts page
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

async function select(page, sel, Text) {
  let $elemHandler = await page.$(sel);
  let properties = await $elemHandler.getProperties();
  for (const property of properties.values()) {
    const element = property.asElement();
    if (element) {
      let hText = await element.getProperty("text");
      let text = await hText.jsonValue();
      if (text === Text) {
        let hValue = await element.getProperty("value");
        let value = await hValue.jsonValue();
        await page.select(sel, value); // or use 58730
      }
    }
  }
}

async function getData(lowP, highP) {
  await lowP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "3"
  );

  await highP.click(
    "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
    "2"
  );

  lowest = await utilFunc.getItem(
    lowP,
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
  );
  highest = await utilFunc.getItem(
    highP,
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding"
  );

  lowSku = await lowP.$eval("meta[itemprop='sku']", (el) => el.content);

  highSku = await highP.$eval("meta[itemprop='sku']", (el) => el.content);

  console.log("LowSKU", lowSku, "HighSKU", highSku);

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

  // await select(
  //   lowP,
  //   "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
  //   "Price - Low to High"
  // );


  // await select(
  //   highP,
  //   "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
  //   "Price - High to Low"
  // ).catch(async (err) => {
  //   console.log(err);
  //   await highP.waitForTimeout(1000);
  //   await select(
  //     highP,
  //     "#searchspring-content > div > div.ss-toolbar.ss-toolbar-top.search-sort-view.ss-targeted.ng-scope > form > div.search-sort-option.sort-by > select",
  //     "Price - High to Low"
  //   );
  // });
}

module.exports = { bobs };
