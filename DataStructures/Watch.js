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
    this.dateOfScrape = new Date();
    this.imageLow = imageLow;
    this.imageHigh = imageHigh;
    this.website = this.generalLink.substring(
      0,
      this.generalLink.indexOf(".com") + 4
    );
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

  getDateOfScrape = () => this.dateOfScrape;

  getLowBox = () => this.lowBox;

  getHighBox = () => this.highBox;
}

module.exports = Watch;
