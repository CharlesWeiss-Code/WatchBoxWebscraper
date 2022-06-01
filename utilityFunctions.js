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
print = (o, maxLevel, level) => {
  if (typeof level == "undefined") {
    level = 0;
  }
  if (typeof maxlevel == "undefined") {
    maxLevel = 0;
  }

  var str = "";
  // Remove this if you don't want the pre tag, but make sure to remove
  // the close pre tag on the bottom as well
  if (level == 0) {
    str = "<pre>"; // can also be <pre>
  }

  var levelStr = "<br>";
  for (var x = 0; x < level; x++) {
    levelStr += "    "; // all those spaces only work with <pre>
  }

  if (maxLevel != 0 && level >= maxLevel) {
    str += levelStr + "...<br>";
    return str;
  }

  for (var p in o) {
    switch (typeof o[p]) {
      case "string":
      case "number": // .tostring() gets automatically applied
      case "boolean": // ditto
        str += levelStr + p + ": " + o[p] + " <br>";
        break;

      case "object": // this is where we become recursive
      default:
        str +=
          levelStr +
          p +
          ": [ <br>" +
          print(o[p], maxLevel, level + 1) +
          levelStr +
          "]</br>";
        break;
    }
  }

  // Remove this if you don't want the pre tag, but make sure to remove
  // the open pre tag on the top as well
  if (level == 0) {
    str += "</pre>"; // also can be </pre>
  }
  return str;
};

module.exports = {
  noResults,
  noResults2,
  downloadImage,
  getItem,
  exists,
  sameDate,
  print,
};
