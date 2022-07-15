/**
 * This file contains many functions that are commonly used, or just don't have any other logical home.
 */

const fs = require("fs");
const request = require("request");
const Watch = require("./Watch");
const AWS = require("aws-sdk");
const awsInfo = require("./aws/aws-info");
const { Puppeteer } = require("puppeteer");



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
    String(await page.$eval(selector, (el) => el.textContent)).indexOf(str) != -1
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
    fs.renameSync("./data.csv", "./archives/"+utilFunc.getKey())
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

/**
 * @param {String} website that the special link belongs under
 * @param {String} refNum that the special link belongs to
 * @returns {String} that corresponds the correct link for that website and refNum
 */
getLink = (website, refNum) => specialSites[String(website)](String(refNum))

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
  getKey
};
