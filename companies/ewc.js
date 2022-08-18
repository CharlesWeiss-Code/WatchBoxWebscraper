const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer, ConsoleMessage } = require("puppeteer");
const { text } = require("express");

var lowest = "";
var highest = "";
var brandLow = "";
var brandHigh = "";
var lowSku = "";
var highSku = "";
var lowestChild = 1;
var highestChild = 1;
var lowImage = "";
var highImage = "";
var lowLink = "";
var highLink = "";
var lowBox = "No";
var highBox = "No";
var lowPaper = "No";
var highPaper = "No";

async function EWC(lowP, highP, tPage, startIndex) {
  for (var i = startIndex; i < refNums.length; i++) {
    try {
      console.log("");
      lowest = "";
      highest = "";
      brandLow = "";
      brandHigh = "";
      lowSku = "";
      highSku = "";
      lowestChild = 1;
      highestChild = 1;
      lowImage = "";
      highImage = "";
      lowLink = "";
      highLink = "";
      lowBox = "No";
      highBox = "No";
      lowPaper = "No";
      highPaper = "No";

      var newURL = utilFunc.getLink("EWC", refNums[i]);

      console.log("URL: " + newURL);
      console.log(
        i + 2 * refNums.length + "/" + refNums.length * 6,
        ((i + 2 * refNums.length) / (refNums.length * 6)) * 100 + "%"
      );
      await tPage
        .goto(newURL, { waitUntil: "networkidle0" })
        .catch(async (e) => {
          await utilFunc.reTry(tPage, 0);
        });

      await tPage.waitForTimeout(1000);

      if (await utilFunc.noResults(tPage, "body > section > h3")) {
        continue;
      } else {
        await lowP.goto(tPage.url()).catch(async (e) => {
          await utilFunc.reTry(lowP, 0);
        });
        await highP.goto(tPage.url()).catch(async (e) => {
          await utilFunc.reTry(highP, 0);
        });
        await lowP.waitForTimeout(500);
        await highP.waitForTimeout(500);

        lowestChild = await getChild("Low", lowP);
        highestChild = await getChild("High", highP);

        console.log("LowC", lowestChild, "HighC", highestChild);
        //EWC Is weird and needs its own function.
        lowest = await utilFunc.getItem(
          lowP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            lowestChild +
            ") > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p"
        );
        highest = await utilFunc.getItem(
          highP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            highestChild +
            ") > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p"
        );
        console.log(lowest, highest);
        brandLow = await utilFunc.getItem(
          lowP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            lowestChild +
            ") > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );
        brandHigh = await utilFunc.getItem(
          highP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            highestChild +
            ") > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );

        brandLow = brandLow.substring(0, brandLow.indexOf(" "));
        brandHigh = brandHigh.substring(0, brandHigh.indexOf(" "));

        lowImage = String(
          await lowP.$eval(
            "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
              lowestChild +
              ") > a",
            (res) => res.outerHTML
          )
        );

        highImage = String(
          await highP.$eval(
            "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
              highestChild +
              ") > a",
            (res) => res.outerHTML
          )
        );
        lowImageIndex1 = lowImage.indexOf("url('") + 5;
        lowImageIndex2 = lowImage.indexOf("')");
        lowImage = lowImage.substring(lowImageIndex1, lowImageIndex2);

        highImageIndex1 = highImage.indexOf("url('") + 5;
        highImageIndex2 = highImage.indexOf("')");
        highImage = highImage.substring(highImageIndex1, highImageIndex2);

        lowLink = await lowP.$eval(
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            lowestChild +
            ") > a",
          (res) => res.href
        );

        highLink = await lowP.$eval(
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            highestChild +
            ") > a",
          (res) => res.href
        );
        await lowP.waitForTimeout(500);
        await highP.waitForTimeout(500);

        // await lowP
        //   .click(
        //     "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
        //       lowestChild +
        //       ") > a",
        //     { delay: 20 }
        //   )
        //   .catch(async () => {
        //     await lowP.reload();
        //     await lowP.waitForTimeout(1000);
        //     await lowP.click(
        //       "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
        //         lowestChild +
        //         ") > a",
        //       { delay: 20 }
        //     );
        //   })

        lowURL = await lowP.$eval(
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            lowestChild +
            ") > a",
          async (res) => res.href
        );

        // await highP
        //   .click(
        //     "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
        //       highestChild +
        //       ") > a",
        //     { delay: 20 }
        //   )
        //   .catch(async () => {
        //     await highP.reload();
        //     await highP.waitForTimeout(1000);
        //     await highP.click(
        //       "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
        //         lowestChild +
        //         ") > a",
        //       { delay: 20 }
        //     );
        //   })
        highURL = await highP.$eval(
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
            highestChild +
            ") > a",
          async (res) => res.href
        );
        console.log("'" + lowURL + "'" + highURL + "'");

        await lowP
          .goto(lowURL, { waitUntil: "networkidle0" })
          .catch(async () => await utilFunc.reTry(lowP));

        await highP
          .goto(lowURL, { waitUntil: "networkidle0" })
          .catch(async () => await utilFunc.reTry(highP));
        await lowP.waitForTimeout(500);
        await highP.waitForTimeout(500);
        await lowP.reload();
        await highP.reload();

        await lowP.waitForTimeout(1000);
        console.log(lowP.url());
        lowPara = await lowP.$eval(
          "p[class='font-proxima mt-6 watch-bio-short-section']",
          (res) => {
            return res.innerText; //body > section > section:nth-child(5) > section.w-full.lg\:w-1\/2.lg\:pl-8 > div > p.font-proxima.mt-6.watch-bio-short-section
          }
        );
        await highP.waitForTimeout(1000);
        highPara = await highP.$eval(
          "p[class='font-proxima mt-6 watch-bio-short-section']",
          (res) => {
            return res.innerText;
          }
        );
        lowSku = lowPara
          .substring(lowPara.indexOf("(") + 1, lowPara.indexOf(")"))
          .trim();
        highSku = highPara
          .substring(highPara.indexOf("(") + 1, highPara.indexOf(")"))
          .trim();

        lowYear = await lowP.$eval(
          "span[id='watch-model']",
          (res) => res.innerText
        );
        lowYear = lowYear.substring(lowYear.length - 4);

        var numbLow = lowYear.match(/\d/g);
        if (numbLow != null) {
          lowYear = numbLow.join("");
        }

        highYear = await highP.$eval(
          "span[id='watch-model']",
          (res) => res.innerText
        );
        highYear = highYear.substring(highYear.length - 4);
        var numbHigh = highYear.match(/\d/g);
        if (numbHigh != null) {
          highYear = numbHigh.join("");
        }
        console.log("'" + lowYear + "'" + highYear + "'");

        if (validAge(lowYear)) {
          lastPeriodIndexLow = lowPara.lastIndexOf(".");
          lowYear = lowPara.substring(
            lastPeriodIndexLow - 4,
            lastPeriodIndexLow
          );
          if (!validAge(lowYear)) {
            lowYear = "";
          }
        }
        if (validAge(lowYear)) {
          lastPeriodIndexHigh = lowPara.lastIndexOf(".");
          highYear = highPara.substring(
            lastPeriodIndexHigh - 4,
            lastPeriodIndexHigh
          );
          if (!validAge(highYear)) {
            highYear = "";
          }
        }
        console.log("'" + lowYear + "'" + highYear + "'");

        if (
          lowPara
            .toLowerCase()
            .indexOf(brandLow.toLowerCase() + " box and papers")
        ) {
          lowBox = "Yes";
          lowPaper = "Yes";
        } else if (
          lowPara.toLowerCase().indexOf("original box and papers") != -1
        ) {
          lowBox = "Yes";
          lowPaper = "Yes";
        } else if (
          lowPara.toLowerCase().indexOf("original certificate") != -1
        ) {
          lowPaper = "Yes";
        } else if (
          lowPara.toLowerCase().indexOf(brandLow.toLowerCase() + " box") != -1
        ) {
          lowBox = "Yes";
        }

        if (
          highPara
            .toLowerCase()
            .indexOf(brandHigh.toLowerCase() + " box and papers")
        ) {
          highBox = "Yes";
          highPaper = "Yes";
        } else if (
          highPara.toLowerCase().indexOf("original box and papers") != -1
        ) {
          highBox = "Yes";
          highPaper = "Yes";
        } else if (
          highPara.toLowerCase().indexOf("original certificate") != -1
        ) {
          highPaper = "Yes";
        } else if (
          highPara.toLowerCase().indexOf(brandHigh.toLowerCase() + " box") != -1
        ) {
          highBox = "Yes";
        }

        w = new Watch(
          refNums[i],
          lowYear,
          highYear,
          lowBox,
          lowPaper,
          highBox,
          highPaper,
          String(lowest),
          String(highest),
          "",
          "",
          lowLink,
          highLink,
          tPage.url(),
          lowImage,
          highImage,
          brandLow,
          brandHigh,
          lowSku,
          highSku
        );
        console.log(w);
        fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
      }
      // if (lowest != "" || highest != "") {

      // }
    } catch (error) {
      console.log(error);
    }
  }
}

async function getChildrenToPrice(page) {
  var result = [];
  const max = await page.$eval(
    "body > section > section.flex.flex-wrap.watch-list.mx-auto",
    (res) => res.children.length
  );
  for (var i = 1; i <= max; i++) {
    const price = await utilFunc.getItem(
      page,
      "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(" +
        i +
        ") > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p"
    );
    result.push({
      child: i,
      price: parseFloat(price.replaceAll("$", "").replaceAll(",", "")),
    });
  }
  return result;
}

async function getChild(str, page) {
  const childrenToPrice = await getChildrenToPrice(page);
  var lowest = Number.MAX_SAFE_INTEGER;
  var highest = Number.MIN_SAFE_INTEGER;
  var lowestChild = 1;
  var highestChild = 1;

  for (var i = 0; i < childrenToPrice.length; i++) {
    const obj = childrenToPrice[i];
    if (obj["price"] < lowest) {
      lowest = obj["price"];
      lowestChild = obj["child"];
    }
    if (obj["price"] > highest) {
      highest = obj["price"];
      highestChild = obj["child"];
    }
  }
  if (str === "Low") {
    return lowestChild;
  } else {
    return highestChild;
  }
}

function validAge(str) {
  if (String(parseInt(str)) === "NaN" || parseInt(str[0]) > 2) {
    return true;
  }
  return false;
}

module.exports = { EWC };
