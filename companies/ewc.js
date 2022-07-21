const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
const { Puppeteer } = require("puppeteer");

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

async function EWC(lowP, highP, tPage) {
  for (var i = 59; i < refNums.length; i++) {
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
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });

    console.log("URL: " + newURL);
    console.log(
      i + 2 * refNums.length + "/" + refNums.length * 6,
      ((i + 2 * refNums.length) / (refNums.length * 6)) * 100 + "%"
    );
    await tPage.waitForTimeout(1000);

    if (await utilFunc.noResults(tPage, "body > section > h3")) {
      continue;
    } else {
      await lowP.goto(tPage.url());
      await highP.goto(tPage.url());
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
      console.log(highLink);
      await lowP
        .goto(lowLink, { waitUntil: "networkidle0", timeout: 60000 })
        .catch(async () => {
          await lowP.waitForTimeout(500);
          await lowP.reload();
          await lowP.waitForTimeout(500);
        });
      await highP
        .goto(highLink, { waitUntil: "networkidle0", timeout: 60000 })
        .catch(async () => {
          await lowP.waitForTimeout(500);
          await highP.reload();
          await highP.waitForTimeout(500);
        });

      await lowP.waitForTimeout(500);
      await highP.waitForTimeout(500);
      await BPandDateStuff(lowP, lowestChild, highP, highestChild);
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
    //console.log(w);

    fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");
    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
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
      price: price.replace("$", "").replace(",", ""),
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

async function BPandDateStuff(lowP, lowestChild, highP, highestChild) {
  lowPara = String(
    await utilFunc.getItem(
      lowP,
      "p[class='font-proxima mt-6 watch-bio-short-section']"
    )
  );
  highPara = String(
    await utilFunc.getItem(
      highP,
      "p[class='font-proxima mt-6 watch-bio-short-section']"
    )
  );


  lowSku = lowPara
    .substring(lowPara.indexOf("(") + 1, lowPara.indexOf(")"))
    .trim();
  highSku = highPara
    .substring(highPara.indexOf("(") + 1, highPara.indexOf(")"))
    .trim();

  console.log("'" + lowSku + "'" + highSku + "'");

  if (lowPara.indexOf("undated") === -1) {
    lowYearIndex1 = lowPara.indexOf("dated") + 5;
    if (lowYearIndex1 === 4) {
      lowYearIndex1 = lowPara.indexOf("from") + 4;
    }
    if (lowYearIndex1 != 3) {
      lowYear = lowPara.substring(lowYearIndex1).trim().match(/\d{4}/).join("");
    }
  }

  if (highPara.indexOf("undated") === -1) {
    highYearIndex1 = highPara.indexOf("dated") + 5;
    if (highYearIndex1 === 4) {
      highYearIndex1 = highPara.indexOf("from") + 4;
    }
    if (highYearIndex1 != 3) {
      highYear = highPara
        .substring(highYearIndex1)
        .trim()
        .match(/\d{4}/)
        .join("");
    }
  }

  console.log("'" + lowYear + "'" + highYear + "'");
  if (
    lowPara.toLowerCase().indexOf(brandLow.toLowerCase() + " box and papers")
  ) {
    lowBox = "Yes";
    lowPaper = "Yes";
  } else if (lowPara.toLowerCase().indexOf("original box and papers") != -1) {
    lowBox = "Yes";
    lowPaper = "Yes";
  } else if (lowPara.toLowerCase().indexOf("original certificate") != -1) {
    lowPaper = "Yes";
  } else if (
    lowPara.toLowerCase().indexOf(brandLow.toLowerCase() + " box") != -1
  ) {
    lowBox = "Yes";
  }

  if (
    highPara.toLowerCase().indexOf(brandHigh.toLowerCase() + " box and papers")
  ) {
    highBox = "Yes";
    highPaper = "Yes";
  } else if (highPara.toLowerCase().indexOf("original box and papers") != -1) {
    highBox = "Yes";
    highPaper = "Yes";
  } else if (highPara.toLowerCase().indexOf("original certificate") != -1) {
    highPaper = "Yes";
  } else if (
    highPara.toLowerCase().indexOf(brandHigh.toLowerCase() + " box") != -1
  ) {
    highBox = "Yes";
  }
}

function getPeriodIndex(str, datedIndex) {
  periods = [];
  for (var i = 0; i < str.length; i++) {
    if (str[i] === ".") {
      periods.push(i);
    }
  }
  for (var i = 0, j = i + 1; i < periods.length - 1; i++) {
    if (datedIndex > periods[i] && datedIndex < periods[j]) {
      return periods[j];
    } else if (j === periods.length - 1 && datedIndex > periods[j]) {
      console.log("aiwefiuahwefiluhaweliufhawhefiluauwiehfiuawhefihuaw");
      return str.indexOf("(");
    }
  }
}

module.exports = { EWC };
