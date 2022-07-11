const utilFunc = require("../utilityFunctions.js");
const Watch = require("../Watch");
const fs = require("fs");
async function EWC(lowP, highP, tPage, list) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    brandLow = "";
    brandHigh = "";

    var newURL =
      "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNums[i];



    if (refNums[i] === "116500LN-0001" || refNums[i] === "116500LN-0002") {
       newURL =
        "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + "116500LN";
    }else if (refNums[i] === "16570 BLK IX OYS") {
      newURL = "https://www2.europeanwatch.com/cgi-bin/search.pl?search=16570"
    } else if (refNums[i] === "16570 WHT IX OYS") {
      newURL = "https://www2.europeanwatch.com/cgi-bin/search.pl?search=16570"
    } else if (refNums[i] === "126710BLRO-0001") {
      newURL = "https://www2.europeanwatch.com/cgi-bin/search.pl?search=126710BLRO"
    } else if (refNums[i] === "126710BLNR-0002") {
      newURL = "https://www2.europeanwatch.com/cgi-bin/search.pl?search=126710BLNR"
    }

    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });

    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);

    await tPage.waitForTimeout(1000);

    if (await utilFunc.noResults(tPage, "body > section > h3")) {
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
      brandHigh,
      "",
      ""
    );
    //console.log(w);
    list.push(w);
    fs.appendFileSync("./data.csv", utilFunc.CSV(w) + "\n");

    console.log(JSON.stringify(w, null, "\t"));
    //utilFunc.addToJson(w);
  }
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
