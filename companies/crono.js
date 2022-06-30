const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const mike = require("../highAndLow.js");

async function chrono24(lowP, highP, tPage) {
  flag = true;
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    highest = "-1";
    var childLow = 1;
    var childHigh = 1;
    brandLow=""
    brandHigh=""

    highTable = "";
    lowTable = "";
    var newURL =
      "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "GENERAL URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    await tPage.waitForTimeout(1000);
    //await checkTop(tPage);
    //await tPage.waitForTimeout(9999999);
    if (
      await utilFunc.noResults2(
        tPage,
        "#main-content > div > div.result-page-intro.relative.overlapping > div > div.result-page-headline > div > div.h1.m-b-0.text-center",
        "We've found no results for"
      )
    ) {
      // no results
      continue;
    } else {
      // deal with "TOP" choice from chrono.
      // https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=311.30.42.30.01.005&resultview=list&sortorder=1
      // when gettin prices, the price of "TOP" comes up first
      await lowP.goto(newURL + "&sortorder=1");
      await lowP.waitForTimeout(500);
      childLow = await checkTop(lowP, 'low');
      if (flag) {
        await lowP.click("#modal-content > div > a", { delay: 20 });
        flag = false;
      }
      await lowP.waitForTimeout(1000);
      lowest = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(" +
          childLow +
          ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      lowDealerStatus = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(" +
          childLow +
          ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );
      await lowP.click("#wt-watches > div:nth-child(" + childLow + ") > a", {
        delay: 20,
      });
      await lowP.waitForTimeout(500);
      lowTable = String(
        await utilFunc.getItem(
          lowP,
          "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
        )
      );
      
      index1BrandLow = lowTable.indexOf("Brand")+5
      index2BrandLow = lowTable.indexOf("Model")
      if (index2BrandLow === -1) {
        index2BrandLow = lowTable.indexOf("Reference number")
      }
      brandLow=lowTable.substring(index1BrandLow,index2BrandLow).trim()
      

      index1YearLow = lowTable.indexOf("Year of production") + 18;
      index2YearLow = lowTable.indexOf("Condition");
  
      index1BPLow = lowTable.indexOf("Scope of delivery") + 17;
      index2BPLow = lowTable.indexOf("Gender");
      if (index2BPLow === -1) {
        index2BPLow = lowTable.indexOf("Location")
      }

      await highP.goto(newURL + "&searchorder=11&sortorder=11");
      await highP.waitForTimeout(500);
      //await highP.click("#modal-content > div > a", {delay: 20})
      childHigh = await checkTop(highP, "high");
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

      await highP.click("#wt-watches > div:nth-child(" + childHigh + ") > a", {
        delay: 20,
      });

      await highP.waitForTimeout(500);

      highTable = String(
        await utilFunc.getItem(
          highP,
          "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
        )
      );

      index1BrandHigh = highTable.indexOf("Brand")+5
      index2BrandHigh = highTable.indexOf("Model")
      if (index2BrandHigh === -1) {
        index2BrandHigh = highTable.indexOf("Reference number")
      }
      brandHigh=highTable.substring(index1BrandHigh,index2BrandHigh).trim()
      console.log(brandLow,brandHigh)

      index1YearHigh = highTable.indexOf("Year of production") + 18;
      index2YearHigh = highTable.indexOf("Condition");
      index1BPHigh = highTable.indexOf("Scope of delivery") + 17;
      index2BPHigh = highTable.indexOf("Gender");
      if (index2BPHigh === -1) {
        index2BPHigh = highTable.indexOf("Location")
      }
    }
    w = new Watch(
      refNums[i],
      lowTable.substring(index1YearLow, index2YearLow).replace(/\s+/g, ""),
      highTable.substring(index1YearHigh, index2YearHigh).replace(/\s+/g, ""),
      "",
      "",
      lowTable.substring(index1BPLow, index2BPLow).trim(),
      "",
      "",
      highTable.substring(index1BPHigh, index2BPHigh).trim(),
      lowest.trim(),
      highest.trim(),
      lowDealerStatus.replace(/\s+/g, ""),
      highDealerStatus.replace(/\s+/g, ""),
      lowP.url(),
      highP.url(),
      tPage.url()
    );
    //utilFunc.CSV(w)
    //console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w)
  }
}

checkTop = async (page, LH) => {
  for (var i = 1; i < 20; i++) {
    var watch = await typeOf(page, "#wt-watches > div:nth-child(" + i + ")", i);
    var isntTop = await noTop(page, "#wt-watches > div:nth-child(" + i + ")");
    var price = await utilFunc.getItem(
      page,
      "#wt-watches > div:nth-child(" +
        i +
        ") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
    );

    // if (LH === "low") {
    //   if (
    //     isntTop &&
    //     watch &&
    //     parseFloat(price.replace("$", "").replace(",", "")) >
    //       mike.getHighAndLow(refNums[i])[0]
    //   ) {
    //     //console.log("Good", i, price.trim())

    //     return i;
    //   } else {
    //     //console.log("Top", !isntTop, "Watch", watch, i)
    //   }
    // } else {
    //   if (
    //     isntTop &&
    //     watch &&
    //     parseFloat(price.replace("$", "").replace(",", "")) >
    //       mike.getHighAndLow(refNums[i])[1]
    //   ) {
    //     //console.log("Good", i, price.trim())

    //     return i;
    //   } else {
    //     //console.log("Top", !isntTop, "Watch", watch, i)
    //   }
    // }

    if (
      isntTop &&
      watch ) {
      //console.log("Good", i, price.trim())

      return i;
    } else {
      //console.log("Top", !isntTop, "Watch", watch, i)
    }
  }
};

typeOf = async (page, s, i) => {
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
