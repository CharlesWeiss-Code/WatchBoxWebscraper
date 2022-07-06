const fs = require("fs");
const { kill } = require("process");
const request = require("request");
const Watch = require("./DataStructures/Watch");
const AWS = require("aws-sdk");
const awsInfo = require("./aws-info");

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
  console.log(JSON.stringify(watch, null, "\t"));
};

addToTSV = (watch) => {
  let data = fs.readFileSync("dataInTSV.json");
  let parsed = JSON.parse(data);

  fs.writeFileSync("data.json", JSON.stringify(parsed, null, 3));
  console.log(JSON.stringify(watch, null, "\t"));
};

CSV = (w) => {
  s = "";
  for (var propt in w) {
    if (typeof propt != "function") {
      s += w[propt] + ",";
    }
  }
  return s;
  //console.log(s)
};

uploadFileToS3 = async () => {
  var date = new Date();
  var key = date.getFullYear() + "_";
  if (parseInt(date.getMonth()) + 1 < 10) {
    key += "0" + parseInt(date.getMonth() + 1) + "_";
  } else {
    key += date.getMonth() + 1 + "_";
  }
  if (parseInt(date.getDate()) < 10) {
    key += "0" + date.getDate();
  } else {
    key += date.getDate();
  }
  const s3 = new AWS.S3({
    accessKeyId: awsInfo.getKeyID(),
    secretAccessKey: awsInfo.getSecret(),
  });
  const content = fs.readFileSync("./dataInCSV.csv");
  const params = {
    Bucket: awsInfo.getBucketName(),
    Key: key + ".csv",
    Body: content,
    ContentType: "text/csv",
  };
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log(data);
    }
  });
};

checkNewDay = () => {
  const stats = fs.statSync("dataInCSV.csv");
  date = new Date();
  const indexNow = date.toLocaleString().indexOf(",");
  const indexData = stats.mtime.toLocaleString().indexOf(",");
  if (
    !(
      date.toLocaleString().substring(0, indexNow) ===
      stats.mtime.toLocaleString().substring(0, indexData)
    )
  ) {
    console.log("New day --> deleting old scrape and creating new one")
    await this.uploadFileToS3()
    fs.renameSync("dataInCSV.csv", "oldDataInCSV.csv");
    w = new Watch(
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      ""
    );
    s = "";
    for (var propt in w) {
      if (propt != "website") {
        s += propt + ",";
      } else {
        s += propt;
      }
    }
    fs.writeFileSync("dataInCSV.csv", s + "\n");
    if (fs.existsSync("oldDataInCSV.csv")) {
      fs.unlinkSync("oldDataInCSV.csv")
    }
  }
};

module.exports = {
  noResults,
  noResults2,
  downloadImage,
  getItem,
  exists,
  sameDate,
  addToJson,
  CSV,
  uploadFileToS3,
  checkNewDay,
};
