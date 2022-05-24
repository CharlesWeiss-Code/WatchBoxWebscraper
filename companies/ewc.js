const utilFunc = require("../utilityFunctions.js");

async function EWC(lowP, highP, tPage) {
  for (var i = 2; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;

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
        lowest = 0;
        highest = 0;
        continue;
      } else {
        //EWC Is weird and needs its own function.
        lowest = await findPriceEWC(lowP, url, "asc");
        highest = await findPriceEWC(highP, url, "desc");
        await lowP.waitForTimeout(4000);

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
        console.log("Lowest: " + lowest);
        console.log("Highest: " + highest);
        console.log("URL: " + tPage.url());
      }
    }
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
