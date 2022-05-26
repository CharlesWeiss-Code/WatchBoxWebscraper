class AllScrapes {
  constructor() {
    this.startOfScraping = new Date();
    this.allScrapes = []; // [scrape]
    this.dict = new Map(); // {Site, {refNum, [watch]]}}
  }

  addScrape = (s) => {
    this.allScrapes.push(s);
    this.addToDict(s);
  };

  addToDict = (scrape) => {
    scrape.getDict().forEach((entry) => {
      // {Site, {refNum, Watch}}

      entry.values().forEach((secondEntry) => {
        // {refNum, Watch}
        if (this.dict.get(entry.key) === undefined) {
          this.dict.set(entry.key, new Map());
        }
        if (this.dict.get(entry.key).get(secondEntry.key) === undefined) {
          this.dict.get(entry.key).set(secondEntry.key, []);
        }
        this.dict.get(entry.key).get(secondEntry.key).push(secondEntry.value);
      });
    });
  };

  getScrapesByTime = (d) => {
    var result = [];
    this.allScrapes.forEach((s) => {
      if (s.getDate() === d) {
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
