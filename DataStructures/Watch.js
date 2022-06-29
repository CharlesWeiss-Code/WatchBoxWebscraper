class Watch {
  constructor(
    refNum,
    lowAge,
    highAge,
    lowBox,
    lowPaper,
    lowBP,
    highBox,
    highPaper,
    highBP,
    lowPrice,
    highPrice,
    lowDealerStatus,
    highDealerStatus,
    lowLink,
    highLink,
    generalLink,
    imageLow,
    imageHigh
  ) {
    this.refNum = refNum;
    this.lowBox = lowBox;
    this.lowPaper = lowPaper;
    this.highBox = highBox;
    this.highPaper = highPaper;
    this.lowPrice = lowPrice;
    this.highPrice = highPrice;
    this.highLink = highLink;
    this.lowLink = lowLink;
    this.lowAge = lowAge;
    this.highAge = highAge;
    this.lowDealerStatus = lowDealerStatus;
    this.highDealerStatus = highDealerStatus;
    this.lowBP = lowBP;
    this.highBP = highBP;
    this.generalLink = generalLink;
    /**
     * possibly delete dateOfScrape field because the name of the json object in S3
     * will be the date
     */
    this.dateOfScrape = new Date().toUTCString().replace(",","");
    this.imageLow = imageLow;
    this.imageHigh = imageHigh;
    this.website;

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
  }

  setDate(m, d, y){
    this.dateOfScrape = new Date(m, d, y);
  };

  getLowDealerStatus() {
    return this.lowDealerStatus;
  }

  getHighDealerStatus() {
    return this.highDealerStatus;
  }

  getWebsite() {
    return this.website;
  }

  getRefNum() {
    return this.refNum;
  }

  getGeneralLink() {
    return this.generalLink;
  }

  getLowBP() {
    return this.lowBP;
  }

  getHighBP() {
    return this.highBP;
  }

  getLowPrice() {
    return this.lowPrice;
  }

  getHighPrice() {
    return this.highPrice;
  }
  getLowLink() {
    return this.lowLink;
  }

  getHighLink() {
    return this.highLink;
  }

  getLowPaper() {
    return this.lowPaper;
  }

  getHighPaper() {
    return this.highPaper;
  }
  getDate() {
    return this.dateOfScrape;
  }

  getLowBox() {
    return this.lowBox;
  }

  getHighBox() {
    return this.highBox;
  }
}

module.exports = Watch;
