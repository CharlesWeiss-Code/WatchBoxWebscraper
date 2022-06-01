const utilFunc = require("../utilityFunctions.js");

class AllScrapes {
  static totalScrapes = 0;
  static totalWatches = 0;
  static allScrapes = []; // [scrape] = [{Site, {refNum, Watch}}]
  static dict = new Map(); // {} = {Site, {refNum, [watch]}}
  static startOfScraping = new Date();

  static addScrape = (s) => {
    this.allScrapes.push(s);
    //console.log(this.allScrapes[0].getDict());
    this.addToDict(s);
  };

  static addToDict = (scrape) => {
    for (const [site, val] of scrape.getDict().entries()) {
      // {Site, {refNum, Watch}}
      if (this.dict[site] === undefined) {
        this.dict[site] = new Map();
      }
      for (const [refNum, watch] of val) {
        if (this.dict[site][refNum] === undefined) {
          this.dict[site][refNum] = new Array();
        }
        this.dict[site][refNum].push(watch);
      }
    }
  };

  static getScrapesByTime = (d) => {
    var result = [];
    this.allScrapes.forEach((s) => {
      const scrapeDate = s.getDate();
      if (utilFunc.sameDate(scrapeDate, d)) {
        result.push(s);
      }
    });
    return result;
  };

  static getTotalScrapes = () => this.totalScrapes;
  static getAllScrapes = () => this.allScrapes;

  static getWatches = (refNum) => {
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

  static getStartOfScraping = () => this.startOfScraping;

  static getWatchByWebsiteAndDate = (refNum, site, d) => {
    this.dict
      .get(site)
      .get(refNum)
      .forEach((watch) => {
        if (watch.getDate() === d) {
          return watch;
        }
      });
  };

  static getWatchesByDate = (refNum, d) => {
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

  static getDict = () => this.dict;

  static getWebsite = (site) => this.dict.get(site);

  static getAllWatches = () => {
    var result = [];
    for (const [site, map] of this.dict.entries()) {
      for (const [refNum, watchArray] of map.entries()) {
        result.push(...watchArray);
      }
    }
    return result;
  };
}

module.exports = AllScrapes;
