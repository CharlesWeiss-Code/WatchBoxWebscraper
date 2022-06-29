const AllScrapes = require("./AllScrapes");

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
    this.dateOfScrape = new Date();
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

    // if (this.generalLink.indexOf(".") != -1) {
    //   this.website = this.generalLink.substring(
    //     this.generalLink.indexOf(".") + 1,
    //     this.generalLink.indexOf(".com")
    //   );
    // } else {
    //   this.webste = this.generalLink.substring(
    //     this.generalLink.indexOf("//") + 2,
    //     this.generalLink.indexOf(".com")
    //   );
    // }

    // var thing = this.generalLink.indexOf("www.");
    // if (thing === -1) {
    //   thing = this.generalLink.indexOf("https://") + 8;
    //   this.website = this.generalLink.substring(
    //     thing,
    //     this.generalLink.indexOf(".com")
    //   );
    // } else if (this.generalLink.indexOf("www2.") != -1) {
    //   this.website = this.generalLink.substring(
    //     this.generalLink.indexOf("www2.") + 5,
    //     this.generalLink.indexOf(".com")
    //   );
    // } else {
    //   this.website = this.generalLink.substring(
    //     thing + 4,
    //     this.generalLink.indexOf(".com")
    //   );
    // }
    this.watchScrapeNum = AllScrapes.totalWatches;
    AllScrapes.totalWatches++;
  }

  setScrape = (s) => {
    this.scrape = s;
  };

  setDate = (m, d, y) => {
    this.dateOfScrape = new Date(m, d, y);
  };

  getLowDealerStatus = () => this.lowDealerStatus;

  getHighDealerStatus = () => this.highDealerStatus;

  getWebsite = () => this.website;

  getRefNum = () => this.refNum;

  getScrape = () => this.scrape;

  getGeneralLink = () => this.generalLink;

  getLowBP = () => this.lowBP;

  getHighBP = () => this.highBP;

  getLowPrice = () => this.lowPrice;

  getHighPrice = () => this.highPrice;

  getLowLink = () => this.lowLink;

  getHighLink = () => this.highLink;

  getLowPaper = () => this.lowPaper;

  getHighPaper = () => this.highPaper;

  getDate = () => this.dateOfScrape;

  getLowBox = () => this.lowBox;

  getHighBox = () => this.highBox;
}

module.exports = Watch;
