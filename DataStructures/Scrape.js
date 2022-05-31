class Scrape {
  // create a new scrape every session. As watches are completeed,
  // they are added to the arraylist

  constructor() {
    this.dateOfScrape = new Date();
    this.dict = new Map(); //{Site, {refNum, Watch}}
  }
  // adds a scraped watch to the dictionary

  addWatch = (w) => {
    const site = w.getWebsite();
    if (this.dict.get(site) === undefined) {
      this.dict.set(site, new Map());
    }
    this.dict.get(site).set(w.getRefNum(), w);
    w.setScrape(this);
  };

  getDate = () => {
    return this.dateOfScrape;
  };

  getDict = () => {
    return this.dict;
  };
  //gets a specific watch in a website
  getWatchByWebsite = (refNum, site) => {
    //{Site, {refNum, Watch}}
    return this.dict.get(site).get(refNum);
  };
  // groups all watches of refNum 'refNum' and returns them as an array
  getWatch = (refNum) => {
    var result = [];
    //{Site, {refNum, Watch}}
    for (const [site, map] of this.dict.entries()) {
      for (const [ref, watch] of map.entries()) {
        if (refNum === ref) {
          result.push(watch);
        }
      }
    }
    return result;
  };
}

module.exports = Scrape;
