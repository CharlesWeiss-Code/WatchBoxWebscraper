/**
 * This file contains many functions that are commonly used, or just don't have any other logical home.
 */

const fs = require("fs");
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
  if (
    (await page.$(selector).catch(async () => {
      await page.waitForTimeout(1000);
      return await page.$(selector);
    })) != null
  ) {
    return true;
  }
  return false;
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
      .catch(() => {
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
  return await page.$eval(selector, () => true).catch(() => false);
}

/**
 * @param {Date} d1
 * @param {Date} d2
 * @returns {boolean} wether the dates are the same or not
 */
function sameDate(d1, d2) {
  if (
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate() &&
    d1.getFullYear() === d2.getFullYear()
  ) {
    return true;
  }
  return false;
}

/**
 * @param {Watch} watch that you want to convert to csv
 * @returns {String} str that contains watch in csv format.
 */
function CSV(watch) {
  str = "";
  for (var propt in watch) {
    if (typeof propt != "function") {
      str += watch[propt] + ",";
    }
  }
  return str;
  //console.log(s)
}

/**
 * @returns {void}
 */
async function uploadFileToS3() {
  var date = new Date();
  key = date.getFullYear() + "_";
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
  const content = fs.readFileSync("./data.csv");
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
}

/**
 * @returns {String} key that the new csv will be upload to the S3 bucket with
 */
function getKey() {
  var date = new Date();
  key = date.getFullYear() + "_";
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
  return key + ".csv";
}

/**
 * @param {String} key to the csv that I want to delete in the s3 buckcet
 * @returns {void}
 */
async function deleteObj(key) {
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
}

/**
 * @param {function} _callback that you want to invoke once the name of the current csv in the S3 is returned
 * @returns {String} key to the object in the S3
 */
async function getName(_callback) {
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
}

/**
 * @returns {void} deletes the old object in the S3, uploads the current object to the S3, archives the old S3 (locally), creates a blank "data.csv" file
 */
async function postAndDelete() {
  getName(async (res) => {
    await deleteObj(res);
    await uploadFileToS3();
  });
}

/**
 * @returns {String} str that is the header of the new "data.csv" file
 */
function createBlank() {
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
}

/**
 * @returns {boolean} whether the filled "data.csv" file should be sent or not. Returns true once per day.
 */
function timeToSendTEST() {
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
}

/**
 * @returns {boolean} whether the filled "data.csv" file should be sent or not. Returns true once per day.
 */
function timeToSend(currentTime) {
  flag = false;
  firstToday = true;

  /**
   * If time = 12:00 AM firstToday = true
   */
  if (currentTime.getHours() === 10 && firstToday) {
    flag = true;
    firstToday = false;
  }

  if (currentTime.getMinutes() === 0 && currentTime.getHours() === 0) {
    firstToday = true;
  }

  if (flag) {
    console.log("SEND THE DOC NOW NOW NOW");
    flag = false;
    console.log(d.toLocaleTimeString());
    return true;
  } else {
    return false;
  }
}

var specialSites = {
  LuxuryBazaar: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "116622-0003": // REGULAR --> SHORTENED --> GREY DIAL
      case "126333-0020":
      case "116333-0001":
      case "126234-0045":
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Grey"
        );

      case "124300-0001": // REGULAR --> SHORTENED --> SILVER DIAL
      case "116519LN-0024":
      case "116200-0056":
      case "116234-0081":
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Silver"
        );

      case "124300-0006": // REGULAR --> SHORTENED --> TURQUOISE DIAL
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Turquoise"
        );

      case "16233 CHP IX JUB": // REGULAR --> SHORTENED --> CHAMPAGNE DIAL
      case "326933-0001":
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Champagne"
        );

      case "124300-0005": // REGULAR --> SHORTENED --> GREEN DIAL
      case "116508-0013":
      case "126000-0005":
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Green"
        );

      case "16570 BLK IX OYS": // REGULAR --> SHORTENED --> BLACK DIAL
      case "216570-0002":
      case "116400-0001":
      case "116300-0001":
      case "116200-0059":
      case "116719BLRO-0001":
      case "126300-0012":
      case "124300-0002":
      case "116400GV-0001":
      case "16610 BLK OYS":
      case "116400GV-0001":
      case "116520-0015":
      case "126660-0001":
      case "226659-0002":
      case "226570-0002":
      case "1675 BLK PEP OYS":
      case "16610LV":
        console.log("REGULAR --> SHORTENED --> BLACK DIAL");
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:Black"
        );

      case "16570 WHT IX OYS":
      case "216570-0001":
      case "116520-0016": // REGULAR --> SHORTENED --> WHITE DIAL
      case "226570-0001":
      case "116400-0002":
        console.log("REGULAR --> SHORTENED --> WHITE DIAL");
        return (
          "https://www.luxurybazaar.com/search-results?q=" +
          newRefNum +
          "#/filter:lux_wa_dialcolor:White"
        );

      case "5711/1A-010":
      case "116400GV-0002":
      case "326934-0003":
      case "16613 BLU IX OYS": // REGULAR --> SHORTENED --> BLUE DIAL
      case "126660-0002":
      case "116622-0001":
      case "126622-0002":
      case "326934-0004":
      case "116506-0001":
      case "116660-0003":
      case "126300-0001":
      case "116509-0071":
      case "116619LB-0001":
      case "126334-0002":
      case "124300-0003":
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
      case "116600-0003":
      case "116900-0001":
      case "116700LN-0001":
      case "116660-0001":
      case "126711CHNR-0002":
      case "126710BLRO-0002":
      case "214270-0001":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "126613LN-0002":
      case "116710BLNR-0002":
      case "116680-0001":
      case "126600-0001":
      case "126613LB-0002":
      case "126710BLNR-0003":
      case "16710 COKE OYS":
      case "116613LN-0001":
      case "124273-0001":
      case "126603-0001":
      case "16600 BLK IX OYS":
      case "126715CHNR-0001":
      case "116681-0001":
      case "116680-0002":
        console.log("REGULAR --> SHORTENED");
        return "https://www.luxurybazaar.com/search-results?q=" + newRefNum;

      default:
        console.log("REGULAR");
        url = "https://www.luxurybazaar.com/search-results?q=" + refNum;
        return url;
    }
  },
  Bobs: function (refNum, newRefNum) {
    console.log("'" + refNum + "'\t'" + newRefNum + "'");
    switch (refNum) {
      case "116622-0003": // REGULAR --> SHORTENED --> GREY DIAL
      case "126333-0020":
      case "126234-0045":
      case "116333-0001":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Grey"
        );

      case "124300-0001": // REGULAR --> SHORTENED --> SILVER DIAL
      case "116519LN-0024":
      case "116200-0056":
      case "116234-0081":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Silver"
        );

      case "124300-0006": // REGULAR --> SHORTENED --> TURQUOISE DIAL
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Turquoise"
        );

      case "124300-0005": // REGULAR --> SHORTENED --> GREEN DIAL
      case "116508-0013":
      case "126000-0005":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Green"
        );

      case "16233 CHP IX JUB": // REGULAR --> SHORTENED --> CHAMPAGNE DIAL
      case "326933-0001":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Champagne"
        );

      case "116500LN-0001": // REGULAR --> SHORTENED --> WHITE DIAL
      case "16570 WHT IX OYS":
      case "116400-0002":
      case "116520-0016":
      case "226570-0001":
      case "216570-0001":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:White"
        );

      case "16570 BLK IX OYS": // REGULAR --> SHORTENED --> BLACK DIAL
      case "216570-0002":
      case "116500LN-0002":
      case "116300-0001":
      case "126300-0012":
      case "116400-0001":
      case "126710BLNR-0002":
      case "116200-0059":
      case "116719BLRO-0001":
      case "126710BLNR-0003":
      case "214270-0003":
      case "124300-0002":
      case "126610LV-0002":
      case "16610 BLK OYS":
      case "116400GV-0001":
      case "126610LN-0001":
      case "116520-0015":
      case "126660-0001":
      case "226570-0002":
      case "226659-0002":
      case "16610LV":
      case "1675 BLK PEP OYS":
        return (
          "https://www.bobswatches.com/shop?submit.x=0&submit.y=0&query=" +
          newRefNum +
          "#/filter:custom_field_9:Black"
        );

      case "5711/1A-010": // REGULAR --> SHORTENED --> BLUE DIAL
      case "16613 BLU IX OYS":
      case "116506-0001":
      case "116622-0001":
      case "126660-0002":
      case "326934-0004":
      case "116400GV-0002":
      case "126622-0002":
      case "116660-0003":
      case "326934-0003":
      case "116509-0071":
      case "116610LV-0002":
      case "126300-0001":
      case "124300-0003":
      case "126334-0002":
      case "116619LB-0001":
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
      case "126613LN-0002":
      case "116600-0003":
      case "126711CHNR-0002":
      case "114270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116613LN-0001":
      case "126710BLRO-0002":
      case "116710BLNR-0002":
      case "116700LN-0001":
      case "116680-0001":
      case "126613LB-0002":
      case "126603-0001":
      case "214270-0001":
      case "124273-0001":
      case "126715CHNR-0001":
      case "16710 COKE OYS":
      case "16600 BLK IX OYS":
      case "116681-0001":
      case "116680-0002":
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
      case "116622-0003": // REGULAR --> SHORTENED --> GREY DIAL
      case "126333-0020":
      case "126234-0045":
      case "116333-0001":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Grey"
        );

      case "124300-0001": // REGULAR --> SHORTENED --> SILVER DIAL
      case "116519LN-0024":
      case "116234-0081":
      case "116200-0056":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Silver"
        );

      case "124300-0006": // REGULAR --> SHORTENED --> TURQUOISE DIAL
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Turquoise"
        );

      case "124300-0005": // REGULAR --> SHORTENED --> GREEN DIAL
      case "116508-0013":
      case "126000-0005":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Green"
        );

      case "16233 CHP IX JUB": // REGULAR --> SHORTENED --> CHAMPAGNE DIAL
      case "326933-0001":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Champagne"
        );

      case "116500LN-0001":
      case "216570-0001":
      case "16570 WHT IX OYS":
      case "116520-0016": // REGULAR --> SHORTENED --> WHITE DIAL
      case "226570-0001":
      case "116400-0002":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:White"
        );

      case "116500LN-0002":
      case "16570 BLK IX OYS":
      case "116400GV-0001":
      case "226659-0002": // REGULAR --> SHORTENED --> BLACK DIAL
      case "116520-0015":
      case "116400-0001":
      case "124300-0002":
      case "116200-0059":
      case "116719BLRO-0001":
      case "16610LV":
      case "116300-0001":
      case "126660-0001":
      case "126300-0012":
      case "226570-0002":
      case "116610 BLK OYS":
      case "1675 BLK PEP OYS":
        return (
          "https://www.crownandcaliber.com/search?view=shop&q=" +
          newRefNum +
          "#/filter:mfield_global_dial_color:Black"
        );

      case "5711/1A-010":
      case "16613 BLU IX OYS":
      case "126660-0002":
      case "326934-0003": // REGULAR --> SHORTENED --> BLUE DIAL
      case "126300-0001":
      case "116506-0001":
      case "126622-0002":
      case "326934-0004":
      case "116622-0001":
      case "116660-0003":
      case "116509-0071":
      case "124300-0003":
      case "116619LB-0001":
      case "126334-0002":
      case "116400GV-0002":
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
      case "214270-0001":
      case "126710BLRO-0001":
      case "126710BLRO-0002":
      case "126710BLNR-0002":
      case "126710BLNR-0003":
      case "114060-0002":
      case "116900-0001":
      case "116700LN-0001":
      case "116613LN-0001":
      case "126613LN-0002":
      case "116660-0001":
      case "126711CHNR-0002":
      case "114270-0001":
      case "124273-0001":
      case "116600-0003":
      case "126715CHNR-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "12660-0001":
      case "126613LB-0002":
      case "126603-0001":
      case "116680-0001":
      case "16710 COKE OYS":
      case "16600 BLK IX OYS":
      case "116681-0001":
      case "116680-0002":
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
      case "16570 BLK IX OYS": // REGULAR --> SHORTENED --> BLACK DIAL
        return (
          "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=702&dosearch=true&maxAgeInDays=0&pageSize=60&query=" +
          newRefNum +
          "&redirectToSearchIndex=true&resultview=grid"
        );

      case "16570 WHT IX OYS": // REGULAR --> SHORTENED --> WHITE DIAL
        return (
          "https://www.chrono24.com/search/index.htm?currencyId=USD&dialColor=701&dosearch=true&maxAgeInDays=0&pageSize=60&query=" +
          newRefNum +
          "&redirectToSearchIndex=true&resultview=grid"
        );

      case "116610LN-0001":
        return "https://www.chrono24.com/search/index.htm?query=116610LN-0001&dialColor=702&dosearch=true&searchexplain=true&watchTypes=U&accessoryTypes=";

      case "1675 BLK PEP OYS": // REGULAR --> SHORTENED
        return (
          "https://www.chrono24.com/search/index.htm?accessoryTypes=&dosearch=true&query=" +
          newRefNum
        );
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
      case "16610 BLK OYS":
        return "https://davidsw.com/?filter_bezel=aluminum&filter_dial-color=black&s=16610&post_type=product&type_aws=true&aws_id=1&aws_filter=1";

      case "116622-0003": // REGULAR --> SHORTENED --> GREY DIAL
      case "126333-0020":
      case "126234-0045":
      case "116333-0001":
        return (
          "https://davidsw.com/?filter_dial-color=Grey&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "124300-0006": // REGULAR --> SHORTENED --> TURQUOISE DIAL
        return (
          "https://davidsw.com/?filter_dial-color=Turquoise&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "124300-0005": // REGULAR --> SHORTENED --> GREEN DIAL
      case "116508-0013":
      case "126000-0005":
        return (
          "https://davidsw.com/?filter_dial-color=Green&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "116500LN-0001": // REGULAR --> SHORTENED --> WHITE DIAL
      case "16570 WHT IX OYS":
      case "226570-0001":
      case "116520-0016":
      case "116400-0002":
      case "216570-0001":
        return (
          "https://davidsw.com/?filter_dial-color=white&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "116500LN-0002": // REGULAR --> SHORTENED --> BLACK DIAL
      case "16570 BLK IX OYS":
      case "216570-0002":
      case "116400-0001":
      case "116400GV-0001":
      case "214270-0003":
      case "116200-0059":
      case "226659-0002":
      case "116520-0015":
      case "126300-0012":
      case "124300-0002":
      case "116719BLRO-0001":
      case "126660-0001":
      case "226570-0002":
      case "16610LV":
      case "1675 BLK PEP OYS":
      case "116300-0001":
        return (
          "https://davidsw.com/?filter_dial-color=black&s=" +
          newRefNum +
          "&post_type=product&type_aws=true&aws_id=1&aws_filter=1"
        );

      case "5711/1A-010": // REGULAR --> SHORTENED --> BLUE DIAL
      case "126660-0002":
      case "116509-0071":
      case "116506-0001":
      case "16613 BLU IX OYS":
      case "326934-0004":
      case "116660-0003":
      case "116400GV-0002":
      case "126300-0001":
      case "326934-0003":
      case "116622-0001":
      case "126334-0002":
      case "116619LB-0001":
      case "124300-0003":
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
      case "116600-0003":
      case "126711CHNR-0002":
      case "124273-0001":
      case "114270-0001":
      case "116680-0001":
      case "214270-0001":
      case "16622 PT IX OYS":
      case "124270-0001":
      case "116710BLNR-0002":
      case "126613LN-0002":
      case "126710BLNR-0003":
      case "126710BLRO-0002":
      case "116613LN-0001":
      case "12660-0001":
      case "116610LN-0001":
      case "126613LB-0002":
      case "126622-0002":
      case "126715CHNR-0001":
      case "16233 CHP IX JUB":
      case "126603-0001":
      case "16710 COKE OYS":
      case "16600 BLK IX OYS":
      case "116681-0001":
      case "116680-0002":
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
      case "126334-0002":
      case "126660-0002":
      case "116710BLNR-0002":
      case "116400GV-0002":
      case "326934-0003":
      case "116613LN-0001":
      case "116600-0003":
      case "116500LN-0001":
      case "126613LB-0002":
      case "226659-0002":
      case "116520-0015":
      case "126710BLNR-0003":
      case "124273-0001":
      case "16233 CHP IX JUB":
      case "124300-0005":
      case "126603-0001":
      case "116619LB-0001":
      case "126613LN-0002":
      case "16710 COKE OYS":
      case "214270-0001":
      case "16600 BLK IX OYS":
      case "126715CHNR-0001":
      case "126660-0001":
      case "1675 BLK PEP OYS":
      case "124300-0006":
      case "116681-0001":
      case "126710BLRO-0002":
      case "116680-0002":
      case "116660-0003":
      case "116506-0001":
      case "116680-0001":
        return (
          "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + newRefNum
        );

      default:
        return (
          "https://www2.europeanwatch.com/cgi-bin/search.pl?search=" + refNum
        );
    }
  },
  WatchFinder: function (refNum, newRefNum) {
    switch (refNum) {
      case "116500LN-0002": // REGULAR --> SHORTENED --> BLACK DIAL
      case "16610 BLK OYS":
      case "116400GV-0001":
      case "16570 BLK IX OYS":
      case "116300-0001":
      case "226570-0002":
      case "124300-0002":
      case "116520-0015":
      case "1675 BLK PEP OYS":
      case "126300-0012":
      case "126660-0001":
      case "116200-0059":
      case "116660-0001":
      case "116400-0001":
      case "226659-0002":
      case "216570-0002":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=Black"
        );

      case "116500LN-0001": // REGULAR --> SHORTENED --> WHITE DIAL
      case "16570 WHT IX OYS":
      case "216570-0001":
      case "116520-0016":
      case "116400-0002":
      case "226570-0001":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=White"
        );

      case "116400GV-0002": // REGULAR --> SHORTENED --> BLUE DIAL
      case "5711/1A-010":
      case "116400GV-0002":
      case "16613 BLU IX OYS":
      case "116509-0071":
      case "126300-0001":
      case "116506-0001":
      case "116622-0001":
      case "126622-0002":
      case "326934-0003":
      case "126334-0002":
      case "124300-0003":
      case "116660-0003":
      case "326934-0004":
      case "126660-0002":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=Blue"
        );

      case "16233 CHP IX JUB": // REGULAR --> SHORTENED --> CHAMPAGNE DIAL
      case "326933-0001":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=Champagne"
        );

      case "124300-0005": // REGULAR --> SHORTNENED --> GREEN DIAL
      case "116508-0013":
      case "126000-0005":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=Green"
        );

      case "116519LN-0024": // REGULAR --> SHORTENED --> SILVER DIAL
      case "116200-0056":
        return (
          "https://www.watchfinder.com/search?q=" +
          newRefNum +
          "&filterDial=Silver"
        );

      case "116610LN-0001": // REGULAR --> SHORTENED
      case "126610LV-0002":
      case "126610LN-0001":
      case "116610LV-0002":
      case "114060-0002":
      case "116900-0001":
      case "116681-0001":
      case "79830RB-0001":
      case "126715CHNR-0001":
      case "114270-0001":
      case "116680-0001":
      case "116719BLRO-0001":
      case "126710BLNR-0002":
      case "214270-0001":
      case "124273-0001":
      case "214270-0003":
      case "16710 COKE OYS":
      case "116613LN-0001":
      case "126711CHNR-0002":
      case "116619LB-0001":
      case "116710BLNR-0002":
      case "126603-0001":
      case "124270-0001":
      case "79250BM-0001":
      case "116680-0002":
      case "16600 BLK IX OYS":
      case "16610LV":
      case "124060-0001":
      case "126613LB-0002":
      case "126710BLNR-0003":
      case "79030B-0001":
      case "126600-0001":
      case "126710BLRO-0001":
      case "126710BLRO-0002":
      case "116710LN-0001":
        return "https://www.watchfinder.com/search?q=" + newRefNum;
      default:
        return "https://www.watchfinder.com/search?q=" + refNum;
    }
  },
};

/**
 * @param {String} website that the special link belongs under
 * @param {String} refNum that the special link belongs to
 * @returns {String} that corresponds the correct link for that website and refNum
 */
function getLink(website, refNum) {
  dashIndex = refNum.indexOf("-");
  spaceIndex = refNum.indexOf(" ");
  slashIndex = refNum.indexOf("/");
  list = [dashIndex, spaceIndex, slashIndex];
  if (dashIndex + spaceIndex + slashIndex === -3) {
    return specialSites[String(website)](String(refNum), String(refNum));
  } else {
    mainIndex = Number.MAX_SAFE_INTEGER;
    for (var i = 0; i < list.length; i++) {
      if (list[i] < mainIndex && list[i] != -1) {
        mainIndex = list[i];
      }
    }
    newRefNum = refNum.substring(0, mainIndex);
    return specialSites[String(website)](String(refNum), newRefNum);
  }
}

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

function sendMessage(str) {
  const twilio = require("twilio");
  const client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: str,
      to: "2154210016",
      from: trialNumber,
    })
    .then(() => console.log("\nSending message...\n"));
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

async function reTry(page, iter) {
  if (iter < 3) {
    console.log("Re-trying...");
    await page.waitForTimeout(Math.random() * 3);
    await page.goto(page.url()).catch(async () => {
      await reTry(page, iter + 1);
    }); // Becomes recursive function until the page loads.
    await page.waitForTimeout(500);
  }
}

function joinDataToArchivesAndCompilation() {
  files = fs.readdirSync("./archives/");
  let fileData = fs.readFileSync("data.csv").toString();
  fileData = fileData.substring(fileData.indexOf("\n") + 1);
  fs.appendFileSync("compilation.csv", fileData);
  console.log(files[1] + "\n" + getKey());
  console.log("Compiled " + files.length + " scrapes");
  fs.renameSync("./data.csv", "./archives/" + getKey());
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
  timeToSendTEST,
  getLink,
  getKey,
  log,
  sendMessage,
  getPricesForAverage,
  reTry,
  joinDataToArchivesAndCompilation,
  createBlank,
};
