const utilFunc = require("../utilityFunctions.js");
const Watch = require("../DataStructures/Watch");
const fs = require("fs");
async function EWC(lowP, highP, tPage) {
  result = [];
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    brandLow = "";
    brandHigh = "";

    var newURL =
      "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    await tPage.waitForTimeout(1000);
    if (refNums[i] === "116500LN-0001" || refNums[i] === "116500LN-0002") {
      var url =
        "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + "116500LN";
      await tPage.goto(url, { waituntil: "networkidle0" });
      await lowP.goto(url, { waituntil: "networkidle0" });
      await highP.goto(url, { waituntil: "networkidle0" });

      if (await utilFunc.noResults(tPage, "body > section > h3")) {
        // no reults
        continue;
      } else {
        //EWC Is weird and needs its own function.
        lowest = await findPriceEWC(lowP, url, "asc");
        highest = await findPriceEWC(highP, url, "desc");

        brandLow = await utilFunc.getItem(
          lowP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );
        brandHigh = await utilFunc.getItem(
          highP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );
        brandLow = brandLow.substring(0, brandLow.indexOf(" "));
        brandHigh = brandHigh.substring(0, brandHigh.indexOf(" "));

        console.log("Lowest: " + lowest);
        console.log("Highest: " + highest);
        console.log("URL: " + tPage.url());
      }
    } else {
      if (await utilFunc.noResults(tPage, "body > section > h3")) {
        lowest = 0;
        highest = 0;
        continue;
      } else {
        //EWC Is weird and needs its own function.
        lowest = await findPriceEWC(lowP, newURL, "asc");
        highest = await findPriceEWC(highP, newURL, "desc");

        brandLow = await utilFunc.getItem(
          lowP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );
        brandHigh = await utilFunc.getItem(
          highP,
          "body > section > section.flex.flex-wrap.watch-list.mx-auto > section:nth-child(1) > div > div.flex.flex-col.h-full.justify-start.mt-2 > h3"
        );
        brandLow = brandLow.substring(0, brandLow.indexOf(" "));
        brandHigh = brandHigh.substring(0, brandHigh.indexOf(" "));
        console.log(brandLow, brandHigh);
      }
    }
    w = new Watch(
      refNums[i],
      "",
      "",
      "",
      "",
      "",
      "",
      String(lowest),
      String(highest),
      "",
      "",
      "",
      "",
      tPage.url(),
      "",
      "",
      brandLow,
      brandHigh
    );
    //console.log(w);
    result.push(w);
    fs.appendFileSync("./dataInCSV.csv", utilFunc.CSV(w) + "\n");

    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
  return result;
}

async function findPriceEWC(page, url, type) {
  await page.goto(url, { waituntil: "networkidle0", timeout: 60000 });
  prices = await page.$$eval(
    "body > section > section.flex.flex-wrap.watch-list.mx-auto > section > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p",
    (price) =>
      price.map((value) =>
        parseInt(String(value.textContent).replace("$", "").replace(",", ""))
      )
  );
  lowest = Math.min.apply(null, prices);
  highest = Math.max.apply(null, prices);
  if (type === "asc") {
    return lowest;
  } else {
    return highest;
  }
}

module.exports = { EWC };
