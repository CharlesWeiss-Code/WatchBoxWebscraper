/**
 * This file contains many functions that are commonly used, or just don't have any other logical home.
 */

const fs = require("fs");
const request = require("request");
const Watch = require("./Watch");
const AWS = require("aws-sdk");
const awsInfo = require("./aws/aws-info");
const { Puppeteer } = require("puppeteer");
const credentials = require("./twilioCredentials.js");
const { getRefNums } = require("./refNums");
const accountSid = credentials.getAccountSid();
const authToken = credentials.getAuthToken();
const trialNumber = credentials.getTrialNumber();

/**
 *
 * @param {Puppeteer.Page} page that you want to check the results for
 * @param {HTML Selector (String)} selector that identifies if there are no results
 * @returns {boolean} Boolean that represents if there were results or not
 */
async function noResults(page, selector) {
  var noResultsVar = false;
  if ((await page.$(selector)) != null) {
    noResultsVar = true;
  }
  return noResultsVar;
}

/**
 *
 * @param {Puppeteer.Page} page that you want to check the results for
 * @param {HTML Selector (String)} selector that identifies if there are no results
 * @param {String} str that should appear in the text content of the selector
 * @returns {boolean} Boolean that represents if there were results or not
 */
async function noResults2(page, selector, str) {
  var noResults = false;
  if (
    String(await page.$eval(selector, (el) => el.textContent)).indexOf(str) !=
    -1
  ) {
    noResults = true;
    console.log("no results");
  }
  return noResults;
}

/**
 *
 * @param {Puppeteer.Page} page that contains the selector you want to evaluate.
 * @param {HTML Selector (String)} selector that contains the text content you want
 * @returns {String} selector's text content
 */
async function getItem(page, selector) {
  return String(
    await page
      .$eval(String(selector), (el) => el.textContent)
      .catch((err) => {
        return "";
      })
  );
}

/**
 *
 * @param {Puppeteer.page} page that contains the selector you want to check the existence of
 * @param {HTML Selector (String)} selector that you want to check the existence of
 * @returns {boolean} selector's existence
 */
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

/**
 * @param {Date} d1
 * @param {Date} d2
 * @returns {boolean} wether the dates are the same or not
 */
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

/**
 * @param {Watch} watch that you want to convert to csv
 * @returns {String} str that contains watch in csv format.
 */
CSV = (watch) => {
  str = "";
  for (var propt in watch) {
    if (typeof propt != "function") {
      str += watch[propt] + ",";
    }
  }
  return str;
  //console.log(s)
};

/**
 * @returns {void}
 */
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

/**
 * @returns {String} key that the new csv will be upload to the S3 bucket with
 */
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

/**
 * @param {String} key to the csv that I want to delete in the s3 buckcet
 * @returns {void}
 */
deleteObj = async (key) => {
  date = new Date();
  const s3 = new AWS.S3({
    accessKeyId: awsInfo.getKeyID(),
    secretAccessKey: awsInfo.getSecret(),
  });
  var params = {
    Bucket: awsInfo.getBucketName(),
    Key: key,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data); // successful response
  });
};

/**
 * @param {function} _callback that you want to invoke once the name of the current csv in the S3 is returned
 * @returns {String} key to the object in the S3
 */
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

/**
 * @returns {void} deletes the old object in the S3, uploads the current object to the S3, archives the old S3 (locally), creates a blank "data.csv" file
 */
postAndDelete = async () => {
  getName(async (res) => {
    await deleteObj(res);
    await uploadFileToS3();
    fs.renameSync("./data.csv", "./archives/" + getKey());

    createBlank();
  });
};

/**
 * @returns {String} str that is the header of the new "data.csv" file
 */
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
  str = "";
  for (var propt in w) {
    str += propt + ",";
  }
  fs.writeFileSync("data.csv", str + "\n");
};

/**
 * @returns {boolean} whether the filled "data.csv" file should be sent or not. Returns true once per day.
 */
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

/**
 * @returns {boolean} whether the filled "data.csv" file should be sent or not. Returns true once per day.
 */
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
  LuxuryBazaar: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "16570 BLK IX OYS": // REGULAR --> SHORTENED --> BLACK DIAL
      case "216570-0002":
      case "116400GV-0001":
      case "16610 BLK OYS":
        console.log("REGULAR --> SHORTENED --> BLACK DIAL");
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Black"
        );

      case "16570 WHT IX OYS":
      case "216570-0001":
      case "116520-0016": // REGULAR --> SHORTENED --> WHITE DIAL
        console.log("REGULAR --> SHORTENED --> WHITE DIAL");
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:White"
        );

      case "5711/1A-010":
      case "116400GV-0002":
      case "16613 BLU IX OYS": // REGULAR --> SHORTENED --> BLUE DIAL
      case "126660-0002":
        console.log("REGULAR --> SHORTENED --> BLUE DIAL");

        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Blue"
        );

      case "116610LN-0001": // REGULAR --> SHORTENED
      case "126610LV-0002":
      case "126610LN-0001":
      case "116610LV-0002":
      case "124060-0001":
      case "114060-0002":
      case "116900-0001":
      case "116700LN-0001":
      case "116660-0001":
      case "126711CHNR-0002":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "126600-0001":
        console.log("REGULAR --> SHORTENED");

        return "https://www.luxurybazaar.com/search-results?q=" + newRefNum;

      case "116400GV-0001":
        return "https://www.luxurybazaar.com/search-results?q=116400GV#/filter:lux_wa_dialcolor:Black";
      default:
        console.log("REGULAR");

        return "https://www.luxurybazaar.com/search-results?q=" + refNum;
    }
  },
  Bobs: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "116500LN-0001": // REGULAR --> SHORTENED --> WHITE DIAL
      case "16570 WHT IX OYS":
      case "116520-0016":
      case "216570-0001":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:White"
        );

      case "16570 BLK IX OYS": // REGULAR --> SHORTENED --> BLACK DIAL
      case "216570-0002":
      case "116500LN-0002":
      case "126710BLNR-0002":
      case "214270-0003":
      case "126610LV-0002":
      case "16610 BLK OYS":
      case "116400GV-0001":
      case "126610LN-0001":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Black"
        );

      case "5711/1A-010": // REGULAR --> SHORTENED --> BLUE DIAL
      case "16613 BLU IX OYS":
      case "126660-0002":
      case "116400GV-0002":
      case "116610LV-0002":
        return (
          "https://www.bobswatches.com/shop?query=" +
          newRefNum +
          "#/filter:custom_field_9:Blue"
        );

      case "124060-0001": // REGULAR --> SHORTENED
      case "126600-0001":
      case "114060-0002":
      case "116900-0001":
      case "116660-0001":
      case "126711CHNR-0002":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "116700LN-0001":
        return "https://www.bobswatches.com/shop?query=" + newRefNum;

      default:
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          refNum
        );
    }
  },
  "C&C": function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "116500LN-0001":
      case "216570-0001":
      case "16570 WHT IX OYS":
      case "116520-0016": // REGULAR --> SHORTENED --> WHITE DIAL
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:White"
        );

      case "116500LN-0002":
      case "16570 BLK IX OYS":
      case "116400GV-0001":
      case "116610 BLK OYS": // REGULAR --> SHORTENED --> BLACK DIAL
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Black"
        );

      case "5711/1A-010":
      case "16613 BLU IX OYS":
      case "126660-0002":
      case "116400GV-0002": // REGULAR --> SHORTENED --> BLUE DIAL
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Blue"
        );

      case "124060-0001": // REGULAR --> SHORTENED
      case "116610LV-0002":
      case "126610LN-0001":
      case "126610LV-0002":
      case "116610LN-0001":
      case "126710BLRO-0001":
      case "126710BLNR-0002":
      case "114060-0002":
      case "116900-0001":
      case "116700LN-0001":
      case "116660-0001":
      case "126711CHNR-0002":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "12660-0001":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" + newRefNum
        );

      default:
        return "https://www.crownandcaliber.com/search?view=shop&q=" + refNum;
    }
  },
  C24: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "16570 BLK IX OYS":
        return "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=702&dosearch=true&maxAgeInDays=0&pageSize=60&query=16570&redirectToSearchIndex=true&resultview=list";

      case "16570 WHT IX OYS":
        return "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=701&dosearch=true&maxAgeInDays=0&pageSize=60&query=16570&redirectToSearchIndex=true&resultview=list";

      case "116610LN-0001":
        return "https://www.chrono24.com/search/index.htm?query=116610LN-0001&dialColor=702&dosearch=true&searchexplain=true&watchTypes=U&accessoryTypes=";

      default:
        return (
          "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
          refNum
        );
    }
  },
  DavidSW: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");

    switch (refNum) {
      case "116610LN-0001":
        return "https://davidsw.com/?s=116610LN&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "16610 BLK OYS":
        return "https://davidsw.com/?filter_bezel=aluminum&filter_dial-color=black&s=16610&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "116500LN-0001": // REGULAR --> SHORTENED --> WHITE DIAL
      case "16570 WHT IX OYS":
      case "116520-0016":
      case "216570-0001":
        return (
          "https://davidsw.com/?filter_dial-color=white&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "116500LN-0002": // REGULAR --> SHORTENED --> BLACK DIAL
      case "16570 BLK IX OYS":
      case "216570-0002":
      case "116400GV-0001":
      case "214270-0003":
        return (
          "https://davidsw.com/?filter_dial-color=black&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "5711/1A-010": // REGULAR --> SHORTENED --> BLUE DIAL
      case "126660-0002":
      case "16613 BLU IX OYS":
      case "116400GV-0002":
        return (
          "https://davidsw.com/?filter_dial-color=blue&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "126610LV-0002": // REGULAR --> SHORTENED --> BLACK DIAL && DATE
      case "126610LN-0001":
        return (
          "https://davidsw.com/?filter_dial-color=black&filter_complications=date&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "124060-0001": // REGULAR --> SHORTENED
      case "126710BLNR-0002":
      case "126710BLRO-0001":
      case "116610LV-0002":
      case "114060-0002":
      case "116900-0001":
      case "116700LN-0001":
      case "116660-0001":
      case "126711CHNR-0002":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "12660-0001":
        return (
          "https://davidsw.com/?s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      default:
        return (
          "https://davidsw.com/?s=" +
          refNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );
    }
  },
  EWC: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "126600-0001": // REGULAR --> SHORTENED
      case "16610 BLK OYS":
      case "124060-0001":
      case "116610LV-0002":
      case "126610LN-0001":
      case "126610LV-0002":
      case "126710BLNR-0002":
      case "126710BLRO-0001":
      case "16570 WHT IX OYS":
      case "16570 BLK IX OYS":
      case "116500LN-0002":
      case "114060-0002":
      case "116400GV-0001":
      case "116900-0001":
      case "116700LN-0001":
      case "216570-0001":
      case "216570-0002":
      case "16613 BLU IX OYS":
      case "116660-0001":
      case "126711CHNR-0002":
      case "116520-0016":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "126660-0002":
      case "116710BLNR-0002":
      case "116400GV-0002":
      case "116500LN-0001":
        return (
          "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" +
          newRefNum 
        );

      default:
        return (
          "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNum
        );
    }
  },
};

/**
 * @param {String} website that the special link belongs under
 * @param {String} refNum that the special link belongs to
 * @returns {String} that corresponds the correct link for that website and refNum
 */
getLink = (website, refNum) => {
  dashIndex = refNum.indexOf("-");
  spaceIndex = refNum.indexOf(" ");
  slashIndex = refNum.indexOf("/");
  list = [dashIndex, spaceIndex, slashIndex];
  mainIndex = Number.MAX_SAFE_INTEGER
  for (var i = 0; i < list.length; i++) {
    if (list[i] < mainIndex && list[i] != -1) {
      mainIndex = list[i]
    }
  }
  newRefNum = refNum.substring(0,mainIndex)
  return specialSites[String(website)](String(refNum), newRefNum);
};

function log(str) {
  console.log("'" + str + "'");
}
// function log(arr) {
//   s = "";
//   for (var i = 0; i < arr.length; i++) {
//     s+="'"+arr[i]
//   }
//   console.log(s + "'");
// }

function sendMessage() {
  const twilio = require("twilio");
  const client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: "Scrape Completed\n" + new Date().toLocaleString(),
      to: "2154210016",
      from: trialNumber,
    })
    .then(() => console.log("Scrape completed.  Sending message..."));
}

function getPricesForAverage() {
  fileData = fs.readFileSync("./data.csv").toString();
  fileData = fileData.substring(fileData.indexOf("\n") + 1);

  list = [];
  len = fileData.split("\n").length - 1;
  for (var k = 0; k < len; k++) {
    refNum = fileData.substring(0, fileData.indexOf(","));
    for (var i = 0; i < 5; i++) {
      fileData = fileData.substring(fileData.indexOf(",") + 1);
    }
    lowPrice = fileData.substring(0, fileData.indexOf(","));
    fileData = fileData.substring(fileData.indexOf(",") + 1);
    highPrice = fileData.substring(0, fileData.indexOf(","));
    fileData = fileData.substring(fileData.indexOf("\n") + 1);
    list.push({
      refNum: refNum,
      lowPrice: lowPrice,
      highPrice: highPrice,
    });
  }

  return list;
}

module.exports = {
  noResults,
  noResults2,
  getItem,
  exists,
  sameDate,
  CSV,
  uploadFileToS3,
  deleteObj,
  getName,
  postAndDelete,
  timeToSend,
  getLink,
  getKey,
  log,
  sendMessage,
  getPricesForAverage,
};
