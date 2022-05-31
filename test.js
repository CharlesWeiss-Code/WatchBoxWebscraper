const Watch = require("./DataStructures/Watch.js");
const Scrape = require("./DataStructures/Scrape.js");
const AllScrapes = require("./DataStructures/AllScrapes.js");
const { all } = require("express/lib/application");

start = () => {
  var all = new AllScrapes();
  scrape1 = new Scrape();
  scrape2 = new Scrape();
  w1 = new Watch(
    "1",
    "2007",
    "2018",
    "NO",
    "Yes",
    "No",
    "yes",
    "1184934",
    "902343",
    "https://www.google.com",
    "https://www.google.com"
  );
  w2 = new Watch(
    "2",
    "2027",
    "2048",
    "NO",
    "Yes",
    "No",
    "yes",
    "2",
    "90",
    "https://www.ebay.com",
    "https://www.ebay.com"
  );
  w3 = new Watch(
    "3",
    "7128",
    "2048",
    "NO",
    "Yes",
    "No",
    "yes",
    "2",
    "90",
    "https://www.charlie.com",
    "https://www.charlie.com"
  );
  w3.setDate(1, 1, 1);
  w4 = new Watch(
    "3",
    "1000",
    "23488",
    "NO",
    "Yes",
    "No",
    "yes",
    "2",
    "90",
    "https://www.charlie.com",
    "https://www.charlie.com"
  );
  scrape1.addWatch(w1, "google");
  scrape1.addWatch(w2, "ebay");
  scrape1.addWatch(w3, "Charlie");
  scrape2.addWatch(w4, "Charlie");
  all.addScrape(scrape1);
  all.addScrape(scrape2);

  //console.log(all.getDict());
  console.log(all.getWebsite("ebay"));
  //console.log(all.getWebsite("Charlie"));
};

start();
