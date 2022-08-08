const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer } = require("puppeteer");
const refN = require("../refNums");
const refNums = refN.getRefNums();

var lowest = "";
var highest = "";
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
var lowDealerStatus = "";
var highDealerStatus = "";

async function watchFinder(lowP, highP, tPage, startIndex) {
  for (var i = startIndex; i < refNums.length; i++) {
    try {
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

      console.log("\n\n");
      var URL = utilFunc.getLink("WatchFinder", refNums[i]);

      console.log(
        i + 5 * refNums.length + "/" + refNums.length * 7,
        ((i + 5 * refNums.length) / (refNums.length * 7)) * 100 + "%"
      );

      await tPage.goto(URL, { waitUntil: "networkidle0" }).catch(async () => {
        await utilFunc.reTry(tPage);
      });

      await tPage.waitForTimeout(500);

      if (await utilFunc.noResults(tPage, "#error_hero")) {
        // no results
        continue;
      } else {
        // results
        await lowP
          .goto(tPage.url() + "&orderby=PriceLowToHigh", {
            waitUntil: "networkidle0",
          })
          .catch(async () => {
            await utilFunc.reTry(lowP);
          });
        await highP
          .goto(tPage.url() + "&orderby=PriceHighToLow", {
            waitUntil: "networkidle0",
          })
          .catch(async () => {
            await utilFunc.reTry(highP);
          });

        await lowP.waitForTimeout(1000);
        await highP.waitForTimeout(1000);

        lowest = await utilFunc.getItem(lowP, "div[data-testid='watchPrice']");
        highest = await utilFunc.getItem(
          highP,
          "div[data-testid='watchPrice']"
        );

        lowBox = await utilFunc.getItem(
          lowP,
          "span[data-testid='watchBoxValue']"
        );
        highBox = await utilFunc.getItem(
          highP,
          "span[data-testid='watchBoxValue']"
        );

        lowPaper = await utilFunc.getItem(
          lowP,
          "span[data-testid='watchPapersValue']"
        );
        highPaper = await utilFunc.getItem(
          highP,
          "span[data-testid='watchPapersValue']"
        );

        yearLow = String(
          await lowP
            .$eval("span[data-testid='watchYearValue']", (res) => res.innerText)
            .catch(() => "")
        ).trim();

        yearHigh = String(
          await highP
            .$eval("span[data-testid='watchYearValue']", (res) => res.innerText)
            .catch(() => "")
        ).trim();

        if (yearLow.indexOf("Approx.") != -1) {
          yearLow = yearLow.replace("Approx.","")+"+".trim()
        }

        if (yearHigh.indexOf("Approx.") != -1) {
          yearHigh = yearHigh.replace("Approx.","")+"+".trim()
        }

        lowSku = String(
          await highP
            .$eval("a[data-testid='watchLink']", (res) => res.href)
            .catch(() => "")
        );
        lastLowSkuIndex = lowSku.lastIndexOf("/") + 1;
        lowSku = lowSku.substring(lastLowSkuIndex);

        highSku = String(
          await highP
            .$eval("a[data-testid='watchLink']", (res) => res.href)
            .catch(() => "")
        );
        lastHighSkuIndex = highSku.lastIndexOf("/") + 1;
        highSku = highSku.substring(lastHighSkuIndex);

        lowImage = await lowP
          .$eval(
            "div[class='relative msm:h-60']",
            (res) => res.children[0].children[0].src
          )
          .catch(() => "");
        highImage = await highP
          .$eval(
            "div[class='relative msm:h-60']",
            (res) => res.children[0].children[0].src
          )
          .catch(() => "");

        brandLow = await utilFunc.getItem(
          lowP,
          "div[data-testid='watchBrand']"
        );
        brandHigh = await utilFunc.getItem(
          highP,
          "div[data-testid='watchBrand']"
        );
        lowLink = lowP.url();
        highLink = highP.url();
        if (highest != "" || lowest != "") {
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
            lowLink,
            highLink,
            utilFunc.getLink("WatchFinder",refNums[i]),
            lowImage,
            highImage,
            brandLow,
            brandHigh,
            lowSku,
            highSku
          );
          fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
          console.log(JSON.stringify(w, null, "\t"));
        }
      }
    } catch (error) {
      console.log(error);
      console.log("Restarting at " + i + " ...");
      await watchFinder(lowP, highP, tPage, i);
      break;
    }
  }
}

module.exports = { watchFinder };
