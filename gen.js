const fs = require("fs");
const refNums = require("./refNums.js");
sites = [
  "bobswatches",
  "davidsw",
  "luxurybazaar",
  "europeanwatch",
  "chrono24",
  "crownandcaliber",
];

var dict = {};
start = () => {
  for (const site of sites) {
    // {Site, {refNum, Watch}}
    if (dict[site] === undefined) {
      dict[site] = new Map();
    }
    for (const refNum of refNums.getRefNums()) {
      if (dict[site][refNum] === undefined) {
        dict[site][refNum] = new Array();
      }
    }
  }

  data = JSON.stringify(dict, null, 3);
  fs.writeFile(
    "/Users/charlesweiss/Desktop/CharlieWebscrapeTest/blank.json",
    data,
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );

  console.log("Created new data json file");
};

start();
