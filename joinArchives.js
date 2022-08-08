const fs = require("fs");
const utilFunc = require('./utilityFunctions')


(() => {
  files = fs.readdirSync("./archives/");
  let fileData = fs.readFileSync("data.csv").toString();
  fileData = fileData.substring(fileData.indexOf("\n") + 1);
  fs.appendFileSync("compilation.csv", fileData);
  console.log(files[1] + "\n"+utilFunc.getKey());
  console.log("Compiled " + files.length + " scrapes");
})();
