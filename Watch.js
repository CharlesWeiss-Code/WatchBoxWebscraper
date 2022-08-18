/**
 * The class that astracts a virtual watch from our competetor's websites.
 */

class Watch {
  constructor(
    refNum,
    lowAge,
    highAge,
    lowBox,
    lowPaper,
    highBox,
    highPaper,
    lowPrice,
    highPrice,
    lowDealerStatus,
    highDealerStatus,
    lowLink,
    highLink,
    generalLink,
    imageLow,
    imageHigh,
    brandLow,
    brandHigh,
    lowSku,
    highSku
  ) {
    this.refNum = refNum;
    this.lowBox = lowBox;
    this.lowPaper = lowPaper;
    this.highBox = highBox;
    this.highPaper = highPaper;
    this.lowPrice = lowPrice.replaceAll("$", "");
    this.lowPrice = this.lowPrice.replaceAll(",", "");
    this.highPrice = highPrice.replaceAll("$", "");
    this.highPrice = this.highPrice.replaceAll(",", "");
    this.highLink = highLink;
    this.lowLink = lowLink;
    this.lowAge = lowAge;
    this.highAge = highAge;
    this.lowDealerStatus = lowDealerStatus;
    this.highDealerStatus = highDealerStatus;
    this.generalLink = generalLink;
    /**
     * possibly delete dateOfScrape field because the name of the json object in S3
     * will be the date
     */
    var date = new Date();
    this.dateOfScrape = date.getFullYear() + "_";
    if (parseInt(date.getMonth()) + 1 < 10) {
      this.dateOfScrape += "0" + parseInt(date.getMonth() + 1) + "_";
    } else {
      this.dateOfScrape += date.getMonth() + 1 + "_";
    }
    if (parseInt(date.getDate()) < 10) {
      this.dateOfScrape += "0" + date.getDate();
    } else {
      this.dateOfScrape += date.getDate();
    }

    this.imageLow = imageLow;
    this.imageHigh = imageHigh;
    this.website;
    this.brandLow = brandLow;
    this.brandHigh = brandHigh;

    if (this.generalLink.indexOf("www2.") != -1) {
      this.website = this.generalLink.substring(
        this.generalLink.indexOf("www2.") + 5,
        this.generalLink.indexOf(".com")
      );
    } else if (this.generalLink.indexOf("www.") === -1) {
      this.website = this.generalLink.substring(
        this.generalLink.indexOf("//") + 2,
        this.generalLink.indexOf(".com")
      );
    } else if (this.generalLink.indexOf("www.") != -1) {
      this.website = this.generalLink.substring(
        this.generalLink.indexOf("www.") + 4,
        this.generalLink.indexOf(".com")
      );
    }
    console.log("'" + this.website + "'");
    switch (this.website) {
      case "europeanwatch":
        this.website = "EWC";
        break;

      case "davidsw":
        this.website = "DavidSW";
        break;

      case "luxurybazaar":
        this.website = "LuxuryBazaar";
        break;

      case "crownandcaliber":
        this.website = "C&C";
        break;

      case "bobswatches":
        this.website = "Bobs";
        break;
      case "chrono24":
        this.website = "C24";
        break;
      case "watchfinder":
        this.website = "WatchFinder";
        break;
      default:
        this.website = "";
        break;
    }

    this.lowSku = lowSku;
    this.highSku = highSku;
  }

  setDate(m, d, y) {
    this.dateOfScrape = new Date(m, d, y);
  }
}

module.exports = Watch;
