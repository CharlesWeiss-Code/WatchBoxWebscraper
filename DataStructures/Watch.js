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
    lowLink,
    highLink
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
    this.dateOfScrape = new Date();
  }

  setScrape = (s) => {
    this.scrape = s;
  };

  setDate = (m, d, y) => {
    this.dateOfScrape = new Date(m, d, y);
  };

  getRefNum = () => {
    return this.refNum;
  };

  getScrape = () => {
    return this.scrape;
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
