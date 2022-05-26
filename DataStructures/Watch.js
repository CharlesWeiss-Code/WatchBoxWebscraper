export class Watch {
  constructor(
    refNum,
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
    this.dateOfScrape = new Date();
  }

  setScrape = (s) => {
    scrape = s;
  };

  getRefNum = () => {
    return refNum;
  };

  getScrape = () => {
    return scrape;
  };

  getLowPrice = () => {
    return lowPrice;
  };

  getHighPrice = () => {
    return highPrice;
  };

  getLowLink = () => {
    return lowLink;
  };

  getHighLink = () => {
    return highLink;
  };

  getLowPaper = () => {
    return lowPaper;
  };

  getHighPaper = () => {
    return highPaper;
  };

  getDateOfScrape = () => {
    return dateOfScrape;
  };

  getLowBox = () => {
    return lowBox;
  };

  getHighBox = () => {
    return highBox;
  };
}
