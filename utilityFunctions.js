const fs = require("fs");
const request = require("request");

async function noResults(page, selector) {
  var noResultsVar = false;
  if ((await page.$(selector)) != null) {
    noResultsVar = true;
  }
  return noResultsVar;
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

function downloadImage(uri, filename) {
  return new Promise((resolve, reject) => {
    request.head(uri, function (err, res, body) {
      request(uri).pipe(fs.createWriteStream(filename)).on("close", resolve);
    });
  });
}

async function getItem(page, selector) {
  return String(await page.$eval(String(selector), (el) => el.textContent));
}

async function exists(page, selector) {
  var existsVar = false;
  if ((await page.$(selector)) != null) {
    existsVar = true;
  }
  return existsVar;
}

module.exports = { noResults, noResults2, downloadImage, getItem, exists };
