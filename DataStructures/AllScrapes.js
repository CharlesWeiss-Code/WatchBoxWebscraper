class AllScrapes {
  constructor() {
    this.startOfScraping = new Date();
    this.allScrapes = []; // [scrape] = [{Site, {refNum, Watch}}]
    this.dict = new Map(); // {Site, {refNum, [watch]}}
  }

  // works
  addScrape = (s) => {
    this.allScrapes.push(s);
    //console.log(this.allScrapes[0].getDict());
    this.addToDict(s);
  };

  //works
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

  //works
  getScrapesByTime = (d) => {
    var result = [];
    this.allScrapes.forEach((s) => {
      const scrapeDate = s.getDate();
      if (
        scrapeDate.getMonth() + 1 === d.getMonth() + 1 &&
        scrapeDate.getDate() === d.getDate() &&
        scrapeDate.getFullYear() === d.getFullYear()
      ) {
        result.push(s);
      }
    });
    return result;
  };

  getAllScrapes = () => {
    return this.allScrapes;
  };

  // works
  getWatches = (refNum) => {
    var result = [];
    for (const [site, map] of this.dict.entries()) {
      //console.log(site, map);
      for (const [ref, watchArray] of map.entries()) {
        if (ref === refNum) {
          result.push(...watchArray);
        }
      }
    }
    return result;
  };

  getStartOfScraping = () => {
    return this.startOfScraping;
  };

  getDict = () => {
    return this.dict;
  };

  getWebsite = (site) => {
    return this.dict.get(site);
  };
}

module.exports = AllScrapes;
