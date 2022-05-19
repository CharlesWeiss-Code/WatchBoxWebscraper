const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const { get } = require("express/lib/response");
const { table } = require("console");

const csvWriter = createCsvWriter({
  path: "out.csv",
  header: [
    { id: "referenceNum", title: "Reference Number" },
    { id: "website", title: "Website" },
    { id: "age", title: "Age" },
    { id: "gender", title: "Gender" },
  ],
});

refNums = [
  "wefouwbefowebfowef",
  "311.30.42.30.01.005",
  "116500LN-0001",
  "116610LN",
  "126610LV",
  "116610LV",
  "124060",
  "16610",
  "126610LN",
];

/*
I HAVE MADE TIMEOUT: 0 ON SOME OF THE PAGE.GOTO(). just for testing. eventually should make timeout:60000 (1min)
*/
data = [refNums.length][1];

async function start() {
  const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
  ];

  const browser = await puppeteer.launch({
    headless: true,
    args: minimal_args,
  });
  const lowPage = await browser.newPage();
  const highPage = await browser.newPage();
  const testPage = await browser.newPage();
  const blocked_domains = ["googlesyndication.com", "adservice.google.com"];

  await lowPage.setRequestInterception(true);
  lowPage.on("request", (request) => {
    const url = request.url();
    if (blocked_domains.some((domain) => url.includes(domain))) {
      request.abort();
    } else {
      request.continue();
    }
  });

  await highPage.setRequestInterception(true);
  highPage.on("request", (request) => {
    const url = request.url();
    if (blocked_domains.some((domain) => url.includes(domain))) {
      request.abort();
    } else {
      request.continue();
    }
  });

  //await crownAndCaliber(lowPage, highPage, testPage);
  //await bobs(lowPage, highPage, testPage);
  //await davidsw(lowPage, highPage, testPage);
  //await bazaar(lowPage, highPage, testPage);
  //await EWC(lowPage, highPage, testPage);
  await chrono(lowPage, highPage, testPage);
  await browser.close();
}

async function chrono(lowP, highP, tPage) {
  flag = true;
  for (var i = 1; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    var newURL =
      "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    console.log("before");
    await tPage.waitForTimeout(5000);
    console.log("after");
    console.log("went to page");
    if (
      await noResults2(
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
      lowest = await getItem(
        lowP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      lowDealerStatus = await getItem(
        lowP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );
      await lowP.click("#wt-watches > div:nth-child(1) > a", { delay: 20 });
      await lowP.waitForTimeout(500);
      lowTable = String(
        await getItem(
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

      highest = await getItem(
        highP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-price-container > div.article-price > div > strong"
      );
      HighDealerStatus = await getItem(
        highP,
        "#wt-watches > div:nth-child(1) > a > div.p-x-2.p-b-2.m-t-auto > div.article-seller-container.media-flex.align-items-end.flex-grow > div.media-flex-body > div.article-seller-name.text-sm"
      );

      await highP.click("#wt-watches > div:nth-child(1) > a", { delay: 20 });

      await highP.waitForTimeout(500);

      highTable = String(
        await getItem(
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

      console.log("Highest: " + "\t" + highest.replace(/\s+/g, ""));
      console.log(
        "HighDealerStatus" + "\t" + HighDealerStatus.replace(/\s+/g, "")
      );
      console.log(
        "HighYear: " +
          "\t" +
          lowTable.substring(index1YearHigh, index2YearHigh).replace(/\s+/g, "")
      );
      console.log(
        "HighBoxAndPapers" +
          "\t" +
          lowTable.substring(index1BPHigh, index2BPHigh).replace(/\s+/g, "")
      );
    }
  }
}

async function EWC(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    x;
    var newURL =
      "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    console.log("before");
    await tPage.waitForTimeout(10000);
    console.log("after");
    console.log("went to page");
    if (await noResults(tPage, "body > section > h3")) {
      lowest = 0;
      highest = 0;
      continue;
    } else {
      lowest = await findPriceEWC(lowP, newURL, "asc");
      highest = await findPriceEWC(lowP, newURL, "desc");
      console.log("Lowest: " + lowest);
      console.log("Highest: " + highest + "\n");
    }
  }
}

async function findPriceEWC(page, url, type) {
  await page.goto(url, { waituntil: "networkidle0", timeout: 60000 });
  await page.waitForTimeout(5000);
  const prices = await page.$$eval(
    "body > section > section.flex.flex-wrap.watch-list.mx-auto > section > div > div.flex.flex-col.h-full.justify-start.mt-2 > div > p",
    (price) => price.map((price) => price.textContent)
  );

  lowest = prices[0];
  highest = prices[0];
  for (var i = 0; i < prices.length; i++) {
    switch (type) {
      case "asc":
        if (prices[i] < lowest) {
          lowest = prices[i];
        }
        break;
      case "desc":
        if (prices[i] > highest) {
          highest = prices[i];
        }
        break;
    }
  }
  if (type === "asc") {
    return lowest;
  } else {
    return highest;
  }
}

async function bazaar(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    //https://www.luxurybazaar.com/search-results?q=116500LN-0001
    var newURL = "https://www.luxurybazaar.com/search-results?q=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    console.log("before");
    await tPage.waitForTimeout(10000);
    console.log("after");
    console.log("went to page");
    if (await noResultsBazaar(tPage)) {
      lowest = 0;
      highest = 0;
      continue;
    } else {
      lowest = await findLowestPriceBazaar(lowP, newURL);
      highest = await findHighestPriceBazaar(highP, newURL);
      console.log("Lowest: " + lowest);
      console.log("Highest: " + highest + "\n");
    }
  }
}

async function findLowestPriceBazaar(page, url) {
  link = url + "#/sort:ss_sort_price_asc:asc";
  console.log("lowest price lnik: " + link);
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  await page.waitForTimeout(5000);
  console.log("lowest price at page");
  return await page.$eval(
    'span[class="price ng-binding"]',
    (price) => price.textContent
  );
}

async function findHighestPriceBazaar(page, url) {
  link = url + "#/sort:ss_sort_price_desc:desc";
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  await page.waitForTimeout(5000);

  console.log("lowest price at page");
  return await page.$eval(
    'span[class="price ng-binding"]',
    (price) => price.textContent
  );
}

async function noResultsBazaar(page) {
  var noResults = false;
  if (
    (await page.$(
      "#searchspring-content > div.category-products.ng-scope > div > div:nth-child(1) > h3"
    )) != null ||
    (await page.$(
      "#searchspring-content > div.category-products.ng-scope > div > ul > li > div.actions.actions-availability > p > a"
    )) != null
  ) {
    noResults = true;
  }
  if (noResults) {
    console.log("There were no results. moving to next ref number" + "\n");
    return true;
  } else if (noResults === null) {
    return false;
  }
}

async function noResults(page, selector) {
  var noResults = false;
  if ((await page.$(selector)) != null) {
    noResults = true;
  }
  if (noResults) {
    return true;
  } else if (noResults === null) {
    return false;
  }
}

async function noResults2(page, selector, s) {
  var noResults = false;
  if (
    String(await page.$eval(selector, (el) => el.textContent)).indexOf(s) != -1
  ) {
    noResults = true;
    console.log("no results");
  }
  return noResults;
}

async function davidsw(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    //https://davidsw.com/?s=124060&post_type=product&type_aws=true&aws_id=1&aws_filter=1
    var newURL =
      "https://davidsw.com/?s=" +
      refNums[i] +
      "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    console.log("went to page");
    if (await noResults(tPage, "#main > div > div.col.large-9 > div > p")) {
      lowest = 0;
      highest = 0;
      continue;
    } else {
      lowest = await findLowestPriceDavidsw(lowP, refNums[i]);
      highest = await findHighestPriceDavidsw(highP, refNums[i]);
      console.log("Lowest: " + lowest);
      console.log("Highest: " + highest + "\n");
    }
  }
}

async function findLowestPriceDavidsw(page, refNum) {
  link =
    "https://davidsw.com/?orderby=price&paged=1&s=" +
    refNum +
    "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  console.log("lowest price at page");
  return await page.$eval('span[class="price"]', (price) => price.textContent);
}

async function findHighestPriceDavidsw(page, refNum) {
  //https://davidsw.com/?orderby=price-desc&paged=1&s=124060&post_type=product&type_aws=true&aws_id=1&aws_filter=1
  link =
    "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
    refNum +
    "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
  await page.goto(link, { waituntil: "networkidle0", timeout: 60000 });
  return await page.$eval('span[class="price"]', (price) => price.textContent);
}

async function bobs(lowP, highP, tPage) {
  for (var i = 3; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 0 });
    if (
      await noResults(
        tPage,
        "#searchspring-content > div > div > div > div > div > div.no-results"
      )
    ) {
      lowest = 0;
      highest = 0;
    } else {
      lowest = await findLowestPriceBobs(lowP, newURL);
      highest = await findHighestPriceBobs(highP, newURL);
      lowP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );
      await lowP.waitForTimeout(5000);

      yearLow = await getItem(
        lowP,
        'span[itemprop="description"] > div > table > tbody:nth-child(2)'
      );

      /* CUSTOM SELECTOR NEEDED. NEED TO AVOID 'seocart_Product_#'.
      that number changes every time. Custom selsector avoids that problem
      */

      highP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );
      await highP.waitForTimeout(5000);

      ("#seocart_Product_395979 > div.watchdetail.newwatchdetail > div > div.watchdesc > div.descriptioncontainer > span > div:nth-child(1) > table > tbody:nth-child(2)");

      yearHigh = await getItem(
        highP,
        'span[itemprop="description"] > div > table > tbody:nth-child(2)'
      );

      console.log("Lowest:" + "\t" + lowest);
      //console.log("LowestYear:" + "\t" + yearLow);
      // console.log("LowestBoxAndPapers" + "\t" + boxAndPapersLow);

      console.log("Highest:" + "\t" + highest);
      //console.log("HighestYear:" + "\t" + yearHigh);
      // console.log("HighestBoxAndPaper:" + "\t" + boxAndPapersHigh);
    }
  }
}

async function findLowestPriceBobs(page, link) {
  newLink = link + "#/sort:price:asc";
  await page.goto(newLink, { waitUntil: "networkidle0", timeout: 0 });
  return await page.$eval(
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding",
    (price) => price.textContent
  );
}

async function findHighestPriceBobs(page, link) {
  newLink = link + "#/sort:price:desc";
  await page.goto(newLink, { waitUntil: "networkidle0", timeout: 0 });
  return await page.$eval(
    "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding",
    (price) => price.textContent
  );
}

async function crownAndCaliber(lowP, highP, tPage) {
  specification = [];
  for (var i = 0; i < refNums.length; i++) {
    var lowest = -1;
    var highest = -1;
    url =
      "https://www.crownandcaliber.com/search?view=shop&q=" +
      refNums[i] +
      "&oq=" +
      refNums[i] +
      "&queryAssumption=correction";
    console.log("CandC URL: ***  " + url);
    await tPage.goto(url, { waitUntil: "networkidle0" });

    if (refNums[i] == "116500LN-0001") {
      // special white daytona. https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:asc
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White",
        { waituntil: "networkidle0" }
      );

      if (await noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        await lowP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:asc",
          { waitUntil: "networkidle0" }
        );
        await highP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White/sort:ss_price:desc",
          { waitUntil: "networkidle0" }
        );
        lowest = await findLowestPrice2CandC(lowP);
        highest = await findHighestPrice2CandC(highP);

        console.log("Lowest: " + refNums[i] + "\t" + lowest);
        console.log("Highest: " + refNums[i] + "\t" + highest);
      }
    } else if (refNums[i] == "116500LN-0002") {
      //SPECIAL BLACK DAYTONA
      await tPage.goto(
        "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black",
        { waituntil: "networkidle0" }
      );
      if (await noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        await lowP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black/sort:ss_price:asc",
          { waitUntil: "networkidle0" }
        );
        await page.waitForTimeout(5000);

        await highP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black/sort:ss_price:desc",
          { waitUntil: "networkidle0" }
        );
        lowest = await findLowestPrice2CandC(lowP);

        highest = await findHighestPrice2CandC(highP);

        console.log("Lowest: " + refNums[i] + "\t" + lowest);
        console.log("Highest: " + refNums[i] + "\t" + highest);
      }
    } else {
      if (await noResults(tPage, "#searchspring-content > h3")) {
        lowest = 0;
        highest = 0;
      } else {
        console.log("\n");
        console.log(url);
        lowest = await findLowestPriceCandC(lowP, url);
        highest = await findHighestPriceCandC(highP, url);

        await lowP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );
        await lowP.waitForTimeout(5000);

        yearLow = await getItem(
          lowP,
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(13) > span.list-value"
        );
        boxLow = await getItem(
          lowP,
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(2) > span.list-value"
        );
        papersLow = await getItem(
          lowP,
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(3) > span.list-value"
        );

        await highP.click(
          "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a",
          { delay: 20 }
        );
        await highP.waitForTimeout(5000);

        yearHigh = await getItem(
          highP,
          // #shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(5) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(13) > span.list-value
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(13) > span.list-value"
        );
        boxHigh = await getItem(
          highP,
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(2) > span.list-value"
        );
        papersHigh = await getItem(
          highP,
          "#shopify-section-product-template > div > div.grid-x.grid-container.product-container > div.cell.large-6.large-offset-1.medium-12.small-12.product-right-block > div:nth-child(6) > div.specification-cell-left.cell.medium-12.small-12 > div > div:nth-child(3) > span.list-value"
        );

        console.log("Lowest:" + "\t" + lowest);
        console.log("LowestYear:" + "\t" + yearLow);
        console.log("LowestPaper" + "\t" + papersLow);
        console.log("LowestBox" + "\t" + boxLow);

        console.log("Highest:" + "\t" + highest);
        console.log("HighestYear:" + "\t" + yearHigh);
        console.log("HighestPaper:" + "\t" + papersHigh);
        console.log("HighestBox:" + "\t" + boxHigh);
      }
    }
  }
}
async function getItem(page, selector) {
  return String(await page.$eval(String(selector), (el) => el.textContent));
}

async function findLowestPriceCandC(page, link) {
  newUrl = link + "#/sort:ss_price:asc";
  await page.goto(newUrl, { waitUntil: "networkidle0" });

  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

async function findLowestPrice2CandC(page) {
  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

async function findHighestPrice2CandC(page) {
  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}
async function findHighestPriceCandC(page, link) {
  newUrl = link + "#/sort:ss_price:desc";
  console.log(newUrl);
  await page.goto(newUrl, { waitUntil: "networkidle0" });

  return await page.$eval(
    "#searchspring-content > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > a > span.current-price.product-price__price > span",
    (price) => price.textContent
  );
}

start();
