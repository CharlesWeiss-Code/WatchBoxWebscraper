const fs = require("fs");
const { kill } = require("process");
const request = require("request");
const Watch = require("./Watch");
const AWS = require("aws-sdk");
const awsInfo = require("./aws/aws-info");


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
  //   await page.waitForSelector(selector).then(async (res) => {
  //   return String(await page.evaluate(res => res.textContent))
  // })
  return String(
    await page
      .$eval(String(selector), (el) => el.textContent)
      .catch(() => {
        return "";
      })
  );
}

async function exists(page, selector) {
  if (
    selector ===
    "#searchspring-content > div.category-products.ng-scope > div > div:nth-child(1) > h3"
  ) {
    await page.reload();
  }
  var existsVar = false;
  if ((await page.$(selector)) != null) {
    existsVar = true;
  }
  console.log(existsVar);
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
  key = getKey();
  const s3 = new AWS.S3({
    accessKeyId: awsInfo.getKeyID(),
    secretAccessKey: awsInfo.getSecret(),
  });
  const content = fs.readFileSync("./data.csv");
  const params = {
    Bucket: awsInfo.getBucketName(),
    Key: key,
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

getKey = () => {
  var date = new Date();
  var key =
    date.getFullYear() +
    "_" +
    parseInt(date.getMonth() + 1) +
    "_" +
    date.getDate();
  console.log(key + ".csv");
  return key + ".csv";
};

deleteObj = async (key) => {
  date = new Date();
  const s3 = new AWS.S3({
    accessKeyId: awsInfo.getKeyID(),
    secretAccessKey: awsInfo.getSecret(),
  });
  var params = {
    Bucket: awsInfo.getBucketName(),
    //Key: yesterday(date),
    Key: key,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
};

yesterday = (date) => {
  d = new Date();
  d.setDate(date.getDate() - 1);
  return getKey(d);
};

checkNewDay = async () => {
  const stats = fs.statSync("data.csv");
  date = new Date();

  const indexNow = date.toLocaleString().indexOf(",");
  const indexData = stats.mtime.toLocaleString().indexOf(",");
  if (
    !(
      date.toLocaleString().substring(0, indexNow) ===
      stats.mtime.toLocaleString().substring(0, indexData)
    )
  ) {
    /**
     * last time editing file was over a day ago
     *
     */
    console.log("New day --> deleting old scrape and creating new one");
    await deleteObj();
    await uploadFileToS3();
    fs.renameSync("data.csv", "olddata.csv");
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
    fs.writeFileSync("data.csv", getText() + "\n");
    if (fs.existsSync("olddata.csv")) {
      fs.unlinkSync("olddata.csv");
    }
  } else {
    console.log("Same Day");
  }
};

getText = () => {
  var s = "";
  for (var propt in w) {
    if (propt != "website") {
      s += propt + ",";
    } else {
      s += propt;
    }
  }
  return s;
};

getName = async (_callback) => {
  result = null;
  const s3 = new AWS.S3({
    accessKeyId: awsInfo.getKeyID(),
    secretAccessKey: awsInfo.getSecret(),
  });
  var params = {
    Bucket: awsInfo.getBucketName(),
    MaxKeys: 1,
  };

  s3.listObjectsV2(params, (err, data) => {
    if (err) {
      throw err;
    } else {
      _callback(data.Contents[0].Key);
    }
  });
};

postAndDelete = async () => {
  getName(async (res) => {
    await deleteObj(res);
    await uploadFileToS3();
    fs.unlinkSync("./data.csv");
    createBlank();
  });
};

createBlank = () => {
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
    s += propt + ",";
  }
  fs.writeFileSync("data.csv", s + "\n");
};

timeToSendTEST = () => {
  var d = new Date();
  d.setSeconds(0);
  d.setMinutes(0);
  d.setHours(0);
  flag = false;
  firstToday = true;
  for (var i = 0; i < 1440; i++) {
    if (d.getHours() === 10 && firstToday) {
      flag = true;
      firstToday = false;
    }

    if (i % 20 === 0) {
      console.log(d.toLocaleTimeString());
    }

    if (d.getMinutes() === 0 && d.getHours() === 0) {
      firstToday = true;
    }

    if (flag) {
      console.log("SEND THE DOC NOW NOW NOW");
      flag = false;
      console.log(d.toLocaleTimeString());
      return true;
    } else {
      //return false
    }
    d.setMinutes(d.getMinutes() + 1);
  }
};

timeToSend = () => {
  var d = new Date();
  flag = false;
  firstToday = true;
  
  /**
   * If time = 12:00 AM firstToday = true
   */
    if (d.getHours() === 10 && firstToday) {
      flag = true;
      firstToday = false;
    }

    if (d.getMinutes() === 0 && d.getHours() === 0) {
      firstToday = true;
    }

    if (flag) {
      console.log("SEND THE DOC NOW NOW NOW");
      flag = false;
      console.log(d.toLocaleTimeString());
      return true;
    } else {
      //return false
    }
};

var specialSites = {
  LuxuryBazaar: function (refNum) {
    switch (refNum) {
      case "16570 BLK IX OYS":
        return "https://www.luxurybazaar.com/search-results?q=16570#/filter:lux_wa_dialcolor:Black";

      case "16570 WHT IX OYS":
        return "https://www.luxurybazaar.com/search-results?q=16570#/filter:lux_wa_dialcolor:White";

      case "116400GV-0001":
        return "https://www.luxurybazaar.com/search-results?q=116400GV#/filter:lux_wa_dialcolor:Black";

      case "5711/1A-010":
        return "https://www.luxurybazaar.com/search-results?q=5711#/filter:lux_wa_dialcolor:Blue";

      default:
        return "https://www.luxurybazaar.com/search-results?q=" + refNum;
    }
  },
  Bobs: function (refNum) {
    switch (refNum) {
      case "116500LN-0001":
        return "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=116500LN#/filter:custom_field_9:White";

      case "16570 BLK IX OYS":
        return "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=16570#/filter:custom_field_9:Black";

      case "16570 WHT IX OYS":
        return "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=16570#/filter:custom_field_9:White";

      case "116500LN-0002":
        return "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=116500LN#/filter:custom_field_9:Black";

      case "126710BLNR-0002":
        return "https://www.bobswatches.com/shop?query=126710BLNR#/filter:custom_field_7:Jubilee/filter:custom_field_9:Black";

      case "214270-0003":
        return "https://www.bobswatches.com/shop?query=214270#/filter:custom_field_9:Black";

      case "5711/1A-010":
        return "https://www.bobswatches.com/shop?query=5711#/filter:custom_field_9:Blue";

      default:
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          refNum
        );
    }
  },
  "C&C": function (refNum) {
    switch (refNum) {
      case "116500LN-0001":
        return "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:White";

      case "116500LN-0002":
        return "https://www.crownandcaliber.com/search?view=shop&q=116500LN#/filter:mfield_global_dial_color:Black";

      case "16570 BLK IX OYS":
        return "https://www.crownandcaliber.com/search?view=shop&q=16570#/filter:mfield_global_dial_color:Black";

      case "16570 WHT IX OYS":
        return "https://www.crownandcaliber.com/search?view=shop&q=16570#/filter:mfield_global_dial_color:White";

      case "126710BLNR-0002":
        return "https://www.crownandcaliber.com/search?view=shop&q=126710BLNR";

      case "126710BLRO-0001":
        return "https://www.crownandcaliber.com/search?view=shop&q=126710BLRO";

      case "116400GV-0001":
        return "https://www.crownandcaliber.com/search?view=shop&q=116400GV#/filter:mfield_global_dial_color:Black";

      case "5711/1A-010":
        return "https://www.crownandcaliber.com/search?view=shop&q=5711#/filter:mfield_global_dial_color:Blue";

      default:
        return "https://www.crownandcaliber.com/search?view=shop&q=" + refNum;
    }
  },
  C24: function (refNum) {
    switch (refNum) {
      case "16570 BLK IX OYS":
        return "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=702&dosearch=true&maxAgeInDays=0&pageSize=60&query=16570&redirectToSearchIndex=true&resultview=list";

      case "16570 WHT IX OYS":
        return "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=701&dosearch=true&maxAgeInDays=0&pageSize=60&query=16570&redirectToSearchIndex=true&resultview=list";

      default:
        return (
          "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
          refNum
        );
    }
  },
  DavidSW: function (refNum) {
    switch (refNum) {
      case "116500LN-0001":
        return "https://davidsw.com/?filter_dial-color=white&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "116500LN-0002":
        return "https://davidsw.com/?filter_dial-color=black&s=116500LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "16570 BLK IX OYS":
        return "https://davidsw.com/?filter_dial-color=black&s=16570&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "16570 WHT IX OYS":
        return "https://davidsw.com/?filter_dial-color=white&s=16570&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "126710BLNR-0002":
        return "https://davidsw.com/?s=126710BLNR&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "126710BLRO-0001":
        return "https://davidsw.com/?s=126710BLRO&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "116400GV-0001":
        return "https://davidsw.com/?filter_dial-color=black&s=116400GV&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "214270-0003":
        return "https://davidsw.com/?filter_dial-color=black&s=214270&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "5711/1A-010":
        return "https://davidsw.com/?filter_dial-color=blue&s=5711&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      default:
        return (
          "https://davidsw.com/?s=" +
          refNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
    }
  },
  EWC: function (refNum) {
    switch (refNum) {
      case "116500LN-0001" || "116500LN-0002":
        return "https://www2.europeanwatch.com/cgi-bin/search.pl?search=116500LN";

      case "16570 BLK IX OYS":
        return "https://www2.europeanwatch.com/cgi-bin/search.pl?search=16570";

      case "16570 WHT IX OYS":
        return "https://www2.europeanwatch.com/cgi-bin/search.pl?search=16570";

      case "126710BLRO-0001":
        return "https://www2.europeanwatch.com/cgi-bin/search.pl?search=126710BLRO";

      case "126710BLNR-0002":
        return "https://www2.europeanwatch.com/cgi-bin/search.pl?search=126710BLNR";

      default:
        return (
          "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNum
        );
    }
  },
};

getLink = (website, refNum) => specialSites[String(website)](String(refNum))

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
  deleteObj,
  getName,
  postAndDelete,
  timeToSend,
  getLink
};
