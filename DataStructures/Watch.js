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
    generalLink
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
  }

  setScrape = (s) => {
    this.scrape = s;
  };

  setDate = (m, d, y) => {
    this.dateOfScrape = new Date(m, d, y);
  };

  getLowDealerStatus = () => {
    return this.lowDealerStatus;
  };

  getHighDealerStatus = () => {
    return this.highDealerStatus;
  };

  getRefNum = () => {
    return this.refNum;
  };

  getScrape = () => {
    return this.scrape;
  };

  getGeneralLink = () => {
    return this.generalLink;
  };

  getLowBP = () => {
    return this.lowBP;
  };

  getHighBP = () => {
    return this.highBP;
  };

  getLowPrice = () => {
    return this.lowPrice;
  };

  getHighPrice = () => {
    return this.highPrice;
  };

  getLowLink = () => {
    return this.lowLink;
  };

  getHighLink = () => {
    return this.highLink;
  };

  getLowPaper = () => {
    return this.lowPaper;
  };

  getHighPaper = () => {
    return this.highPaper;
  };

  getDateOfScrape = () => {
    return this.dateOfScrape;
  };

  getLowBox = () => {
    return this.lowBox;
  };

  getHighBox = () => {
    return this.highBox;
  };
}

module.exports = Watch;
