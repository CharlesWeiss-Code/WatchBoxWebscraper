const utilFunc = require("../utilityFunctions.js");

class AllScrapes {
  constructor() {
    this.startOfScraping = new Date();
    this.allScrapes = []; // [scrape] = [{Site, {refNum, Watch}}]
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
        }
        this.dict.get(site).get(refNum).push(watch);
      }
    }
  };

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

  getStartOfScraping = () => this.startOfScraping;

  getWatchByWebsiteAndDate = (refNum, site, d) => {
    this.dict
      .get(site)
      .get(refNum)
      .forEach((watch) => {
        if (watch.getDate() === d) {
          return watch;
        }
      });
  };

  getWatchesByDate = (refNum, d) => {
    var result = [];
    this.getScrapesByTime(d).forEach((scrape) => {
      //[{Site, {refNum, Watch}}]
      for (const [site, map] of scrape.getDict().entries()) {
        // {site, {refNum, Watch}}
        for (const [ref, watch] of map.entries()) {
          if (utilFunc.sameDate(watch.getDate(), d) && refNum === ref) {
            result.push(watch);
          }
        }
      }
    });
    return result;
  };

  getDict = () => this.dict;

  getWebsite = (site) => this.dict.get(site);
}

module.exports = AllScrapes;
