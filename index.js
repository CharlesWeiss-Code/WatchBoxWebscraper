const { download } = require("express/lib/response");
const puppeteer = require("puppeteer");
const fs = require("fs");
const request = require("request");
const utilFunc = require("./utilityFunctions.js");
const CandC = require("./companies/CandC.js");

refNums = [
  "wefouwbefowebfowef",
  "311.30.42.30.01.005",
  "116500LN-0001",
  "116500LN-0002",
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
    defaultViewport: null,
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

  await CandC.crownAndCaliber(lowPage, highPage, testPage); // mostly done (daytona stuff)
  //await bobs(lowPage, highPage, testPage); // mostly done (filter table data)
  //await davidsw(lowPage, highPage, testPage); // mostly done (filter table data)
  //await bazaar(lowPage, highPage, testPage); // Done
  //await EWC(lowPage, highPage, testPage); //pretty much done
  //await chrono(lowPage, highPage, testPage); // done;
  //start();

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
          lowTable.substring(index1YearHigh, index2YearHigh).replace(/\s+/g, "")
      );
      console.log(
        "HighBoxAndPapers" +
          "\t" +
          lowTable.substring(index1BPHigh, index2BPHigh).replace(/\s+/g, "")
      );
      console.log("HIGH URL: " + highP.url());
    }
  }
}

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

async function bazaar(lowP, highP, tPage) {
  for (var i = 2; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    //https://www.luxurybazaar.com/search-results?q=116500LN-0001
    var newURL = "https://www.luxurybazaar.com/search-results?q=" + refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
    if (
      await utilFunc.exists(
        tPage,
        "#searchspring-content > div.category-products.ng-scope > div > div:nth-child(1) > h3"
      )
    ) {
      // this is the only one that can have its own function. there are two selectors
      lowest = 0;
      highest = 0;
      continue;
    } else {
      await lowP.goto(
        "https://www.luxurybazaar.com/search-results?q=" +
          refNums[i] +
          "#/sort:ss_sort_price_asc:asc",
        { waitUntil: "networkidle0" }
      );
      await highP.goto(
        "https://www.luxurybazaar.com/search-results?q=" +
          refNums[i] +
          "#/sort:ss_sort_price_desc:desc",
        { waitUntil: "networkidle0" }
      );
      if (await utilFunc.exists(lowP, 'span[class="price ng-binding"]')) {
        lowest = await utilFunc.getItem(lowP, 'span[class="price ng-binding"]');
      }
      if (await utilFunc.exists(highP, 'span[class="price ng-binding"]')) {
        highest = await utilFunc.getItem(
          lowP,
          'span[class="price ng-binding"]'
        );
      }
      await lowP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );
      await highP.click(
        "#searchspring-content > div.category-products.ng-scope > div > ul > li:nth-child(1) > a"
      );
      console.log("LOWPAGE URL: " + lowP.url());
      await lowP.waitForTimeout(1000);
      await highP.waitForTimeout(1000);

      lowTable = await getItem(lowP, 'div[class="attributes-table-container"]');
      lowYearIndex1 = lowTable.indexOf("Year of Manufacture") + 19;
      lowYearIndex2 = lowYearIndex1 + 5;

      lowBPIndex1 = lowTable.indexOf("Included") + 8;
      lowBPIndex2 = lowTable.indexOf("Lug Material");

      highTable = await utilFunc.getItem(
        highP,
        'div[class="attributes-table-container"]'
      );
      highYearIndex1 = highTable.indexOf("Year of Manufacture") + 19;
      highYearIndex2 = highYearIndex1 + 5;

      highBPIndex1 = highTable.indexOf("Included") + 8;
      highBPIndex2 = highTable.indexOf("Lug Material");
      console.log("Lowest: " + lowest);
      console.log(
        "Low year: " + lowTable.substring(lowYearIndex1, lowYearIndex2)
      );
      console.log(
        "Low BP: " + lowTable.substring(lowBPIndex1, lowBPIndex2) + "\n"
      );
      console.log("LOWEST URL: " + lowP.url());
      console.log("Highest: " + highest);
      console.log(
        "High year: " + highTable.substring(highYearIndex1, highYearIndex2)
      );
      console.log(
        "High BP: " + highTable.substring(highBPIndex1, highBPIndex2) + "\n"
      );
      console.log("HIGHEST URL: " + highP.url());
    }
  }
}

async function davidsw(lowP, highP, tPage) {
  for (var i = 3; i < refNums.length; i++) {
    console.log("");
    lowest = "-1";
    highest = "-1";
    lowTableBoxAndPaper = "";
    highTableBoxAndPaper = "";
    yearLow = "null";
    yearHigh = "null";
    var newURL =
      "https://davidsw.com/?s=" +
      refNums[i] +
      "&post_type=product&type_aws=true&aws_id=1&aws_filter=1";
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    lowest = -1;
    highest = -1;
    if (refNums[i] == "116500LN-0001") {
      // special white daytona
      await tPage.goto(
        "https://davidsw.com/?filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
        { waitUntil: "networkidle0", timeout: 60000 }
      );
      if (
        await utilFunc.noResults(
          tPage,
          "#main > div > div.col.large-9 > div > p"
        )
      ) {
        // no results
        continue;
      } else {
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.waitForTimeout(500);
        await lowP.waitForTimeout(500);
        //checkign to see if lowP is the list of watches or if it went straight to one watch.
        if (tPage.url().indexOf("&post_type") != -1) {
          lowest = await utilFunc.getItem(
            lowP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-401591.status-publish.first.instock.product_cat-rolex.product_cat-submariner.has-post-thumbnail.featured.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span"
          );
          highest = await utilFunc.getItem(
            highP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-401591.status-publish.first.instock.product_cat-rolex.product_cat-submariner.has-post-thumbnail.featured.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span"
          );
        } else {
          // there is one watch therefore lowest = highest
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          highest = lowest;
        }
      }
    } else if (refNums[i] == "116500LN-0002") {
      // special black daytona
      await tPage.goto(
        "https://davidsw.com/?filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1",
        { waitUntil: "networkidle0", timeout: 60000 }
      );

      if (
        await utilFunc.noResults(
          tPage,
          "#main > div > div.col.large-9 > div > p"
        )
      ) {
        // no results
        continue;
      } else {
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await lowP.waitForTimeout(500);
        await highP.waitForTimeout(500);
        if (tPage.url().indexOf("&post_type") != -1) {
          // checking to see if it shows multiple watches or went straight to one watch
          lowest = await utilFunc.getItem(
            lowP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-398817.status-publish.first.instock.product_cat-rolex.product_cat-cosmograph-daytona.has-post-thumbnail.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span > span > bdi"
          );
          highest = await utilFunc.getItem(
            highP,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box > div.product-small.col.has-hover.product.type-product.post-398817.status-publish.first.instock.product_cat-rolex.product_cat-cosmograph-daytona.has-post-thumbnail.sold-individually.taxable.shipping-taxable.purchasable.product-type-simple > div > div.product-small.box > div.box-text.box-text-products.text-center.grid-style-2 > div.price-wrapper > span > span > bdi"
          );
        } else {
          // only one watch therefore lowest = highest
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          highest = lowest;
        }
      }
    } else {
      await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 60000 });
      if (
        await utilFunc.exists(tPage, "#main > div > div.col.large-9 > div > p")
      ) {
        // no results
        continue;
      } else {
        await lowP.goto(
          "https://davidsw.com/?orderby=price&paged=1&s=" +
            refNums[i] +
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        await highP.goto(
          "https://davidsw.com/?orderby=price-desc&paged=1&s=" +
            refNums[i] +
            "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
        if (
          await utilFunc.exists(
            tPage,
            "#main > div > div.col.large-9 > div > div.products.row.row-small.large-columns-3.medium-columns-3.small-columns-2.has-equal-box-heights.equalize-box"
          )
        ) {
          // checking to see if it shows multiple watches or went straight to one watch
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );
          highest = await utilFunc.getItem(
            highP,
            'span[class="woocommerce-Price-amount amount"]'
          );
          await lowP.click('div[class="title-wrapper"]', { delay: 20 });
          await highP.click('div[class="title-wrapper"]', { delay: 20 });

          lowTableBoxAndPaper = await lowP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          lowTableGeneral = await lowP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          indexLow = lowTableGeneral.indexOf("Year");
          if (indexLow != -1) {
            yearLow = lowTableGeneral.substring(indexLow + 4);
          }
          highTableBoxAndPaper = await highP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          highTableGeneral = await highP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          indexHigh = highTableGeneral.indexOf("Year");
          if (indexHigh != -1) {
            yearHigh = highTableGeneral.substring(indexHigh + 4);
          }
        } else {
          console.log(tPage.url());
          // only one watch therefore highData = lowData
          // already on the specific watch page. no need to click anything
          lowest = await utilFunc.getItem(
            lowP,
            'span[class="woocommerce-Price-amount amount"]'
          );

          lowTableBoxAndPaper = await lowP.$$eval(
            "tbody",
            (options) => options[6].textContent
          );

          lowTableGeneral = await lowP.$$eval(
            "tbody",
            (options) => options[0].textContent
          );
          //console.log("lowTableGeneral: " + lowTableGeneral);
          indexLow = lowTableGeneral.indexOf("Year");
          if (indexLow != -1) {
            yearLow = lowTableGeneral.substring(indexLow + 4);
          }

          highest = lowest;
          yearHigh = yearLow;
          highTableBoxAndPaper = lowTableBoxAndPaper;
        }
      }
    }
    console.log("Lowest: " + lowest);
    console.log("Low Year: " + yearLow);
    console.log("Low Box and Paper: " + lowTableBoxAndPaper);
    console.log("lOWEST URL: " + lowP.url());
    console.log("Highest: " + highest + "\n");
    console.log("High Year: " + yearHigh);
    console.log("High Box and Paper: " + highTableBoxAndPaper);
    console.log("HIGHEST URL: " + highP.url());
  }
}

async function bobs(lowP, highP, tPage) {
  for (var i = 8; i < refNums.length; i++) {
    console.log("");
    lowest = -1;
    highest = -1;
    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("REF: " + refNums[i] + "\n" + "URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 0 });
    if (
      await utilFunc.noResults(
        tPage,
        "#searchspring-content > div > div > div > div > div > div.no-results"
      )
    ) {
      lowest = 0;
      highest = 0;
    } else {
      lowest = await findLowestPriceBobs(lowP, newURL);
      highest = await findHighestPriceBobs(highP, newURL);
      await lowP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );
      await lowP.waitForTimeout(2000);

      lowTable = await lowP.$$eval(
        "tbody",
        (options) => options[1].textContent
      );

      index1YearLow = -1;
      if (lowTable.indexOf("Serial/Year:") != -1) {
        index1YearLow = lowTable.indexOf("Serial/Year:") + 12;
      } else {
        index1YearLow = lowTable.indexOf("Serial") + 6;
      }
      index2YearLow = lowTable.indexOf("Gender:");
      index1BPLow = lowTable.indexOf("Box & Papers") + 13;
      index2BPLow = lowTable.indexOf("Warranty");

      await highP.click(
        "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a",
        { delay: 20 }
      );
      await highP.waitForTimeout(2000);

      highTable = await highP.$$eval(
        "tbody",
        (options) => options[1].textContent
      );

      index1YearHigh = -1;
      if (highTable.indexOf("Serial/Year:") != -1) {
        index1YearHigh = highTable.indexOf("Serial/Year:") + 12;
      } else {
        index1YearHigh = highTable.indexOf("Serial") + 6;
      }
      index2YearHigh = highTable.indexOf("Gender:");
      index1BPHigh = highTable.indexOf("Box & Papers") + 13;

      index2BPHigh = highTable.indexOf("Warranty");
      [lowYear] = lowTable
        .substring(index1YearLow, index2YearLow)
        .match(/(\d+)/);

      [highYear] = highTable
        .substring(index1YearLow, index2YearLow)
        .match(/(\d+)/);

      console.log("Lowest: " + "\t" + lowest.replace(/\s+/g, ""));
      console.log("LowYear: " + "\t" + lowYear);
      console.log(
        "lowBoxAndPapers" + "\t" + lowTable.substring(index1BPLow, index2BPLow)
      );
      console.log("LOWEST URL: " + lowP.url());

      console.log("Highest: " + "\t" + highest.replace(/\s+/g, ""));
      console.log("HighYear: " + "\t" + highYear);
      console.log(
        "HighBoxAndPapers: " +
          "\t" +
          highTable.substring(index1BPHigh, index2BPHigh)
      );
      console.log("HIGHEST URL: " + highP.url());
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

async function findLowestPriceBobs(page, link) {
  newLink = link + "#/sort:price:asc";
  await page.goto(newLink, { waitUntil: "networkidle0", timeout: 0 });
  return await page
    .$eval(
      "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding",
      (price) => price.textContent
    )
    .catch(async () => {
      await page.reload({ waitUntil: "networkidle0" });
      findHighestPriceBobs(page, link);
    });
}

async function findHighestPriceBobs(page, link) {
  newLink = link + "#/sort:price:desc";
  await page.goto(newLink, { waitUntil: "networkidle0", timeout: 0 });
  return await page
    .$eval(
      "#searchspring-content > div > div.ss-results.ss-targeted.ng-scope > div > div:nth-child(1) > div > form > a > ul > li.buyprice.buyit.ng-scope > span.ng-binding",
      (price) => price.textContent
    )
    .catch(async () => {
      await page.reload({ waitUntil: "networkidle0" });
      findHighestPriceBobs(page, link);
    });
}

start();
