export class Scrape {
  // create a new scrape every session. As watches are completeed,
  // they are added to the arraylist

  constructor() {
    dateOfScrape = new Date();
    dict = {};
  }

  addWatch = (w) => {
    dict.set(w.getRefNum(), w);
  };

  getDate = () => {
    return dateOfScrape;
  };

  getDict = () => {
    return dict;
  };

  getWatch = (refNum) => {
    return dict.get(refNum);
  };
}
