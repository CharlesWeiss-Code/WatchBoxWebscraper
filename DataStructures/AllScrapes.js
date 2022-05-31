class AllScrapes {
  constructor() {
    this.startOfScraping = new Date();
    this.allScrapes = []; // [scrape]
    this.dict = new Map(); // {Site, {refNum, [watch]}}
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
        this.dict.get(site).get(refNum).push(watch);
      }
    }
  };

  getScrapesByTime = (m, d, y) => {
    var result = [];
    this.allScrapes.forEach((s) => {
      const scrapeDate = s.getDate();
      if (
        scrapeDate.getMonth() + 1 === m &&
        scrapeDate.getDate() === d &&
        scrapeDate.getFullYear() === y
      ) {
        result.push(s);
      }
    });
    return result;
  };

  getAllScrapes = () => {
    return this.allScrapes;
  };

  getWatches = (refNum) => {
    var result = [];
    //{Site, {refNum, [watch]}}
    this.allScrapes.forEach((s) => {
      for (const [site, map] of s.getDict().entries()) {
        for (const [ref, watchArray] of map.entries()) {
          // {refNum, [watch]}
          if (ref === refNum) {
            result.push(watchArray);
          }
        }
      }
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
