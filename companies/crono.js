const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require("fs");
const refN = require("../refNums");
var refNums = refN.getRefNums();

var lowest = "";
var highest = "";
var childLow = 1;
var childHigh = 1;
var brandLow = "";
var brandHigh = "";
var highTable = "";
var lowTable = "";
var yearLow = "";
var yearHigh = "";
var lowBP = "";
var lowBox = "No";
var lowPaper = "No";
var highBox = "No";
var highPaper = "No";
var lowImage = "";
var highImage = "";
var highBP = "";
var lowSku = "";
var highSku = "";
var test = 3
var lowDealerStatus = ""
var highDealerStatus = ""

async function chrono24(lowP, highP, tPage, list) {
  flag = true;
  for (var i = 0; i < refNums.length; i++) {
    lowest = "";
    highest = "";
    childLow = 1;
    childHigh = 1;
    brandLow = "";
    brandHigh = "";
    highTable = "";
    lowTable = "";
    yearLow = "";
    yearHigh = "";
    lowBP = "";
    lowBox = "No";
    lowPaper = "No";
    highBox = "No";
    highPaper = "No";
    lowImage = "";
    highImage = "";
    highBP = "";
    lowSku = "";
    highSku = "";

    var newURL =
      "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
      refNums[i];

    console.log("REF: " + refNums[i] + "\n" + "GENERAL URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });

    if (
      await utilFunc.noResults2(
        tPage,
        "div[class='h1 m-b-0 text-center']",
        "We've found no results"
      )
    ) {
      //no results
      continue;
    } else {
      //results
      //prepare
      await prepareStuff(lowP, highP, newURL, list, refNums[i]);

      //assignData(lowTable, highTable);

      w = new Watch(
        refNums[i],
        yearLow,
        yearHigh,
        lowBox,
        lowPaper,
        highBox,
        highPaper,
        lowest.trim(),
        highest.trim(),
        lowDealerStatus,
        highDealerStatus,
        lowP.url(),
        highP.url(),
        tPage.url(),
        lowImage,
        highImage,
        brandLow,
        brandHigh,
        lowSku,
        highSku
      );
        
      //console.log("lowSku", lowSku);
      fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");
      console.log(JSON.stringify(w, null, "\t"));
      //utilFunc.addToJson(w)
    }
  }
}

prepareStuff = async (lowP, highP, url, list, rn) => {
  test = 54
  await lowP.goto(url + "&sortorder=1");
  childLow = await checkTop(lowP, "low", list, rn);
  lowest = await utilFunc.getItem(
    lowP,
    "#wt-watches > div:nth-child(" +
      childLow +
      ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
  );

  if (flag) {
    if (await utilFunc.exists(lowP, "#modal-content > div > button")) {
      await lowP.click("#modal-content > div > button", { delay: 20 });
      flag = false;
    }
  }

  lowDealerStatus = String(await utilFunc.getItem(
    lowP,
    "#wt-watches > div:nth-child(" +
      childLow +
      ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
  ))
  if (lowDealerStatus.trim() === "Professional dealer") {
    lowDealerStatus = "PD";
  } else if (lowDealerStatus.trim() === "Private Seller") {
    lowDealerStatus = "PS";
  } else {
    lowDealerStatus = "";
  }

  await lowP.click("#wt-watches > div:nth-child(" + childLow + ") > a", {
    delay: 20,
  });
  await lowP.reload();
  await lowP.waitForTimeout(500)
  lowTable = String(
    await utilFunc.getItem(
      lowP,
      "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
    )
  );

  await highP.goto(url + "&searchorder=11&sortorder=11");
  await highP.waitForTimeout(1000);
  //await highP.click("#modal-content > div > a", {delay: 20})
  childHigh = await checkTop(highP, "high", list, rn);
  highest = await utilFunc.getItem(
    highP,
    "#wt-watches > div:nth-child(" +
      childHigh +
      ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
  );
  highDealerStatus = await utilFunc.getItem(
    highP,
    "#wt-watches > div:nth-child(" +
      childHigh +
      ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
  );
  if (highDealerStatus.trim() === "Professional dealer") {
    highDealerStatus = "PD";
  } else if (highDealerStatus.trim() === "Private Seller") {
    highDealerStatus = "PS";
  } else {
    highDealerStatus = "";
  }

  await highP.click("#wt-watches > div:nth-child(" + childHigh + ") > a", {
    delay: 20,
  });

  await highP.reload()
  await highP.waitForTimeout(500)

  highTable = String(
    await utilFunc.getItem(
      highP,
      "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
    )
  );

  lowImage = String(await lowP
    .$eval("img[class='img-responsive mh-100']", (el) => el.src)
    .catch((err) => {
      return "";
    }))
  highImage = String(await highP
    .$eval("img[class='img-responsive mh-100']", (el) => el.src)
    .catch((err) => {
      return "";
    }))



    /***************** */
    lowSkuIndex1 = lowTable.indexOf("Listing code") + 12;
    lowSkuIndex2 = lowTable.indexOf("Brand");
    if (
      lowSkuIndex2 > lowTable.indexOf("Dealer product code") &&
      lowTable.indexOf("Dealer product code") != -1
    ) {
      lowSkuIndex2 = lowTable.indexOf("Dealer product code");
    }
  
    /***************** */
  
    highSkuIndex1 = highTable.indexOf("Listing code") + 12;
    highSkuIndex2 = highTable.indexOf("Brand");
    if (
      highSkuIndex2 > highTable.indexOf("Dealer product code") &&
      highTable.indexOf("Dealer product code") != -1
    ) {
      highSkuIndex2 = highTable.indexOf("Dealer product code");
    }
    /***************** */
  
    index1BrandLow = lowTable.indexOf("Brand") + 5;
    index2BrandLow = lowTable.indexOf("Model");

    if (
      index1BrandLow != 4 &&
      index1BrandLow != lowTable.indexOf("Brand new") + 5
    ) {
      if (index2BrandLow === -1) {
        index2BrandLow = lowTable.indexOf("Reference number");
      }
    }
    /***************** */
  
    index1BrandHigh = highTable.indexOf("Brand") + 5;
    index2BrandHigh = highTable.indexOf("Model");

    if (
      index1BrandHigh != 4 &&
      index1BrandLow != lowTable.indexOf("Brand new") + 5
    ) {
      if (index2BrandHigh === -1) {
        index2BrandHigh = highTable.indexOf("Reference number");
      }
    }
    /***************** */
  
    index1YearLow = lowTable.indexOf("Year of production") + 18;
    index2YearLow = lowTable.indexOf("Condition");
    if (index2YearLow === -1) {
      index2YearLow = lowTable.indexOf("Scope of delivery");
    }
    /***************** */
    index1YearHigh = highTable.indexOf("Year of production") + 18;
    index2YearHigh = highTable.indexOf("Condition");
    if (index2YearHigh === -1) {
      index2YearHigh = highTable.indexOf("Scope of delivery");
    }
    /***************** */
  
    index1BPLow = lowTable.indexOf("Scope of delivery") + 17;
    index2BPLow = lowTable.indexOf("Gender");
    if (index2BPLow === -1) {
      index2BPLow = lowTable.indexOf("Location");
    }
    /***************** */
  
    index1BPHigh = highTable.indexOf("Scope of delivery") + 17;
    index2BPHigh = highTable.indexOf("Gender");
    if (index2BPHigh === -1) {
      index2BPHigh = highTable.indexOf("Location");
    }
    /***************** */
  
    lowSku = lowTable.substring(lowSkuIndex1, lowSkuIndex2).trim();
    highSku = highTable.substring(highSkuIndex1, highSkuIndex2).trim();
    brandLow = lowTable.substring(index1BrandLow, index2BrandLow).trim();
    if (brandLow.length > 50) {
      brandLow = ""
    }
    if (brandHigh.length > 50) {
      brandHigh = ""
    }
    brandHigh = highTable.substring(index1BrandHigh, index2BrandHigh).trim();
    yearLow = lowTable
      .substring(index1YearLow, index2YearLow)
      .replace(/\s+/g, "")
      .replace("Unknown", "");
    yearHigh = highTable
      .substring(index1YearHigh, index2YearHigh)
      .replace(/\s+/g, "")
      .replace("Unknown", "");
    lowBP = lowTable.substring(index1BPLow, index2BPLow).trim().toLowerCase();
    if (lowBP.indexOf("original box") != -1) {
      lowBox = "Yes";
    }
    if (lowBP.indexOf("original papers") != -1) {
      lowPaper = "Yes";
    }
    highBP = highTable.substring(index1BPHigh, index2BPHigh).trim().toLowerCase();
    if (highBP.indexOf("original box") != -1) {
      highBox = "Yes";
    }
    if (highBP.indexOf("original papers") != -1) {
      highPaper = "Yes";
    }
  

};


checkTop = async (page, LH, arr, rn) => {
  min = getBuffer(arr, 0.9, rn);
  max = getBuffer(arr, 1.1, rn);
  console.log(rn, min, max);
  thing = await page.$("#wt-watches");
  top = await page.evaluate((e) => e.children.length, thing);
  for (var i = 1; i <= top; i++) {
    var watch = await typeOf(page, "#wt-watches > div:nth-child(" + i + ")");
    var isntTop = await noTop(page, "#wt-watches > div:nth-child(" + i + ")");
    var price = (
      await utilFunc.getItem(
        page,
        "#wt-watches > div:nth-child(" +
          i +
          ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      )
    ).replace(",", "");
    price = price.replace("$", "").trim();
    price = parseFloat(price);

    //console.log("Watch: ", watch, "IsntTop", isntTop, "price > min", price > min, "price < max",price < max, "P", price, "Ma", max,"Mi",min,i)
    if (watch && isntTop && price > min && price < max) {
      //console.log("Good", i, price);
      return i;
    } else {
      //console.log("Top", !isntTop, "Watch", watch, i)
    }
  }
  return 1;
};

getBuffer = (list, percent, refNum) => {
  var price = 0;
  var num = 0;
  list.forEach((watch) => {
    if (watch.refNum.trim() === refNum.trim()) {
      if (percent === 0.9) {
        price += parseFloat(watch.lowPrice.trim());
        num++;
      } else {
        price += parseFloat(watch.highPrice.trim());
        num++;
      }
    }
  });

  result = (price / num) * percent;
  if (num === 0 && percent < 1.0) {
    return 0;
  } else if (num === 0 && percent > 1.0) {
    return Number.MAX_SAFE_INTEGER;
  }
  //console.log(price, result);
  return result;
};

typeOf = async (page, s) => {
  let element = await page.$(s);
  if (element === null) {
    return false;
  } else {
    let value = await page.evaluate((el) => el.className, element);
    if (String(value) === "article-item-container wt-search-result") {
      //console.log(value, i)
      return true;
    } else {
      return false;
    }
  }
};

noTop = async (page, s) => {
  // works
  let element = await page.$(s);
  if (element === null) {
    return false;
  } else {
    let value = await page.evaluate((el) => el.textContent, element);
    return value.indexOf("Top") === -1;
  }
};

module.exports = { chrono24 };
