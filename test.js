const Watch = require("./DataStructures/Watch.js");
const Scrape = require("./DataStructures/Scrape.js");
const AllScrapes = require("./DataStructures/AllScrapes.js");
const utilFunc = require("./utilityFunctions");

const fs = require("fs");
const editJsonFile = require("edit-json-file");
const path = require("path");

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
    "www.pc.com",
    "www.pc.com",
    "www.pc.com"
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
    "1",
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
    "www.pc.com",
    "www.pc.com",
    "www.pc.com"
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
    "69,000",
    "17,000",
    "",
    "",
    "www.charlie.com",
    "www.charlie.com",
    "www.charlie.com"
  );
  scrape1.addWatch(w1);
  scrape1.addWatch(w2);
  scrape2.addWatch(w3);
  scrape1.addWatch(w4);
  AllScrapes.addScrape(scrape1);
  AllScrapes.addScrape(scrape2);

  data = JSON.stringify(AllScrapes.getDict(), null, 3);

  // check to see if file already exists. If it does then append it
  // if not then write normally with code below.
  fs.writeFile(
    "/Users/charlesweiss/Desktop/CharlieWebscrapeTest/data.json",
    data,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  // let data = fs.readFileSync("data.json");
  // let parsed = JSON.parse(data);
  // parsed["charlie"]["3"].push(w4);
  // fs.writeFileSync("data.json", JSON.stringify(parsed, null, 3));
};
start();
