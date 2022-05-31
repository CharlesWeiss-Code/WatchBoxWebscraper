const utilFunc = require("../utilityFunctions.js");
import { Watch } from "../DataStructures/Watch";

async function chrono24(lowP, highP, tPage, scrape) {
  flag = true;
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    highest = "-1";
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
      lowest = 0;
      highest = 0;
      continue;
    } else {
      // deal with "TOP" choice from chrono.
      // https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=311.30.42.30.01.005&resultview=list&sortorder=1
      // when gettin prices, the price of "TOP" comes up first
      await lowP.goto(newURL + "&searchorder=11&sortorder=1");
      await lowP.waitForTimeout(500);
      if (flag) {
        await lowP.click("#modal-content > div > a", { delay: 20 });
        flag = false;
      }
      await lowP.waitForTimeout(1000);
      lowest = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      lowDealerStatus = await utilFunc.getItem(
        lowP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );
      await lowP.click("#wt-watches > div:nth-child(1) > a", { delay: 20 });
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

      highest = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      HighDealerStatus = await utilFunc.getItem(
        highP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );

      await highP.click("#wt-watches > div:nth-child(1) > a", { delay: 20 });

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

      console.log("Lowest: " + "\t" + lowest.replace(/\s+/g, ""));
      console.log(
        "lowDealerStatus" + "\t" + lowDealerStatus.replace(/\s+/g, "")
      );
      console.log(
        "LowYear: " +
          "\t" +
          lowTable.substring(index1YearLow, index2YearLow).replace(/\s+/g, "")
      );
      console.log(
        "lowBoxAndPapers" +
          "\t" +
          lowTable.substring(index1BPLow, index2BPLow).replace(/\s+/g, "")
      );
      console.log("LOW URL: " + lowP.url());

      console.log("Highest: " + "\t" + highest.replace(/\s+/g, ""));
      console.log(
        "HighDealerStatus" + "\t" + HighDealerStatus.replace(/\s+/g, "")
      );
      console.log(
        "HighYear: " +
          "\t" +
          highTable
            .substring(index1YearHigh, index2YearHigh)
            .replace(/\s+/g, "")
      );
      console.log(
        "HighBoxAndPapers" +
          "\t" +
          highTable.substring(index1BPHigh, index2BPHigh).replace(/\s+/g, "")
      );
      console.log("HIGH URL: " + highP.url());
    }
    scrape.addWatch(
      new Watch(
        refNums[i],
        lowTable.substring(index1YearLow, index2YearLow).replace(/\s+/g, ""),
        highTable.substring(index1YearHigh, index2YearHigh).replace(/\s+/g, ""),
        "",
        "",
        lowTable.substring(index1BPLow, index2BPLow).replace(/\s+/g, ""),
        "",
        "",
        highTable.substring(index1BPHigh, index2BPHigh).replace(/\s+/g, ""),
        lowest,
        highest,
        lowDealerStatus.replace(/\s+/g, ""),
        highDealerStatus.replace(/\s+/g, ""),
        lowP.url(),
        highP.url(),
        tPage.url()
      ),
      "chrono"
    );
  }
}

module.exports = { chrono24 };
