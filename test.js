const Watch = require("./DataStructures/Watch.js");
const Scrape = require("./DataStructures/Scrape.js");
const AllScrapes = require("./DataStructures/AllScrapes.js");

start = () => {
  scrape1 = new Scrape();
  scrape2 = new Scrape();
  w1 = new Watch(
    "1",
    "2007",
    "2018",
    "Yes",
    "No",
    "",
    "No",
    "Yes",
    "",
    "17,000",
    "22,000",
    "",
    "",
    "www.google.com",
    "www.google.com",
    "www.google.com"
  );
  w2 = new Watch(
    "2",
    "2019",
    "2022",
    "Yes",
    "Yes",
    "",
    "No",
    "Yes",
    "",
    "5,000",
    "7,950",
    "Yes",
    "Yes",
    "www.ebay.com",
    "www.ebay.com",
    "www.ebay.com"
  );
  w3 = new Watch(
    "3",
    "1993",
    "2005",
    "",
    "",
    "BP",
    "",
    "",
    "P",
    "55,000",
    "72,000",
    "",
    "",
    "www.google.com",
    "www.google.com",
    "www.google.com"
  );
  w4 = new Watch(
    "3",
    "2022",
    "2022",
    "Yes",
    "No",
    "",
    "Yes",
    "No",
    "",
    "17,000",
    "17,000",
    "",
    "",
    "www.charlie.com",
    "www.charlie.com",
    "www.charlie.com"
  );
  scrape1.addWatch(w1);
  scrape1.addWatch(w2);
  scrape1.addWatch(w3);
  scrape2.addWatch(w4);
  AllScrapes.addScrape(scrape1);
  AllScrapes.addScrape(scrape2);

  console.log(AllScrapes.getAllWatches());
};

start();
