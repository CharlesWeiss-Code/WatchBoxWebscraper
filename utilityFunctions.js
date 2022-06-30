const fs = require("fs");
const { kill } = require("process");
const request = require("request");
const Watch = require("./DataStructures/Watch");

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

function downloadImage(uri, fileName) {
  return new Promise((resolve, reject) => {
    request.head(uri, function (err, res, body) {
      request(uri)
        .pipe(fs.createWriteStream("./watchImages/" + fileName + ".png"))
        .on("close", resolve);
    });
  });
}

async function getItem(page, selector) {
  return String(
    await page
      .$eval(String(selector), (el) => el.textContent)
      .catch(() => {
        return "";
      })
  );
}

async function exists(page, selector) {
  var existsVar = false;
  if ((await page.$(selector)) != null) {
    existsVar = true;
  }
  return existsVar;
}
sameDate = (d1, d2) => {
  if (
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getFullYear() === d2.getFullYear()
  ) {
    return true;
  }
  return false;
};

addToJson = (watch) => {
  let data = fs.readFileSync("data.json");
  let parsed = JSON.parse(data);
  parsed[watch.getWebsite()][watch.getRefNum()].push(watch);
  fs.writeFileSync("data.json", JSON.stringify(parsed, null, 3));
  console.log(JSON.stringify(watch,null,'\t'))
};

addToTSV = (watch) => {
  let data = fs.readFileSync("dataInTSV.json");
  let parsed = JSON.parse(data);
  
  fs.writeFileSync("data.json", JSON.stringify(parsed, null, 3));
  console.log(JSON.stringify(watch,null,'\t'))
}

CSV = (w) => {
  s = ""
  for (var propt in w) {
    if (typeof propt != "function") {
      if (String(propt) != "website") {
      s+=w[propt]+","
      } else {
        s+=w[propt]
      }
    }
  }
  return s;
  //console.log(s)
}

module.exports = {
  noResults,
  noResults2,
  downloadImage,
  getItem,
  exists,
  sameDate,
  addToJson,
  CSV
};
