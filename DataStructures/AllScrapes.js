export class AllScrapes {
  constructor() {
    startOfScraping = new Date();
    allScrapes = []; // holdes all scrapes
    dict = {}; // {String(refNum), ArrayList<Watch>}
  }

  addScrape = (s) => {
    allScrapes.add(s);
    addToDict(s);
  };

  addToDict = (s) => {
    s.getDict()
      .entrySet()
      .forEach((entry) => {
        dict.get(entry.getKey()).push(entry.getValue());
      });
  };

  getScrapesByTime = (d) => {
    var result = [];
    allScrapes.forEach((s) => {
      if (s.getDate() === d) {
        result.push(s);
      }
    });
    return result;
  };

  getAllScrapes = () => {
    return allScrapes;
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
    return startOfScraping;
  };

  getDict = () => {
    return dict;
  };
}
