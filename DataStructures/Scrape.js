class Scrape {
  // create a new scrape every session. As watches are completeed,
  // they are added to the arraylist

  constructor() {
    this.dateOfScrape = new Date();
    this.dict = new Map(); //{Site, {refNum, Watch}}
  }

  addWatch = (w, site) => {
    if (this.dict.get(site) === undefined) {
      this.dict.set(site, new Map());
    }
    this.dict.get(site).set(w.getRefNum(), w);
    w.setScrape(this);
  };

  addWatches = (list, site) => {
    if (this.dict.get(site) === undefined) {
      this.dict.set(site, new Map());
    }
    list.forEach((watch) => {
      this.dict.get(site).set(watch.getRefNum(), watch);
    });
  };

  getDate = () => {
    return this.dateOfScrape;
  };

  getDict = () => {
    return this.dict;
  };

  getWatchByWebsite = (refNum, site) => {
    return this.dict.get(site).get(refNum);
  };
}

module.exports = Scrape;
