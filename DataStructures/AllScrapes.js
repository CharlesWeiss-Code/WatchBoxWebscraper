class AllScrapes {
  constructor() {
    this.startOfScraping = new Date();
    this.allScrapes = []; // [scrape]
    this.dict = new Map(); // {Site, {refNum, [watch]]}}
  }

  addScrape = (s) => {
    this.allScrapes.push(s);
    //console.log(this.allScrapes[0].getDict());
    this.addToDict(s);
  };

  addToDict = (scrape) => {
    for (const [site, val] of scrape.getDict().entries()) {
      // {Site, {refNum, Watch}}
      if (this.dict.get(site) === undefined) {
        this.dict.set(site, new Map());
        //console.log("new Map");
      }
      for (const [refNum, watch] of val) {
        // this isnt a real loop. it is used to get the key and value out of val
        if (this.dict.get(site).get(refNum) === undefined) {
          this.dict.get(site).set(refNum, new Array());
          //console.log("new array");
        }
        //console.log(this.dict.get(site).get(refNum));
        this.dict.get(site).get(refNum).push(watch);
        //console.log(this.dict.get(site).get(refNum));
      }
    }
  };

  getScrapesByTime = (d) => {
    var result = [];
    this.allScrapes.forEach((s) => {
      if (s.getDate().equals(d)) {
        result.push(s);
      }
    });
    return result;
  };

  getAllScrapes = () => {
    return this.allScrapes;
  };

  getWatchesByTime = (refNum, d) => {
    const byTime = getScrapesByTime(d);
    var result = [];
    byTime.forEach((s) => {
      result.add(s.getWatch(refNum));
    });
    return result;
  };

  getStartOfScraping = () => {
    return this.startOfScraping;
  };

  getDict = () => {
    return this.dict;
  };
}

module.exports = AllScrapes;
