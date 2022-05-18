const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

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
  await bobs(lowPage, highPage, testPage);
  await browser.close();
}

async function bobs(lowP, highP, tPage) {
  for (var i = 0; i < refNums.length; i++) {
    lowest = -1;
    highest = -1;
    var newURL =
      "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
      refNums[i];
    console.log("URL: " + newURL);
    await tPage.goto(newURL, { waitUntil: "networkidle0", timeout: 0 });
    if (await noResultsBobs(tPage)) {
      lowest = 0;
      highest = 0;
    } else {
      console.log("lkjhashfahlskdf:" + newURL);
      lowest = await findLowestPriceBobs(lowP, newURL);
      highest = await findHighestPriceBobs(highP, newURL);
      console.log("Lowest: " + refNums[i] + "\t" + lowest);
      console.log("Highest: " + refNums[i] + "\t" + highest);
    }
  }
}

async function noResultsBobs(page) {
  var noResults = false;
  if (
    (await page.$(
      "#searchspring-content > div > div > div > div > div > div.no-results"
    )) != null
  ) {
    noResults = true;
  }
  if (noResults) {
    console.log("There were no results. moving to next ref number");
    return true;
  } else if (noResults === null) {
    return false;
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

      if (await noResultsCandC(tPage)) {
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
      if (noResultsCandC(tPage)) {
        lowest = 0;
        highest = 0;
      } else {
        await lowP.goto(
          "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black/sort:ss_price:asc",
          { waitUntil: "networkidle0" }
        );
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
      if (await noResultsCandC(tPage)) {
        lowest = 0;
        highest = 0;
      } else {
        console.log("\n");

        console.log(url);
        lowest = await findLowestPriceCandC(lowP, url);
        highest = await findHighestPriceCandC(highP, url);

        console.log("Lowest: " + refNums[i] + "\t" + lowest);
        console.log("Highest: " + refNums[i] + "\t" + highest);
      }
    }
  }
}

async function noResultsCandC(page) {
  var noResults = false;
  if ((await page.$("#searchspring-content > h3")) != null) {
    noResults = true;
  }
  if (noResults) {
    console.log("There were no results. moving to next ref number");
    return true;
  } else if (noResults === null) {
    return false;
  }
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
