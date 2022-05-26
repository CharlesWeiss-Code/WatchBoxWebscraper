const Watch = require("./DataStructures/Watch.js");
const Scrape = require("./DataStructures/Scrape.js");
const AllScrapes = require("./DataStructures/AllScrapes.js");

start = () => {
  all = new AllScrapes();
  scrape1 = new Scrape();
  w1 = new Watch(
    "116500LN-0001",
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
    "116500LN-0001",
    "2027",
    "2048",
    "NO",
    "Yes",
    "No",
    "yes",
    "2",
    "90",
    "https://www.weiss.com",
    "https://www.weiss.com"
  );
  w3 = new Watch(
    "116500LN-0001",
    "2027",
    "2048",
    "NO",
    "Yes",
    "No",
    "yes",
    "2",
    "90",
    "https://www.weiss.com",
    "https://www.weiss.com"
  );
  w3.setDate(1, 1, 1);
  scrape1.addWatch(w1, "google");
  scrape1.addWatch(w2, "weiss");
  all.addScrape(scrape1);

  console.log(all.getDict().get("google"));
};

start();
