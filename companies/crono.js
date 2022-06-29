const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");

async function chrono24(lowP, highP, tPage) {
  flag = true;
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    highest = "-1";
    var child = 1
    highTable = "";
    lowTable = "";
    var newURL =
      "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "GENERAL URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    await tPage.waitForTimeout(1000);
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
      if (flag) {
        await lowP.click("#modal-content > div > a", { delay: 20 });
        flag = false;
      }
      await lowP.waitForTimeout(1000);
      await checkTop(lowP, child);
      lowest = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child("+child+") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      lowDealerStatus = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child("+child+") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );
      await lowP.click("#wt-watches > div:nth-child("+child+") > a", { delay: 20 });
      await lowP.waitForTimeout(500);
      lowTable = String(
        await utilFunc.getItem(
          lowP,
          "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
        )
      );

      index1YearLow = lowTable.indexOf("Year of production") + 18;
      index2YearLow = lowTable.indexOf("Condition");
      index1BPLow = lowTable.indexOf("Scope of delivery") + 17;
      index2BPLow = lowTable.indexOf("Gender");

      //console.log("TABLE: "+ lowTable)
      await highP.goto(newURL + "&searchorder=11&sortorder=11");
      await highP.waitForTimeout(500);
      //await highP.click("#modal-content > div > a", {delay: 20})
      await checkTop(highP, child);
      highest = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child("+child+") > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      highDealerStatus = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child("+child+") > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );

      await highP.click("#wt-watches > div:nth-child("+child+") > a", { delay: 20 });

      await highP.waitForTimeout(500);

      highTable = String(
        await utilFunc.getItem(
          highP,
          "#jq-specifications > div > div.row.text-lg.m-b-6 > div.col-xs-24.col-md-12.m-b-6.m-b-md-0 > table > tbody:nth-child(1)"
        )
      );

      index1YearHigh = lowTable.indexOf("Year of production") + 18;
      index2YearHigh = lowTable.indexOf("Condition");
      index1BPHigh = lowTable.indexOf("Scope of delivery") + 17;
      index2BPHigh = lowTable.indexOf("Gender");
    }
    w = new Watch(
      refNums[i],
      lowTable.substring(index1YearLow, index2YearLow).replace(/\s+/g, ""),
      highTable.substring(index1YearHigh, index2YearHigh).replace(/\s+/g, ""),
      "",
      "",
      lowTable.substring(index1BPLow, index2BPLow).replace(/\s+/g, ""),
      "",
      "",
      highTable.substring(index1BPHigh, index2BPHigh).replace(/\s+/g, ""),
      lowest.trim(),
      highest.trim(),
      lowDealerStatus.replace(/\s+/g, ""),
      highDealerStatus.replace(/\s+/g, ""),
      lowP.url(),
      highP.url(),
      tPage.url()
    );
    console.log(w);
    //utilFunc.addToJson(w);
  }
}

// checkTop = async (page, c) => {
//   while (await page.$$("#wt-watches > div:nth-child("+c+") > a > div.article-image-container > span.article-badge.top.reduced") != [] || page.$$("#wt-watches > div:nth-child("+c+")").then(async (handles) => {
//     return await (await [handles].getProperty('localName') != "div")
//   })) {
//     c++;
//   }
//   console.log("Child",c)
//   // result of this finds the nth-child that does not have the "top" tag.
// }

module.exports = { chrono24 };
