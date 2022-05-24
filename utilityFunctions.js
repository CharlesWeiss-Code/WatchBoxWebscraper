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

var downloadImage = function (uri, filename) {
  request.head(uri, function (err, res, body) {
    // console.log("content-type:", res.headers["content-type"]);
    // console.log("content-length:", res.headers["content-length"]);
    request(uri)
      .pipe(fs.createWriteStream(filename))
      .on("close", () => {
        console.log("downloaded image");
      });
  });
};

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
